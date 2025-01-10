import os
import json
from wsgiref.simple_server import make_server
from pymongo import MongoClient

# Подключение к MongoDB Atlas
MONGO_URI = "mongodb+srv://lol:lollol@cluster0.7j5fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client.telegram_db
users = db.users

def check_user(email, password):
    user = users.find_one({"email": email, "password": password})
    return user is not None

def application(environ, start_response):
    if environ['REQUEST_METHOD'] == 'OPTIONS':
        start_response('200 OK', [
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'POST, OPTIONS'),
            ('Access-Control-Allow-Headers', 'Content-Type'),
            ('Content-Length', '0')
        ])
        return []

    path = environ['PATH_INFO']
    method = environ['REQUEST_METHOD']
    
    if method == 'POST' and path == '/login':
        try:
            content_length = int(environ.get('CONTENT_LENGTH', 0))
            request_body = environ['wsgi.input'].read(content_length).decode('utf-8')
            data = json.loads(request_body)
            
            success = check_user(data.get('email'), data.get('password'))
            
            response = json.dumps({'success': success}).encode('utf-8')
            
            start_response('200 OK', [
                ('Content-Type', 'application/json'),
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Headers', 'Content-Type'),
                ('Content-Length', str(len(response)))
            ])
            return [response]
            
        except Exception as e:
            print(f"Error: {str(e)}")
            response = json.dumps({
                'success': False, 
                'error': str(e)
            }).encode('utf-8')
            
            start_response('500 Internal Server Error', [
                ('Content-Type', 'application/json'),
                ('Access-Control-Allow-Origin', '*'),
                ('Content-Length', str(len(response)))
            ])
            return [response]
    
    response = b'Not Found'
    start_response('404 Not Found', [
        ('Content-Type', 'text/plain'),
        ('Content-Length', str(len(response)))
    ])
    return [response]

app = application

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    with make_server('', port, app) as httpd:
        print(f'Serving on port {port}...')
        httpd.serve_forever() 