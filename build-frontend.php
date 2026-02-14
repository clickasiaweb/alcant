<?php
// Build script for frontend deployment
echo "Starting frontend build...\n";

// Change to frontend directory and install dependencies
chdir('frontend');
echo "Installing npm dependencies...\n";
exec('npm install --production=false 2>&1', $output, $return_var);
if ($return_var !== 0) {
    echo "npm install failed: " . implode("\n", $output) . "\n";
    exit(1);
}
echo "npm install completed.\n";

// Build the frontend
echo "Building frontend...\n";
exec('npm run build 2>&1', $output, $return_var);
if ($return_var !== 0) {
    echo "npm build failed: " . implode("\n", $output) . "\n";
    exit(1);
}
echo "Frontend build completed.\n";

// Copy files to root
chdir('..');
echo "Copying files to root...\n";
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    exec('robocopy frontend\out . /E /MOVE', $output, $return_var);
} else {
    exec('cp -r frontend/out/* . 2>&1', $output, $return_var);
}
if ($return_var !== 0) {
    echo "File copy failed: " . implode("\n", $output) . "\n";
    exit(1);
}

echo "Build completed successfully!\n";
?>
