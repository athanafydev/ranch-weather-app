#!/usr/bin/env python3
"""
Simple Python HTTP server for the Weather & River Dashboard.
Serves static files from the current directory on port 8000.
"""

import http.server
import socketserver
import os
import sys

PORT = 8000

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP handler that serves files from the app directory."""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)
    
    def log_message(self, format, *args):
        # Print minimal logs
        sys.stdout.write(f"[{self.log_date_time_string()}] {args[0]}\n")
        sys.stdout.flush()

def main():
    with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
        print(f"╔══════════════════════════════════════════════╗")
        print(f"║  Ranch Weather & River Conditions Dashboard  ║")
        print(f"║  Server running at http://localhost:{PORT}      ║")
        print(f"║  Press Ctrl+C to stop                        ║")
        print(f"╚══════════════════════════════════════════════╝")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            httpd.server_close()

if __name__ == "__main__":
    main()
