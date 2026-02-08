#!/usr/bin/env python3
"""
Script to automatically replace duplicate profile queries with optimized version.
This script updates all files to use the new profile_utils module.

Usage:
    python scripts/optimize_profile_queries.py --dry-run  # Preview changes
    python scripts/optimize_profile_queries.py            # Apply changes
"""

import os
import re
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

BACKEND_DIR = Path(__file__).parent.parent
DRY_RUN = '--dry-run' in sys.argv


def find_files_with_pattern(pattern, directory):
    """Find all Python files containing the pattern."""
    files = []
    for root, dirs, filenames in os.walk(directory):
        # Skip migrations, tests, and venv
        if any(skip in root for skip in ['migrations', '__pycache__', 'venv', '.git']):
            continue
        
        for filename in filenames:
            if filename.endswith('.py'):
                filepath = Path(root) / filename
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if pattern in content:
                            files.append(filepath)
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")
    
    return files


def add_import_if_missing(content, filepath):
    """Add import statement for profile_utils if not present."""
    import_statement = "from numerology.profile_utils import get_numerology_profile"
    
    # Check if already imported
    if 'from numerology.profile_utils import' in content:
        return content
    
    # Find the best place to add the import
    # Look for other numerology imports
    numerology_import_pattern = r'from \.models import|from numerology\.models import'
    match = re.search(numerology_import_pattern, content)
    
    if match:
        # Add after the models import
        insert_pos = content.find('\n', match.end())
        content = content[:insert_pos] + f'\n{import_statement}' + content[insert_pos:]
    else:
        # Add after Django imports
        django_import_pattern = r'from django\.[^\n]+\n'
        matches = list(re.finditer(django_import_pattern, content))
        if matches:
            last_match = matches[-1]
            insert_pos = last_match.end()
            content = content[:insert_pos] + f'{import_statement}\n' + content[insert_pos:]
        else:
            # Add at the beginning after docstring
            docstring_pattern = r'"""[^"]*"""\n|\'\'\'[^\']*\'\'\'\n'
            match = re.search(docstring_pattern, content)
            if match:
                insert_pos = match.end()
                content = content[:insert_pos] + f'{import_statement}\n' + content[insert_pos:]
            else:
                # Add at the very beginning
                content = f'{import_statement}\n{content}'
    
    return content


def replace_profile_queries(content, filepath):
    """Replace NumerologyProfile.objects.get(user=user) with optimized version."""
    changes = []
    
    # Pattern 1: Direct assignment
    pattern1 = r'(\s+)profile = NumerologyProfile\.objects\.get\(user=user\)'
    replacement1 = r'\1profile = get_numerology_profile(user)'
    
    new_content, count1 = re.subn(pattern1, replacement1, content)
    if count1 > 0:
        changes.append(f"Replaced {count1} direct profile assignments")
    
    # Pattern 2: Variable name variations
    pattern2 = r'(\s+)(\w+_profile) = NumerologyProfile\.objects\.get\(user=user\)'
    replacement2 = r'\1\2 = get_numerology_profile(user)'
    
    new_content, count2 = re.subn(pattern2, replacement2, new_content)
    if count2 > 0:
        changes.append(f"Replaced {count2} variable profile assignments")
    
    # Pattern 3: With select_related (already optimized, but use our utility)
    pattern3 = r'(\s+)profile = NumerologyProfile\.objects\.select_related\([^)]+\)\.get\(user=user\)'
    replacement3 = r'\1profile = get_numerology_profile(user)'
    
    new_content, count3 = re.subn(pattern3, replacement3, new_content)
    if count3 > 0:
        changes.append(f"Replaced {count3} select_related profile queries")
    
    # Pattern 4: In try-except blocks
    pattern4 = r'try:\s+profile = NumerologyProfile\.objects\.get\(user=user\)\s+except NumerologyProfile\.DoesNotExist:\s+return Response\(\{[^}]+\}, status=[^)]+\)'
    
    # This is more complex, we'll handle it separately
    if 'try:' in new_content and 'NumerologyProfile.objects.get(user=user)' in new_content:
        # For try-except blocks, suggest using @require_profile decorator instead
        changes.append("Found try-except blocks - consider using @require_profile decorator")
    
    return new_content, changes


def process_file(filepath):
    """Process a single file."""
    print(f"\nProcessing: {filepath.relative_to(BACKEND_DIR)}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        # Add import if needed
        content = add_import_if_missing(original_content, filepath)
        
        # Replace queries
        content, changes = replace_profile_queries(content, filepath)
        
        if content != original_content:
            if changes:
                for change in changes:
                    print(f"  ✓ {change}")
            
            if not DRY_RUN:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"  ✓ File updated")
            else:
                print(f"  ℹ Would update file (dry-run mode)")
            
            return True
        else:
            print(f"  ℹ No changes needed")
            return False
    
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def main():
    """Main function."""
    print("=" * 70)
    print("Profile Query Optimization Script")
    print("=" * 70)
    
    if DRY_RUN:
        print("\n⚠️  DRY RUN MODE - No files will be modified\n")
    else:
        print("\n⚠️  LIVE MODE - Files will be modified\n")
        response = input("Continue? (yes/no): ")
        if response.lower() != 'yes':
            print("Aborted.")
            return
    
    # Find all files with the pattern
    pattern = "NumerologyProfile.objects.get(user=user)"
    print(f"\nSearching for pattern: {pattern}")
    
    files = find_files_with_pattern(pattern, BACKEND_DIR)
    print(f"Found {len(files)} files with the pattern\n")
    
    if not files:
        print("No files to process.")
        return
    
    # Process each file
    updated_count = 0
    for filepath in files:
        if process_file(filepath):
            updated_count += 1
    
    # Summary
    print("\n" + "=" * 70)
    print("Summary")
    print("=" * 70)
    print(f"Total files found: {len(files)}")
    print(f"Files updated: {updated_count}")
    print(f"Files unchanged: {len(files) - updated_count}")
    
    if DRY_RUN:
        print("\n⚠️  This was a dry run. Run without --dry-run to apply changes.")
    else:
        print("\n✓ Optimization complete!")
        print("\nNext steps:")
        print("1. Review the changes with: git diff")
        print("2. Run tests to ensure everything works")
        print("3. Commit the changes")


if __name__ == '__main__':
    main()
