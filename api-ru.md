# CHAIN PAD API

> Система работает на основе JWT (json web tokens)

> Все ответа возарщаются в формате JSON, всегде есть поле `success` (true\false), которое логично говорит нам об успехе операции
в случае если поле равно `false` в ответе будет присутствовать поле `message` в котором будет содержаться текс ошибки приложения. 

Пример ответа с ошибкой
```
{
    "success": false,
    "message": "Incorrect Email or Password"
}
```


#### 1. Регистрация и получение токена
---
Шлём `POST` запрос на адрес `/auth/register` 

В след. релизах при регистрации будет жесткое подтверждение телефона и почты,и только потом регистрация, сейчас пока не делаем этого.

Входящие параметры:

* name - Имя
* lastName - Фамилия
* phone - телефон
* password - пароль
* email - почта

В ответ мы получаем такой json. 
> Рекомендую сохранить токен, далее он потребуется для передачи любых запросов.


```
{
    "user": {
        "name": "sadon",
        "lastName": "sadon",
        "email": "111sadonsergey@gmail.com",
        "phone": "798194699061111",
        "password": "<--SECURITY_FIELD-->",
        "networkCard": "b30e714d19c42bec8fd0fb43fd015bd40769eb61a102758bdf988e8a4807f082@chainpad-network",
        "role": "PARTICIPANT",
        "_id": "5a97e0a75dd80c73a94b6513",
        "__v": 0
    },
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJzYWRvbiIsImxhc3ROYW1lIjoic2Fkb24iLCJlbWFpbCI6IjExMXNhZG9uc2VyZ2V5QGdtYWlsLmNvbSIsInBob25lIjoiNzk4MTk0Njk5MDYxMTExIiwicGFzc3dvcmQiOiI8LS1TRUNVUklUWV9GSUVMRC0tPiIsIm5ldHdvcmtDYXJkIjoiYjMwZTcxNGQxOWM0MmJlYzhmZDBmYjQzZmQwMTViZDQwNzY5ZWI2MWExMDI3NThiZGY5ODhlOGE0ODA3ZjA4MkBjaGFpbnBhZC1uZXR3b3JrIiwicm9sZSI6IlBBUlRJQ0lQQU5UIiwiX2lkIjoiNWE5N2UwYTc1ZGQ4MGM3M2E5NGI2NTEzIiwiX192IjowfSwiaWF0IjoxNTE5OTAyODg3LCJleHAiOjE1MjAxNjIwODd9.-tS9vrUx-abUkIhMDWPQ8Cam0AOcTApRxElWkU6XYuw"
}
```

#### 2. Авторизация или получение нового токена
---
Шлём `POST` запрос на адрес `/auth/login` 

* loginField - [phone, email] один из вариантов. Это то, по какому полю идет авторизация.
* email - заполняется если loginField == 'email'
* phone - заполняется если loginField == 'phone'
* password - пароль указанные при регистрации

В ответ мы получаем такой же json как и при регистрации -(Пункт 1).
> Рекомендую сохранить токен, далее он потребуется для передачи любых запросов.

#### 3. Создание PAD
---
Шлём `POST` запрос на адрес `/assets/pads/new`

* name - Название
* text - Содержание (Может включать в себя html)
* participantsInvited - приглашенные участники, множественое поле, что бы передать несколько просто указать в запросе еще одно поле с таким же названием
* participantsInvited - второй участник если есть, участников не ограниченное кол-во.
* token

В ответ мы получаем  json с успехом или провалом.


#### 4. Редактирование PAD
---
Шлём `POST` запрос на адрес `/assets/pads/edit`

* name - Название
* text - Содержание (Может включать в себя html)
* participantsInvited - приглашенные участники, множественое поле, что бы передать несколько просто указать в запросе еще одно поле с таким же названием
* participantsInvited - второй участник если есть, участников не ограниченное кол-во.
* token

#### 5. Получение PAD по ID
---
Шлём `POST` запрос на адрес `/assets/pads/detail`



