const fs = require('fs');
const path = require('path');

const srcDir = '/Users/burhanahmed/Desktop/NumerAI/frontend/src/pages';
const files = [
  'LifePathAnalysisGlass.tsx',
  'RemediesGlass.tsx',
  'DailyReadingsGlass.tsx',
  'ForecastsGlass.tsx',
  'ConsultationsGlass.tsx',
  'SettingsGlass.tsx',
  'NumerologyReportGlass.tsx',
  'BirthChartGlass.tsx',
  'CompatibilityCheckerGlass.tsx'
];

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  try {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace <motion.nav ... > ... </motion.nav>
    content = content.replace(/<motion\.nav[\s\S]*?<\/motion\.nav>/g, '<AppNavbar />');

    // Clean up {/* Top Navigation */}
    content = content.replace(/\{\/\*\s*Top Navigation\s*\*\/\}/g, '{/* App Navbar */}');

    // Replace 'py-12' or similar padding in the main content div with 'py-8 pt-24'
    content = content.replace(/(<div className="max-w-[a-zA-Z0-9-]+ mx-auto px-8 )(py-[0-9]+)(")/g, '$1py-8 pt-24$3');

    // Add import statement for AppNavbar if missing // Wait, what if GlassBackground isn't there? In most it is. Just adding it manually if missing.
    if (!content.includes("import { AppNavbar }")) {
      content = content.replace(/import \{ GlassBackground \}/, "import { AppNavbar } from '../components/AppNavbar';\nimport { GlassBackground }");
    }

    fs.writeFileSync(filePath, content);
    console.log(`Successfully updated ${file}`);
  } catch (err) {
    console.error(`Failed to update ${file}:`, err.message);
  }
});
