#!/usr/bin/env python3
"""
Simple HTTP Server for PWA Development
Serves the Dreamland Play Cafe PWA locally
"""

import http.server
import socketserver
import os
import webbrowser
from urllib.parse import unquote

class PWAHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP Request Handler for PWA"""
    
    def end_headers(self):
        # Add headers for PWA support
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Service-Worker-Allowed', '/')
        # Add CORS headers for external resources
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    
    def do_GET(self):
        # Decode URL to handle special characters
        self.path = unquote(self.path)
        
        # Serve index.html for root path
        if self.path == '/':
            self.path = '/index.html'
        
        # Set correct MIME types
        if self.path.endswith('.js'):
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            with open(self.path[1:], 'rb') as f:
                self.wfile.write(f.read())
        elif self.path.endswith('.json'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            with open(self.path[1:], 'rb') as f:
                self.wfile.write(f.read())
        else:
            super().do_GET()

def start_server(port=8000):
    """Start the development server"""
    
    # Change to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = PWAHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), Handler) as httpd:
            server_url = f"http://localhost:{port}"
            print("=" * 60)
            print("Dreamland Play Cafe PWA Development Server")
            print("=" * 60)
            print(f"Server running at: {server_url}")
            print(f"Open this URL in your browser to test the PWA")
            print("\nFeatures available:")
            print("  - PWA installation")
            print("  - Service Worker")
            print("  - Offline functionality")
            print("  - iOS-style interface")
            print("\nPress Ctrl+C to stop the server")
            print("=" * 60)
            
            # Open browser automatically
            webbrowser.open(server_url)
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\nServer stopped")
    except OSError as e:
        if e.errno == 48:  # Port already in use
            print(f"Port {port} is already in use")
            print(f"   Try using a different port: python server.py --port 8080")
        else:
            raise

if __name__ == "__main__":
    import sys
    
    # Check for custom port
    port = 8000
    if len(sys.argv) > 1:
        if sys.argv[1] == '--port' and len(sys.argv) > 2:
            try:
                port = int(sys.argv[2])
            except ValueError:
                print("Invalid port number. Using default port 8000")
    
    start_server(port)