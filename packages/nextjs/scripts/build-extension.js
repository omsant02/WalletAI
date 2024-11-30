const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏗 Building extension...');
try {
  // Create extension directory
  const extensionDir = path.join(__dirname, '../extension-dist');
  if (fs.existsSync(extensionDir)) {
    fs.rmSync(extensionDir, { recursive: true });
  }
  fs.mkdirSync(extensionDir, { recursive: true });

  // Build Next.js app
  console.log('Building Next.js application...');
  process.env.BUILD_TYPE = 'extension';
  process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR = 'true';
  execSync('npx next build', { stdio: 'inherit' });

  // Copy the popup page
  fs.copyFileSync(
    path.join(__dirname, '../extension-dist/popup/index.html'),
    path.join(extensionDir, 'popup.html')
  );

  // Copy static assets if they exist
  const staticDir = path.join(__dirname, '../extension-dist/static');
  if (fs.existsSync(staticDir)) {
    fs.cpSync(
      staticDir,
      path.join(extensionDir, 'static'),
      { recursive: true }
    );
  }

  // Copy extension files
  const extFiles = [
    ['extension-manifest.json', 'manifest.json'],
    ['background.js', 'background.js'],
    ['content.js', 'content.js']
  ];

  extFiles.forEach(([src, dest]) => {
    fs.copyFileSync(
      path.join(__dirname, '../public/', src),
      path.join(extensionDir, dest)
    );
  });

  // Clean up unnecessary files
  const cleanupDirs = ['app', 'pages', '_next'];
  cleanupDirs.forEach(dir => {
    const dirPath = path.join(extensionDir, dir);
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true });
    }
  });

  console.log('✅ Extension build completed! The extension is in the "extension-dist" directory.');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}