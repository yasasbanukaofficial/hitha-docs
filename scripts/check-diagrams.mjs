import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BANNED_PATTERN = /(Impl|Service|Controller|Filter|Repository|Entrypoint|\w+\(\))/i;

let hasErrors = false;

console.log('🔍 Running Diagram Lint Verification...');

// 1. Check diagramData.ts
const diagramDataPath = path.join(rootDir, 'src/components/FlowDiagram/diagramData.ts');
const content = fs.readFileSync(diagramDataPath, 'utf8');

// Parse node definitions
const nodeArrayRegex = /export const (\w+Nodes)\s*:\s*Node\[\]\s*=\s*(\[[\s\S]*?\]);/g;
let match;

while ((match = nodeArrayRegex.exec(content)) !== null) {
  const arrayName = match[1];
  const arrayBody = match[2];

  // Count nodes
  const nodeMatches = arrayBody.match(/id\s*:\s*['"][^'"]+['"]/g) || [];
  if (nodeMatches.length > 7) {
    console.error(`❌ [${arrayName}] Diagram has ${nodeMatches.length} nodes (maximum allowed is 7).`);
    hasErrors = true;
  }

  // Check titles
  const titleMatches = arrayBody.matchAll(/title\s*:\s*['"]([^'"]+)['"]/g);
  for (const t of titleMatches) {
    const val = t[1];
    if (BANNED_PATTERN.test(val)) {
      console.error(`❌ [${arrayName}] Banned class/method name in title: "${val}"`);
      hasErrors = true;
    }
  }

  // Check captions
  const captionMatches = arrayBody.matchAll(/caption\s*:\s*['"]([^'"]+)['"]/g);
  for (const c of captionMatches) {
    const val = c[1];
    if (BANNED_PATTERN.test(val)) {
      console.error(`❌ [${arrayName}] Banned class/method name in caption: "${val}"`);
      hasErrors = true;
    }
  }
}

// Parse edge definitions
const edgeArrayRegex = /export const (\w+Edges)\s*:\s*Edge\[\]\s*=\s*(\[[\s\S]*?\]);/g;
while ((match = edgeArrayRegex.exec(content)) !== null) {
  const arrayName = match[1];
  const arrayBody = match[2];

  const labelMatches = arrayBody.matchAll(/label\s*:\s*['"]([^'"]+)['"]/g);
  for (const l of labelMatches) {
    const val = l[1];
    if (BANNED_PATTERN.test(val)) {
      console.error(`❌ [${arrayName}] Banned class/method name in edge label: "${val}"`);
      hasErrors = true;
    }
  }
}

// Check MDX files for scenario and steps
const docsDir = path.join(rootDir, 'docs');
let docCount = 0;
let diagramCount = 0;

function scanDocs(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDocs(fullPath);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      docCount++;
      const relativePath = path.relative(rootDir, fullPath);
      const docContent = fs.readFileSync(fullPath, 'utf8');

      if (docContent.includes('<FlowDiagram') || docContent.includes('<TimelineInteractiveFlow')) {
        diagramCount++;
        // Check for scenario and caption
        if (docContent.includes('<FlowDiagram')) {
          if (!docContent.includes('scenario=')) {
            console.error(`❌ [${relativePath}] <FlowDiagram> is missing scenario prop.`);
            hasErrors = true;
          }
          if (!docContent.includes('caption=')) {
            console.error(`❌ [${relativePath}] <FlowDiagram> is missing caption prop.`);
            hasErrors = true;
          }
        }
      } else {
        console.error(`❌ [${relativePath}] Page is missing <FlowDiagram>. Rule 5 requires every page to have at least one interactive flow diagram.`);
        hasErrors = true;
      }
    }
  }
}

scanDocs(docsDir);
console.log(`📄 Scanned ${docCount} doc pages, found ${diagramCount} diagram implementations.`);

if (hasErrors) {
  console.error('\n💥 Diagram Lint Failed! See errors above.');
  process.exit(1);
} else {
  console.log('✅ All diagrams conform to Rule 1 & Rule 5 (Plain English, Real-Life Actors, ≤ 7 Nodes, Scenario & Caption on every page).');
}
