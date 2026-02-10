<?php
/**
 * Node.js Application Launcher
 * This PHP file launches the Node.js application
 */

echo "🚀 Starting Node.js Application...";
echo "📋 This is a Node.js application, not PHP";
echo "🔧 Executing: node server.js";

// Check if Node.js is available
if (!file_exists('server.js')) {
    die('❌ Error: server.js not found. Please ensure Node.js application is present.');
}

// Check if package.json exists
if (!file_exists('package.json')) {
    die('❌ Error: package.json not found. This is a Node.js project.');
}

// Execute Node.js application
$command = 'node server.js 2>&1';
$output = shell_exec($command);

echo "🌐 Node.js Application Output:";
echo $output;

// If Node.js fails, show error
if (strpos($output, 'Error') !== false) {
    echo "❌ Node.js application failed to start";
    echo "🔧 Please check: npm install && npm start";
} else {
    echo "✅ Node.js application started successfully";
}
?>
