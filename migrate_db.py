import sqlite3
import json
from pymongo import MongoClient

# Подключение к MongoDB
MONGO_URI = "mongodb+srv://seerdro:zcdYHpdwFEBjBft@cluster0.xxxxx.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client.telegram_db
users = db.users

# Подключение к SQLite
sqlite_conn = sqlite3.connect('telegram.db')
sqlite_conn.row_factory = sqlite3.Row
cursor = sqlite_conn.cursor()

# Получаем всех пользователей из SQLite
cursor.execute('SELECT * FROM users')
sqlite_users = cursor.fetchall()

# Переносим каждого пользователя в MongoDB
for user in sqlite_users:
    mongo_user = {
        'username': user['username'],
        'email': user['email'],
        'password': user['password'],
        'language': user['language'],
        'appearance_settings': json.loads(user['appearance_settings']) if user['appearance_settings'] else None
    }
    
    # Проверяем, существует ли пользователь
    existing_user = users.find_one({'email': user['email']})
    if not existing_user:
        users.insert_one(mongo_user)
        print(f"Добавлен пользователь: {user['email']}")
    else:
        print(f"Пользователь уже существует: {user['email']}")

print("Миграция завершена!")
sqlite_conn.close() 