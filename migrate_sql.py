import json
from pymongo import MongoClient

# Подключение к MongoDB Atlas с актуальными данными
MONGO_URI = "mongodb+srv://lol:lollol@cluster0.7j5fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client.telegram_db
users = db.users

# Читаем SQL файл и извлекаем данные INSERT
def parse_sql_insert(sql_file):
    with open(sql_file, 'r', encoding='utf-8') as f:
        content = f.read()
        # Ищем строку INSERT INTO users
        insert_start = content.find("INSERT INTO `users`")
        if insert_start == -1:
            return []
        
        # Находим значения
        values_start = content.find("VALUES", insert_start)
        values_end = content.find(";", values_start)
        values_str = content[values_start:values_end]
        
        # Извлекаем данные пользователя
        start = values_str.find("(")
        end = values_str.rfind(")")
        user_data = values_str[start+1:end].split(",")
        
        # Форматируем данные
        return {
            'username': user_data[1].strip().strip("'"),
            'email': user_data[2].strip().strip("'"),
            'password': user_data[3].strip().strip("'")
        }

# Загружаем данные из SQL файла
try:
    user_data = parse_sql_insert('database.sql')
    if user_data:
        # Проверяем, существует ли пользователь
        existing_user = users.find_one({'email': user_data['email']})
        if not existing_user:
            users.insert_one(user_data)
            print(f"Добавлен пользователь: {user_data['email']}")
        else:
            print(f"Пользователь уже существует: {user_data['email']}")
    print("Миграция завершена!")
except Exception as e:
    print(f"Ошибка при миграции: {e}") 