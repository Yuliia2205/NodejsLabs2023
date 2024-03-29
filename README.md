### Тема: Робота з базами даних
#### Відпові на контрольні питання:
##### 1. Опишіть різницю між реляційними та документно-орієнтованими базами даних.
Реляційні та документно-орієнтовані бази даних (NoSQL) - це два різних підходи до зберігання та управління даними.
Реляційні бази даних (RDBMS) зберігають дані у вигляді таблиць зі зв'язками між ними. Таблиці містять рядки та стовпці, що представляють окремі дані та їх властивості. Реляційні бази даних використовують мову SQL (Structured Query Language) для запитів та змін даних у таблицях. Такі бази даних зазвичай використовуються для зберігання структурованих даних, таких як дані про користувачів, замовлення або транзакції.
Документно-орієнтовані бази даних (NoSQL) зберігають дані у вигляді документів, які можуть бути представлені в різних форматах, таких як JSON або XML. Кожен документ містить всю необхідну інформацію про конкретний елемент, включаючи дані та їх властивості. Документи можуть містити інші документи або структури даних вкладені всередину них. Для запитів та змін даних у документно-орієнтованих базах даних використовуються різні мови запитів та інтерфейси, такі як MongoDB Query Language (MQL) для MongoDB.
Реляційні бази даних краще підходять для структурованих даних з готовою схемою та чіткими зв'язками між ними, тоді як документно-орієнтовані бази даних відмінно працюють з неструктурованими даними, які можуть змінюватись у часі, не вимагають фіксованої схеми та часто містять вкладені дані. Документно-орієнтовані бази даних також частіше використовуються у веброзробці та зберігають дані, такі як профілі користувачів, коментарі та інші неструктуровані дані, що можуть бути динамічно змінюваними. Це робить документно-орієнтовані бази даних більш гнучкими та ефективними для зберігання та маніпулювання даними в масштабі веб-додатків. Однак, у реляційних базах даних більше можливостей для забезпечення цілісності даних та забезпечення консистентності даних у всьому додатку. Реляційні бази даних також можуть бути більш надійними та безпечними, зокрема, у випадку, коли даними користуються декілька додатків або систем.
Крім того, реляційні бази даних зазвичай вимагають складніших операцій для масштабування та реплікації даних, що може бути складно у випадку, коли необхідно обробляти великі обсяги даних або має місце потреба у горизонтальному масштабуванні.
Загалом, вибір між реляційними та документно-орієнтованими базами даних залежить від конкретних потреб додатку та його характеристик. Як правило, реляційні бази даних більш підходять для додатків зі структурованими даними та вимогами до цілісності даних, тоді як документно-орієнтовані бази даних є кращим вибором для додатків з неструктурованими даними та високими вимогами до швидкодії та гнучкості.
Приклади коду, що ілюструють різницю між реляційними та документно-орієнтованими базами даних.
- Приклад коду реляційної бази даних:
```
CREATE TABLE users (
 id INT PRIMARY KEY,
 name VARCHAR(255),
 email VARCHAR(255),
 password VARCHAR(255)
);
INSERT INTO users (id, name, email, password) VALUES
(1, 'John Doe', 'john@example.com', 'password123'),
(2, 'Jane Doe', 'jane@example.com', 'password456');
SELECT * FROM users WHERE id = 1;
```
У цьому прикладі ми створюємо таблицю користувачів з полями id, name, email та password,додаємо двох користувачів та робимо запит на вибірку користувача з ідентифікатором 1.
- Приклад коду документно-орієнтованої бази даних:
```
const { MongoClient } = require('mongodb');
async function main() {
 const client = new MongoClient(uri);
 await client.connect();
 const collection = client.db("sample_database").collection("users");
 const user = { name: "John Doe", email: "john@example.com", password: "password123" };
 await collection.insertOne(user);
 const result = await collection.findOne({ name: "John Doe" });
 console.log(result);
}
main().catch(console.error);
```
У цьому прикладі ми використовуємо документно-орієнтовану базу даних MongoDB створюємо колекцію users, додаємо користувача та робимо запит на вибірку користувача з ім'ям "John Doe". Зверніть увагу, що поля користувача не визначені заздалегідь, але можуть бути додані динамічно, що є характерним для документно-орієнтованих баз даних.

##### 2. Опишіть поняття транзакцій. Чи є вони в реляційних та документно-орієнтованих базах даних?
Транзакція - це один або кілька запитів до бази даних, які мають бути виконані як одна атомарна операція. Транзакції забезпечують цілісність даних, тобто вони гарантують, що якщо будьяка частина транзакції не може бути виконана, то вся транзакція буде скасована, і база даних повернеться до свого попереднього стану.
Реляційні бази даних підтримують транзакції, і це є однією з їх основних переваг. Транзакції в реляційних базах даних використовують механізм ACID (Atomicity, Consistency, Isolation, Durability), який забезпечує повну цілісність даних.
Документно-орієнтовані бази даних також підтримують транзакції, але механізм гарантії їх цілісності може відрізнятися від реляційних баз даних. Документно-орієнтовані бази даних зазвичай використовують механізм eventual consistency, що означає, що дані можуть бути неправильними протягом короткого проміжку часу. Проте, вони намагаються забезпечити гарантії, що в кінцевому рахунку дані стануть правильними.
У загальному, транзакції є важливою частиною будь-якої бази даних, оскільки вони дозволяють забезпечити цілісність даних. Тому більшість баз даних, як реляційні, так і документноорієнтовані, підтримують механізми транзакцій.
- Приклад коду на мові SQL, що демонструє транзакцію в реляційній базі даних MySQL:
```
START TRANSACTION;
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;
COMMIT;
```
Цей код починає транзакцію, вставляє нового користувача в таблицю "users" та зменшує баланс користувача в таблиці "accounts" на 100. Після того, як всі запити успішно виконані, транзакція зберігається командою COMMIT. Якщо будь-який з запитів у транзакції не може бути виконаний, то транзакція буде скасована командою ROLLBACK, і база даних повернеться до свого попереднього стану.
##### 3. Які є способи реалізувати ManyToMany звʼязок в базах даних?
ManyToMany зв'язок між таблицями в базах даних можна реалізувати декількома способами. Ось декілька з них:
- Створення додаткової таблиці-посередника: Створюється третя таблиця, що містить два зовнішні ключі на первинні ключі зв'язуваних таблиць. Ця таблиця містить записи, які відображають зв'язки між записами з первинних таблиць. Приклад коду:
```
CREATE TABLE authors (
 author_id INT PRIMARY KEY,
 name VARCHAR(255)
);
CREATE TABLE books (
 book_id INT PRIMARY KEY,
 title VARCHAR(255)
);
CREATE TABLE book_authors (
 book_id INT,
 author_id INT,
 PRIMARY KEY(book_id, author_id),
 FOREIGN KEY(book_id) REFERENCES books(book_id),
 FOREIGN KEY(author_id) REFERENCES authors(author_id)
);
```
- Використання JSON-поля: В реляційній базі даних можна мати стовпець, який містить JSONоб'єкт з масивом ID зв'язаних записів в іншій таблиці. Однак, цей спосіб може бути менш ефективним при пошуку даних. Приклад коду:
```
CREATE TABLE books (
 book_id INT PRIMARY KEY,
 title VARCHAR(255),
 authors_json JSON
);
INSERT INTO books (book_id, title, authors_json)
VALUES (1, 'The Great Gatsby', '[1, 2]');
SELECT *
FROM books
WHERE authors_json @> '[1]';
```
- Використання масивів: У документно-орієнтованих базах даних можна мати поле, яке містить масив з ID зв'язаних записів в іншій колекції. Приклад коду:
```
// MongoDB shell
db.books.insertOne({
 title: 'The Great Gatsby',
 authors: [1, 2]
});
db.books.find({ authors: 1 });
```
- Використання розширеної таблиці-посередника: Цей підхід подібний до першого, але додаткова таблиця містить додаткові стовпці, які описують зв'язок між записами з первинних таблиць. Приклад коду:
```
CREATE TABLE authors (
 author_id INT PRIMARY KEY,
 name VARCHAR(255)
);
CREATE TABLE books (
 book_id INT PRIMARY KEY,
 title VARCHAR(255)
);
CREATE TABLE book_authors (
 book_id INT,
 author_id INT,
 role VARCHAR(255),
 PRIMARY KEY(book_id, author_id),
 FOREIGN KEY(book_id) REFERENCES books(book_id),
 FOREIGN KEY(author_id) REFERENCES authors(author_id)
);
```
- Використання реляційного поле з більш ніж двома зовнішніми ключами: В деяких реляційних базах даних дозволяють використовувати один стовпець, який містить більше двох зовнішніх ключів, що вказують на записи в інших таблицях. Приклад коду:
```
CREATE TABLE authors (
 author_id INT PRIMARY KEY,
 name VARCHAR(255)
);
CREATE TABLE books (
 book_id INT PRIMARY KEY,
 title VARCHAR(255)
);
CREATE TABLE book_authors (
 book_id INT,
 author_1_id INT,
 author_2_id INT,
 PRIMARY KEY(book_id),
 FOREIGN KEY(book_id) REFERENCES books(book_id),
 FOREIGN KEY(author_1_id) REFERENCES authors(author_id),
 FOREIGN KEY(author_2_id) REFERENCES authors(author_id)
)
```
Вибір способу залежить від вимог до бази даних та особливостей її реалізації.
##### 4. Опишіть особливості БД Redis. Чому вона швидка? Де її краще використовувати?
Redis - це швидка іншоденна база даних з відкритим кодом, яка використовується для зберігання та обробки даних, що знаходяться в оперативній пам'яті. Основна мета Redis - забезпечення високої продуктивності при зберіганні та обробці даних в режимі реального часу
Особливості Redis:
- Швидкість: Redis відома своєю високою продуктивністю, оскільки дані зберігаються в оперативній пам'яті. Redis може обробляти до мільйонів операцій на секунду.
- Дані типізовані: Redis підтримує різні типи даних, такі як рядки, списки, множини, хеші та інші. Це дозволяє розробникам використовувати Redis для різних завдань, від кешування даних до зберігання структурованих даних.
- Широкі можливості: Redis підтримує широкий набір функцій, таких як сортування, фільтрація, транзакції та інші. Крім того, Redis підтримує різні режими реплікації та розподілу, що дозволяє розширювати його для більших завдань.
- Відкритий код: Redis є продуктом з відкритим кодом, що дозволяє розробникам внести свої внески в код та використовувати його в різних проектах.

Redis швидка завдяки декільком чинникам:
- Дані зберігаються в оперативній пам'яті, що дозволяє швидко доступатися до них.
- Redis використовує неблокуючі алгоритми, що дозволяє обробляти багато запитів одночасно.
- Redis підтримує асинхронну обробку, що дозволяє обробляти запити в режимі реального часу.

Redis є корисною для кешування даних, тому що вона зберігає дані у швидкодіючій оперативній пам'яті, що дозволяє швидко отримувати доступ до даних без необхідності звертатися до диска. Крім того, Redis підтримує багато різних типів даних, включаючи рядки, хеші, списки, множини та сортовані множини, що робить його гнучким і пристосованим для використання в різних сценаріях.

Redis також має кілька інших особливостей, які роблять його цікавим для використання в різних проектах:
- Підтримка операцій з атомарністью, що дозволяє багатопоточним додаткам безпечно працювати з Redis.
- Можливість реплікації даних між різними вузлами, що дозволяє підвищити надійність і доступність даних.
- Підтримка транзакцій, що дозволяє виконувати групу операцій як єдину атомарну операцію.
- Можливість публікації та передплати на повідомлення, що дозволяє побудувати системи повідомлень реального часу.
- Можливість використання скриптів Lua для виконання складних операцій з даними

Швидкість Redis пояснюється тим, що він зберігає дані у оперативній пам'яті, а не на диску. Це дозволяє отримувати доступ до даних за дуже короткий час, порівняно з базами даних, які зберігають дані на диску. Redis також використовує внутрішні оптимізації, такі як використання бінарних даних та мінімізація кількості пересилань мережею, що дозволяє підвищити швидкодію роботи.

Приклади коду:
- Приклад використання Redis для збереження даних у форматі ключ-значення:
```
import redis
# Підключення до Redis-серверу
r = redis.Redis(host='localhost', port=6379, db=0)
# Збереження значення для ключа
r.set('foo', 'bar')
# Отримання значення ключа
value = r.get('foo')
print(value) # виведе "b'bar'"
```
- Приклад використання Redis для реалізації кешування:
```
import redis
# Підключення до Redis-серверу
r = redis.Redis(host='localhost', port=6379, db=0)
def get_data_from_db(id):
 # функція, що повертає дані з бази даних за ідентифікатором
 return f"data for id={id}"
def get_data(id):
 key = f"my_key_{id}"
 data = r.get(key) # спробуємо отримати дані з кешу
 if not data:
 # якщо дані не знайдені в кеші, отримуємо їх з бази даних
 data = get_data_from_db(id)
 # зберігаємо дані у кеші на 5 хвилин
 r.set(key, data, ex=300)
 return data
 ```
- Приклад використання Redis для підрахунку кількості переглядів сторінок:
```
import redis
# Підключення до Redis-серверу
r = redis.Redis(host='localhost', port=6379, db=0)
def increment_page_view(page_id):
 # збільшуємо лічильник переглядів сторінки
 r.incr(f"page_view_count:{page_id}")
 ```
- Приклад використання Redis для реалізації черги повідомлень:
```
import redis
# Підключення до Redis-серверу
r = redis.Redis(host='localhost', port=6379, db=0)
def add_task_to_queue(task):
 # додаємо завдання до черги
 r.lpush("task_queue", task)
def process_tasks_from_queue():
 while True:
 # отримуємо наступне завдання з черги
 task = r.rpop("task_queue")
 if task is None:
 # якщо черга порожня, зупиняємо обробку завдань
 break
 # обробляємо завдання
 print(f"Processing task: {task}")
 ```
