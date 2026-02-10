<?php
/**
 * Index.php - Node.js Application Entry Point
 * Redirects to Node.js application or launches it
 */

header('Content-Type: text/plain');

echo "🚀 ALCANT WEBSITE - NODE.JS APPLICATION";
echo "=========================================";
echo "";
echo "This is a Node.js application, not a PHP project.";
echo "";
echo "🔧 Application Details:";
echo "- Type: Node.js with Next.js frontend";
echo "- Backend: Express.js API";
echo "- Database: Supabase";
echo "";
echo "🌐 If you're seeing this, Node.js hasn't started yet.";
echo "📋 Please wait a few moments for Node.js to initialize...";
echo "";

// Check for Node.js files
if (file_exists('server.js')) {
    echo "✅ server.js found";
} else {
    echo "❌ server.js not found";
}

if (file_exists('package.json')) {
    echo "✅ package.json found";
} else {
    echo "❌ package.json not found";
}

echo "";
echo "🔄 Attempting to start Node.js application...";

// Try to execute Node.js
$node_command = 'node server.js > /dev/null 2>&1 &';
exec($node_command);

// Wait a moment for Node.js to start
sleep(3);

// Check if Node.js is running on port 3000
$socket = @fsockopen('localhost', 3000, $errno, $errstr, 5);
if ($socket) {
    fclose($socket);
    echo "✅ Node.js is running on port 3000";
    echo "";
    echo "🌐 Redirecting to application...";
    header('Refresh: 2; url=http://localhost:3000');
    exit;
} else {
    echo "⚠️ Node.js starting up... Please refresh this page.";
}

// Fallback to launching Node.js directly
echo "";
echo "🔧 Manual Node.js launch:";
$output = shell_exec('node server.js 2>&1');
echo $output;
?>
