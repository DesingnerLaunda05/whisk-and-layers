const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../frontend/dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: frontend/dist directory does not exist. Run "npm run build --workspace=frontend" first.');
  process.exit(1);
}

// Ensure .nojekyll exists
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('Deploying frontend/dist to origin/gh-pages...');

const commands = [
  'git init -b gh-pages',
  'git config user.name "DesingnerLaunda05"',
  'git config user.email "user@pixelmint.io"',
  'git add -A',
  'git commit -m "Deploy Whisk & Layers to GitHub Pages"',
  'git remote add origin https://github.com/DesingnerLaunda05/whisk-and-layers.git',
  'git push -f origin gh-pages'
];

for (const cmd of commands) {
  try {
    execSync(cmd, { cwd: distDir, stdio: 'pipe' });
  } catch (err) {
    // If remote already exists or similar, ignore
    if (!cmd.includes('remote add')) {
      console.error(`Failed running: ${cmd}`);
      throw err;
    }
  }
}

// Clean up .git in dist
const gitDir = path.join(distDir, '.git');
if (fs.existsSync(gitDir)) {
  fs.rmSync(gitDir, { recursive: true, force: true });
}

console.log('✅ Successfully deployed to GitHub Pages!');
console.log('🌐 Live URL: https://desingnerlaunda05.github.io/whisk-and-layers/');
