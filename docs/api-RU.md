# CHAIN PAD API

> Система работает на основе JWT (json web tokens)

> Все ответа возарщаются в формате JSON, всегде есть поле `success` (true\false), которое логично говорит нам об успехе операции
в случае если поле равно `false` в ответе будет присутствовать поле `message` в котором будет содержаться текс ошибки приложения. 

Пример ответа с ошибкой
```json
{
    "success": false,
    "message": "Incorrect Email or Password"
}
```


#### 1. Регистрация и получение токена
---
Шлём `POST` запрос на адрес `/auth/register` 

В след. релизах при регистрации будет жесткое подтверждение телефона и почты,и только потом регистрация, сейчас пока не делаем этого.

##### Список полей в запросе
* name - Имя
* lastName - Фамилия
* phone - телефон
* password - пароль
* email - почта

В ответ мы получаем такой json. 
> Рекомендую сохранить токен, далее он потребуется для передачи любых запросов.


```json
{
    "user": {
        "role": "PARTICIPANT",
        "_id": "5a93d7ccf2d67a1d9705822b",
        "name": "Den",
        "lastName": "Sadon",
        "email": "test@test.com",
        "phone": "+1 (111) 111-1111",
        "password": "<--SECURITY_FIELD-->",
        "networkCard": "460979c1e6ebeff9186643820a8eeaf8fe364720093314c65790cd5c1b291b33@chainpad-network"
     },
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Im5hbWUiOiJzYWRvbiIsImxhc3ROYW1lIjoic2Fkb24iLCJlbWFpbCI6IjExMXNhZG9uc2VyZ2V5QGdtYWlsLmNvbSIsInBob25lIjoiNzk4MTk0Njk5MDYxMTExIiwicGFzc3dvcmQiOiI8LS1TRUNVUklUWV9GSUVMRC0tPiIsIm5ldHdvcmtDYXJkIjoiYjMwZTcxNGQxOWM0MmJlYzhmZDBmYjQzZmQwMTViZDQwNzY5ZWI2MWExMDI3NThiZGY5ODhlOGE0ODA3ZjA4MkBjaGFpbnBhZC1uZXR3b3JrIiwicm9sZSI6IlBBUlRJQ0lQQU5UIiwiX2lkIjoiNWE5N2UwYTc1ZGQ4MGM3M2E5NGI2NTEzIiwiX192IjowfSwiaWF0IjoxNTE5OTAyODg3LCJleHAiOjE1MjAxNjIwODd9.-tS9vrUx-abUkIhMDWPQ8Cam0AOcTApRxElWkU6XYuw"
}
```

#### 2. Авторизация или получение нового токена
---
Шлём `POST` запрос на адрес `/auth/login` 

##### Список полей в запросе
* loginField - [phone, email] один из вариантов. Это то, по какому полю идет авторизация.
* email - заполняется если loginField == 'email'
* phone - заполняется если loginField == 'phone'
* password - пароль указанные при регистрации

В ответ мы получаем такой же json как и при регистрации -(Пункт 1).
> Рекомендую сохранить токен, далее он потребуется для передачи любых запросов.


> При создании Pad может потребоваться привязать участника, для этого есть поле `participantsInvited` связанное с пользователем пол полю `participantId`

#### 3. Создание PAD
---
Шлём `POST` запрос на адрес `/assets/pads/new`

##### Список полей в запросе
* name - Название
* text - Содержание (Может включать в себя html)
* participantsInvited - приглашенные участники, множественое поле, что бы передать несколько просто указать в запросе еще одно поле с таким же названием
* participantsInvited - второй участник если есть, участников не ограниченное кол-во.
* token

В ответ мы получаем  json с успехом или провалом.

#### 4. Редактирование PAD
---
Шлём `POST` запрос на адрес `/assets/pads/edit`

##### Список полей в запросе
* padId - id Pad
* name - Название
* text - Содержание (Может включать в себя html)
* participantsInvited - приглашенные участники, множественое поле, что бы передать несколько просто указать в запросе еще одно поле с таким же названием 
* participantsInvited - второй участник если есть, участников не ограниченное кол-во.
* token


#### 5. Получение PAD по ID
---
Шлём `POST` запрос на адрес `/assets/pads/detail`

##### Список полей в запросе
* token
* padId

В ответ мы получаем  json c Pad и текущим пользователем.

```json
{
    "item": {
        "$class": "org.chainpad.pad.Pad",
        "padId": "84b105e6dea242189e47270f9d303d62f00b2906bc9f89c96a494728959f0448",
        "name": "New Test Pad 2",
        "text": "Text for a new test pad",
        "dateCreate": "2018-03-01T12:44:40.672Z",
        "dateUpdate": "2018-03-02T11:38:02.422Z",
        "status": "DRAFT",
        "owner": "resource:org.chainpad.user.User#admin",
        "participantsInvited": [
            {
                "$class": "org.chainpad.user.User",
                "userId": "460979c1e6ebeff9186643820a8eeaf8fe364720093314c65790cd5c1b291b33",
                "name": "Den",
                "lastName": "Sadon",
                "email": "test@test.com",
                "phone": "+1 (111) 111-1111",
                "role": "PARTICIPANT"
            },
            {
                "$class": "org.chainpad.user.User",
                "userId": "025fd92559a26791cdc74c59b2a69e6bb804fbbde92f5d98b2c108746ba327ce",
                "name": "Yako",
                "lastName": "Vorov",
                "email": "1test@test.com",
                "phone": "+2 (222) 222-2222",
                "role": "PARTICIPANT"
            }
        ]
    },
    "user": {
        "role": "PARTICIPANT",
        "_id": "5a93d7ccf2d67a1d9705822b",
        "name": "Den",
        "lastName": "Sadon",
        "email": "test@test.com",
        "phone": "+1 (111) 111-1111",
        "password": "<--SECURITY_FIELD-->",
        "networkCard": "460979c1e6ebeff9186643820a8eeaf8fe364720093314c65790cd5c1b291b33@chainpad-network"
     }
}
```

#### 6. Изменения статусов PAD по ID
---
Шлём `POST` запрос на адрес `/assets/pads/<ACTION_NAME>`

<ACTION_NAME> может принамать след варианты

* accept - подтвердить
* decline - отклонить
* delete - удалить

##### Список полей в запросе
* token
* padId

#### 7. Получение списка Pad

Шлём `GET` запрос на адрес `/assets/pads`

##### Список полей в запросе
* token

В ответ мы получаем  json c Pads и текущим пользователем.

> Сейчас весь списко будет содержать Pads как свои так и Pads к которым данный участник привязан.

```json
{
    "items": [
        {
            "$class": "org.chainpad.pad.Pad",
            "padId": "cd023ef3f03494646ac3d3a7eea9288ad108eb8a393b95fb887526c643abd4b3",
            "name": "New Test Pad",
            "text": "Text for a new test pad",
            "dateCreate": "2018-03-02T11:45:53.912Z",
            "status": "NEW",
            "owner": {
                "$class": "org.chainpad.user.User",
                "userId": "460979c1e6ebeff9186643820a8eeaf8fe364720093314c65790cd5c1b291b33",
                "name": "Den",
                "lastName": "Sadon",
                "email": "test@test.com",
                "phone": "+1 (111) 111-1111",
                "role": "PARTICIPANT"
            },
            "participantsInvited": [
                {
                    "$class": "org.chainpad.user.User",
                    "userId": "460979c1e6ebeff9186643820a8eeaf8fe364720093314c65790cd5c1b291b33",
                    "name": "Den",
                    "lastName": "Sadon",
                    "email": "test@test.com",
                    "phone": "+1 (111) 111-1111",
                    "role": "PARTICIPANT"
                },
                {
                    "$class": "org.chainpad.user.User",
                    "userId": "025fd92559a26791cdc74c59b2a69e6bb804fbbde92f5d98b2c108746ba327ce",
                    "name": "Yako",
                    "lastName": "Vorov",
                    "email": "1test@test.com",
                    "phone": "+2 (222) 222-2222",
                    "role": "PARTICIPANT"
                }
            ]
        }
    ],
    "user": {
        "role": "PARTICIPANT",
        "_id": "5a93d7ccf2d67a1d9705822b",
        "name": "Den",
        "lastName": "Sadon",
        "email": "test@test.com",
        "phone": "+1 (111) 111-1111",
        "password": "<--SECURITY_FIELD-->",
        "networkCard": "460979c1e6ebeff9186643820a8eeaf8fe364720093314c65790cd5c1b291b33@chainpad-network",
        "__v": 0,
        "participantId": "460979c1e6ebeff9186643820a8eeaf8fe364720093314c65790cd5c1b291b33"
    }
}
```


#### 8. Поиск по списку пользователей 


Шлём `POST` запрос на адрес `/participants/users/search`

##### Список полей в запросе
* token
* query - Поисковой запрос, поиск будет идти по множеству полей.

В ответ мы получаем  json c Pads и текущим пользователем.
```json
[
    {
        "role": "PARTICIPANT",
        "_id": "5a93d7ccf2d67a1d9705822b",
        "name": "Den",
        "lastName": "Sadon",
        "email": "test@test.com",
        "phone": "+1 (111) 111-1111",
        "networkCard": "460979c1e6ebeff9186643820a8eeaf8fe364720093314c65790cd5c1b291b33@chainpad-network",
        "__v": 0,
        "participantId": "460979c1e6ebeff9186643820a8eeaf8fe364720093314c65790cd5c1b291b33"
    },
    {
        "role": "PARTICIPANT",
        "_id": "5a97e0a75dd80c73a94b6513",
        "name": "sadon",
        "lastName": "sadon",
        "email": "111sadonsergey@gmail.com",
        "phone": "798194699061111",
        "networkCard": "b30e714d19c42bec8fd0fb43fd015bd40769eb61a102758bdf988e8a4807f082@chainpad-network",
        "__v": 0,
        "participantId": "b30e714d19c42bec8fd0fb43fd015bd40769eb61a102758bdf988e8a4807f082"
    }
]
```