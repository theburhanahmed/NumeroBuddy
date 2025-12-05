#!/usr/bin/env python3
"""
Script to convert React Router pages to Next.js pages
"""
import os
import re
import sys
from pathlib import Path

def convert_page(content: str) -> str:
    """Convert a React Router page to Next.js format"""
    
    # Add 'use client' directive if not present
    if not content.startswith("'use client'"):
        content = "'use client';\n\n" + content
    
    # Replace useNavigate with useRouter
    content = re.sub(r"import.*useNavigate.*from 'react-router-dom'", 
                    "import { useRouter } from 'next/navigation'", content)
    content = re.sub(r"const navigate = useNavigate\(\);", 
                    "const router = useRouter();", content)
    content = re.sub(r"navigate\('([^']+)'\)", r"router.push('\1')", content)
    content = re.sub(r'navigate\("([^"]+)"\)', r'router.push("\1")', content)
    
    # Replace useLocation with usePathname
    content = re.sub(r"import.*useLocation.*from 'react-router-dom'", 
                    "import { usePathname } from 'next/navigation'", content)
    content = re.sub(r"const location = useLocation\(\);", 
                    "const pathname = usePathname();", content)
    content = re.sub(r"location\.pathname", "pathname", content)
    
    # Update import paths
    content = re.sub(r"from '\.\./components/", "from '@/components/", content)
    content = re.sub(r"from '\.\./contexts/", "from '@/contexts/", content)
    content = re.sub(r"from '\.\./hooks/", "from '@/hooks/", content)
    content = re.sub(r"from '\.\./utils/", "from '@/lib/", content)
    
    # Update component imports
    content = content.replace("GlassCard", "GlassCard")
    content = content.replace("GlassButton", "GlassButton")
    content = content.replace("PageLayout", "PageLayout")
    content = content.replace("AnimatedNumber", "AnimatedNumber")
    content = content.replace("LoadingSpinner", "LoadingSpinner")
    
    # Update context imports
    content = content.replace("ThemeContext", "theme-context")
    content = content.replace("AuthContext", "auth-context")
    content = content.replace("AIChatContext", "ai-chat-context")
    
    # Update hook imports
    content = content.replace("useForm", "use-form")
    
    return content

def main():
    source_dir = Path("temp-ui-repo/src/pages")
    target_dir = Path("frontend/src/app")
    
    if not source_dir.exists():
        print(f"Source directory {source_dir} does not exist")
        return
    
    # Create target directory if it doesn't exist
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Map of page files to Next.js routes
    page_mapping = {
        "Login.tsx": "login/page.tsx",
        "Signup.tsx": "register/page.tsx",
        "Dashboard.tsx": "dashboard/page.tsx",
        "Settings.tsx": "settings/page.tsx",
        "BirthChart.tsx": "birth-chart/page.tsx",
        "DailyReadings.tsx": "daily-reading/page.tsx",
        "LifePathAnalysis.tsx": "life-path/page.tsx",
        "CompatibilityChecker.tsx": "compatibility/page.tsx",
        "PhoneNumerology.tsx": "phone-numerology/page.tsx",
        "NameNumerology.tsx": "name-numerology/page.tsx",
        "BusinessNameNumerology.tsx": "business-name-numerology/page.tsx",
        "Remedies.tsx": "remedies/page.tsx",
        "Consultations.tsx": "consultations/page.tsx",
        "PeopleManager.tsx": "people/page.tsx",
        "Pricing.tsx": "subscription/page.tsx",
        "PrivacyPolicy.tsx": "privacy-policy/page.tsx",
        "TermsOfService.tsx": "terms-of-service/page.tsx",
        "CookiePolicy.tsx": "cookie-policy/page.tsx",
        "Disclaimer.tsx": "disclaimer/page.tsx",
        "AboutUs.tsx": "about/page.tsx",
        "Contact.tsx": "contact/page.tsx",
        "Blog.tsx": "blog/page.tsx",
        "ContentHub.tsx": "content-hub/page.tsx",
        "Forum.tsx": "forum/page.tsx",
        "UserAnalytics.tsx": "user-analytics/page.tsx",
        "AIChatPage.tsx": "ai-chat/page.tsx",
        "NumerologyReport.tsx": "numerology-report/page.tsx",
    }
    
    converted = 0
    for source_file, target_path in page_mapping.items():
        source_path = source_dir / source_file
        if not source_path.exists():
            print(f"Skipping {source_file} - not found")
            continue
        
        target_file = target_dir / target_path
        target_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Read source file
        with open(source_path, 'r') as f:
            content = f.read()
        
        # Convert content
        converted_content = convert_page(content)
        
        # Extract default export function name
        match = re.search(r"export\s+function\s+(\w+)", converted_content)
        if match:
            func_name = match.group(1)
            # Change to default export
            converted_content = re.sub(
                r"export\s+function\s+" + func_name,
                f"export default function {func_name}",
                converted_content
            )
        
        # Write target file
        with open(target_file, 'w') as f:
            f.write(converted_content)
        
        print(f"Converted {source_file} -> {target_path}")
        converted += 1
    
    print(f"\nConverted {converted} pages")

if __name__ == "__main__":
    main()

