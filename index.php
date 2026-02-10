<?php
/**
 * Index.php - Node.js Application Entry Point
 * Handles Composer installation and launches Node.js
 */

header('Content-Type: text/plain');

echo "🚀 ALCANT WEBSITE - NODE.JS APPLICATION";
echo "=========================================";
echo "";
echo "This is a Node.js application with PHP launcher for Hostinger.";
echo "";
echo "🔧 Application Details:";
echo "- Type: Node.js with Next.js frontend";
echo "- Backend: Express.js API";
echo "- Database: Supabase";
echo "";

// Check for Composer autoloader
if (file_exists('vendor/autoload.php')) {
    echo "✅ Composer dependencies installed";
} else {
    echo "⚠️ Composer dependencies not found - this is normal for Node.js app";
}

// Check for Node.js files
if (file_exists('server.js')) {
    echo "✅ server.js found";
} else {
    echo "❌ server.js not found";
    exit(1);
}

if (file_exists('package.json')) {
    echo "✅ package.json found";
} else {
    echo "❌ package.json not found";
    exit(1);
}

echo "";
echo "🔄 Starting Node.js application...";

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

// Try to execute Node.js in background
$node_command = 'nohup node server.js > nodejs.log 2>&1 &';
exec($node_command);

// Wait for Node.js to start
echo "⏳ Waiting for Node.js to start...";
sleep(5);

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
    echo "🔧 Manual startup:";
    echo "Command: node server.js";
    echo "";
    echo "� Checking Node.js logs:";
    if (file_exists('nodejs.log')) {
        echo file_get_contents('nodejs.log');
    } else {
        echo "No logs found";
    }
}
?>
