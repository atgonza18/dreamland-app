const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;

// MIME type mapping
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url);
    
    // Get pathname
    let pathname = decodeURIComponent(parsedUrl.pathname);
    
    // Default to index.html for root
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Get file path
    const filePath = path.join(__dirname, pathname);
    
    // Check if file exists
    fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
            return;
        }
        
        // Get file extension
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading file');
                return;
            }
            
            // Set headers for PWA support
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache',
                'Service-Worker-Allowed': '/',
                'Access-Control-Allow-Origin': '*'
            });
            
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    const serverUrl = `http://localhost:${PORT}`;
    console.log('============================================================');
    console.log('🚀 Dreamland Play Cafe PWA Development Server');
    console.log('============================================================');
    console.log(`✅ Server running at: ${serverUrl}`);
    console.log('📱 Open this URL in your browser to test the PWA');
    console.log('');
    console.log('Features available:');
    console.log('  • PWA installation');
    console.log('  • Service Worker');
    console.log('  • Offline functionality');
    console.log('  • iOS-style interface');
    console.log('');
    console.log('To test on mobile:');
    console.log('  1. Make sure your phone is on the same network');
    console.log('  2. Find your computer\'s IP address');
    console.log('  3. Open http://[YOUR-IP]:' + PORT + ' on your phone');
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('============================================================');
    
    // Try to open browser automatically
    const { exec } = require('child_process');
    const platform = process.platform;
    let command;
    
    if (platform === 'win32') {
        command = `start ${serverUrl}`;
    } else if (platform === 'darwin') {
        command = `open ${serverUrl}`;
    } else {
        command = `xdg-open ${serverUrl}`;
    }
    
    exec(command, (err) => {
        if (!err) {
            console.log('✨ Browser opened automatically');
        }
    });
});