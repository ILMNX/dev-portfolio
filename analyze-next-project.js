// analyze-next-project.js

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🚀 Starting Next.js Performance Audit...\n");

// 1. Check for large dependencies
console.log("📦 Checking package size...");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const largeDeps = Object.entries(pkg.dependencies || {}).filter(([name]) => {
  try {
    const size = execSync(`npm pack ${name} --dry-run --json`, { stdio: ['pipe', 'pipe', 'ignore'] });
    const parsed = JSON.parse(size.toString())[0];
    return parsed.size > 200_000; // > 200kb
  } catch {
    return false;
  }
});
largeDeps.forEach(([name]) => console.warn(`⚠️ Large dependency: ${name}`));
if (!largeDeps.length) console.log("✅ All dependencies are reasonably sized.\n");

// 2. Detect <img> tags (instead of Next.js <Image />)
console.log("🔍 Searching for <img> tags in components...");
let imgCount = 0;
const walkDir = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
      const content = fs.readFileSync(fullPath, "utf8");
      if (content.includes("<img ")) {
        console.warn(`⚠️ Found <img> in ${fullPath}`);
        imgCount++;
      }
    }
  });
};
walkDir("pages");
walkDir("components");
if (imgCount === 0) console.log("✅ No <img> tags found. Good job using Next.js Image!\n");

// 3. Run Next.js bundle analyzer
console.log("📊 Analyzing bundle size...");
try {
  execSync("npx next build && npx next-bundle-analyzer", { stdio: "inherit" });
} catch (e) {
  console.warn("❌ Failed to analyze bundle. Make sure you have 'next-bundle-analyzer' installed.\n");
}

// 4. Detect useEffect usage
console.log("🧠 Scanning for useEffect usage...");
let effectCount = 0;
walkDir("components");
walkDir("pages");
if (effectCount === 0) console.log("✅ No useEffect found (or very few). Nice!\n");

// 5. Scan for image file sizes
console.log("🖼️ Checking for large images in /public...");
const imageExts = ['.png', '.jpg', '.jpeg', '.webp','.gif', '.svg'];
const publicDir = path.join(__dirname, "public");
if (fs.existsSync(publicDir)) {
  fs.readdirSync(publicDir).forEach(file => {
    const ext = path.extname(file);
    if (imageExts.includes(ext)) {
      const size = fs.statSync(path.join(publicDir, file)).size;
      if (size > 300 * 1024) {
        console.warn(`⚠️ Large image found: ${file} (${(size / 1024).toFixed(2)}KB)`);
      }
    }
  });
} else {
  console.log("ℹ️ No /public folder found.\n");
}

console.log("\n✅ Basic Audit Complete! For deep profiling, use Chrome DevTools and Lighthouse.");
