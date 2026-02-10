<?php
/**
 * Index.php - Simple Node.js Application Entry Point
 * Satisfies Hostinger PHP detection while launching Node.js
 */

header('Content-Type: text/plain');

echo "🚀 ALCANT WEBSITE - NODE.JS APPLICATION";
echo "=========================================";
echo "";
echo "This is a Node.js application launched via PHP for Hostinger compatibility.";
echo "";
echo "🔧 Starting Node.js application...";

// Check for required files
if (!file_exists('server.js')) {
    echo "❌ Error: server.js not found";
    exit(1);
}

if (!file_exists('package.json')) {
    echo "❌ Error: package.json not found";
    exit(1);
}

echo "✅ Application files verified";
echo "";

// Check if Node.js is already running
$socket = @fsockopen('localhost', 3000, $errno, $errstr, 2);
if ($socket) {
    fclose($socket);
    echo "✅ Node.js is already running on port 3000";
    echo "";
    echo "🌐 Application is live at: http://localhost:3000";
    echo "";
    echo "🔄 Redirecting to application...";
    header('Refresh: 2; url=http://localhost:3000');
    exit;
}

// Start Node.js application
echo "🔄 Starting Node.js server...";
$node_command = 'nohup node server.js > nodejs.log 2>&1 &';
exec($node_command);

// Wait for Node.js to start
sleep(3);

// Check if Node.js started successfully
$socket = @fsockopen('localhost', 3000, $errno, $errstr, 3);
if ($socket) {
    fclose($socket);
    echo "✅ Node.js started successfully on port 3000";
    echo "";
    echo "🌐 Application is live!";
    echo "📋 Logs available in: nodejs.log";
    echo "";
    echo "🔄 Redirecting to application...";
    header('Refresh: 3; url=http://localhost:3000');
} else {
    echo "❌ Node.js failed to start";
    echo "";
    echo "🔧 Checking Node.js logs:";
    if (file_exists('nodejs.log')) {
        echo file_get_contents('nodejs.log');
    } else {
        echo "No logs found";
    }
}
?>
