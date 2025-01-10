import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Получаем порт из переменной окружения (Render будет её устанавливать)
port = int(os.environ.get('PORT', 8000))

# Создаём простой HTTP-сервер
handler = SimpleHTTPRequestHandler
server = HTTPServer(('0.0.0.0', port), handler)

print(f'Server started on port {port}')
server.serve_forever() 