"""
SkillArena AI - Standalone Zero-Dependency Python HTTP Analytical Service
Runs with Python 3 standard library (no pip dependencies required).
Exposes /api/ai/health and /api/ai/diagnose on port 8000.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sys
from engine import SkillGapAnalyzer, AdaptiveRoadmapGenerator, ROLE_BENCHMARKS

PORT = 8000

class SkillArenaRequestHandler(BaseHTTPRequestHandler):

    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path in ("/", "/api/ai/health"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._set_cors_headers()
            self.end_headers()
            response_data = {
                "service": "SkillArena AI Analytical Engine",
                "status": "ONLINE",
                "port": PORT,
                "supported_roles": list(ROLE_BENCHMARKS.keys())
            }
            self.wfile.write(json.dumps(response_data).encode("utf-8"))
        else:
            self.send_response(404)
            self._set_cors_headers()
            self.end_headers()

    def do_POST(self):
        if self.path.startswith("/api/ai/diagnose") or self.path == "/diagnose":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
            
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}

            target_role = body.get("targetRole") or body.get("target_role") or "Full-Stack Software Engineer"
            scores = body.get("scores") or {}

            analyzer = SkillGapAnalyzer(target_role=target_role)
            evaluation = analyzer.evaluate(scores)
            roadmap = AdaptiveRoadmapGenerator.generate_roadmap(evaluation)

            result = {
                **evaluation,
                "personalized_roadmap": roadmap
            }

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self._set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps(result, indent=2).encode("utf-8"))
        else:
            self.send_response(404)
            self._set_cors_headers()
            self.end_headers()

    def log_message(self, format, *args):
        # Clean server logging
        sys.stderr.write(f"[SkillArena-AI Server] {self.address_string()} - {format%args}\n")

def run():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, SkillArenaRequestHandler)
    print(f"[SkillArena AI] Python Analytical Microservice listening on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == "__main__":
    run()

