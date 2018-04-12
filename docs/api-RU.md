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
#### 1. Отрпавка SMS кода для авторизации
---
Шлём `POST` запрос на адрес `/auth/send-sms` 

> Сейчас код будет приходить вместе с ответом,пока не подключим SMS GATE.

##### Список полей в запросе
* phone - телефон

#### 2. Регистрация\Авторизация
---
Шлём `POST` запрос на адрес `/auth/sign-in` 

##### Список полей в запросе
* phone - телефон
* code - sms код

В случае если пользователь новый, система его автоматически создаст и выдаст токен.
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


> При создании Pad может потребоваться привязать участника, для этого есть поле `participantsInvited` связанное с пользователем пол полю `participantId`
#### 3. Создание PAD
---
Шлём `POST` запрос на адрес `/pads/new`

##### Список полей в запросе 
* name - Название 
* text - Содержание (Может включать в себя html)
* participantsInvited - приглашенные участники, множественое поле, что бы передать несколько просто указать в запросе еще одно поле с таким же названием
* participantsInvited - второй участник если есть, участников не ограниченное кол-во.
* token
* geo - массив из двух полей {latitude, longitude}
* textType - default="plain-text" Тип контента
* files[] - Файл или один файлы отправляемые как multipart/form-data 

В ответ мы получаем  json с успехом или провалом.

#### 4. Редактирование PAD
---
Шлём `POST` запрос на адрес `/pads/edit`

##### Список полей в запросе

Если (status != DRAFT) редактирование невозможно

* name - Название 
* text - Содержание (Может включать в себя html)
* participantsInvited - приглашенные участники, множественое поле, что бы передать несколько просто указать в запросе еще одно поле с таким же названием
* participantsInvited - второй участник если есть, участников не ограниченное кол-во.
* token
* geo - массив из двух полей {latitude, longitude}
* textType - default="plain-text" Тип контента
* files[] - Файл или один файлы отправляемые как multipart/form-data 

В ответ мы получаем  json с успехом или провалом.
#### 5. Получение PAD по ID
---
Шлём `POST` запрос на адрес `/pads/detail`

##### Список полей в запросе
* token
* padId

В ответ мы получаем  json c Pad и текущим пользователем.

```json
{
    "success": true,
    "item": {
        "$class": "org.chainpad.pad.Pad",
        "padId": "55c43d6b74dd27252176265e792053467f4ee7fde3588cd6591414ec7bd14ee8",
        "name": "Test Pad 2018.12.04",
        "text": "Text -&gt; Test Pad 2018.12.04<br>",
        "textType": "plain-text",
        "dateCreate": "2018-04-12T09:40:01.304Z",
        "dateCreateTimestamp": 1523526001304,
        "dateUpdate": "2018-04-12T09:40:04.476Z",
        "status": "DRAFT",
        "owner": {
            "$class": "org.chainpad.user.User",
            "userId": "79819469906",
            "phone": "79819469906",
            "role": "PARTICIPANT"
        },
        "participantsInvited": [],
        "participantsAccepted": [],
        "participantsDeclined": [],
        "cryptoAlgorithm": "aes-256-ctr",
        "files": [
            {
                "$class": "org.chainpad.pad.File",
                "hash": "Qmc3AH98CMmqoQfXMyFP3HvPYjw3H5SKUPZuvo1xpME3Pc",
                "name": "ac5e27f9c321aaa7a14e92a7bb7bdc68.jpg",
                "size": 105353,
                "mime": "image/jpeg",
                "extension": "jpg",
                "cryptoAlgorithm": "aes-256-ctr",
                "crc": "baf211fad47bedd91c952a88b36b94a5a7fa33ebf56101740e72acfe797e948d",
                "dateCreate": "2018-04-12T09:37:16.552Z",
                "dateCreateTimestamp": 1523525836552
            },
            {
                "$class": "org.chainpad.pad.File",
                "hash": "QmYYmJxrqQhueFGCefemLa1bqx54Wm2Ty63G7wqys68XMP",
                "name": "2017-06-12 22.17.31.jpg",
                "size": 275862,
                "mime": "image/jpeg",
                "extension": "jpg",
                "cryptoAlgorithm": "aes-256-ctr",
                "crc": "cacd0ef095b00247b1620870a874b837d425cf861ee1d0c934b80eb9f7254a87",
                "dateCreate": "2018-04-12T09:37:16.552Z",
                "dateCreateTimestamp": 1523525836552
            }
        ],
        "crc": "73ace2967925f999e05f916e540f35cc8834f98131a7a09fed0ccda29ac578b3"
    },
    "user": {
        "role": "PARTICIPANT",
        "_id": "5ac243d20da5683b4b36973f",
        "phone": "79819469906",
        "networkCard": "79819469906@chainpad-network",
        "__v": 0,
        "participantId": "79819469906"
    }
}
```

#### 6. Изменения статусов PAD по ID
---
Шлём `POST` запрос на адрес `/pads/<ACTION_NAME>`

<ACTION_NAME> может принамать след варианты

* accept - подтвердить
* decline - отклонить
* delete - удалить

##### Список полей в запросе
* token
* padId

#### 7. Получение списка Pad

Шлём `GET` запрос на адрес `/pads`

##### Список полей в запросе
* token

В ответ мы получаем  json c Pads и текущим пользователем.

> Сейчас весь списко будет содержать Pads как свои так и Pads к которым данный участник привязан.

```json
{
    "items": [
        {
            "$class": "org.chainpad.pad.Pad",
            "padId": "55c43d6b74dd27252176265e792053467f4ee7fde3588cd6591414ec7bd14ee8",
            "name": "Test Pad 2018.12.04",
            "text": "Text -&gt; Test Pad 2018.12.04<br>",
            "textType": "plain-text",
            "dateCreate": "2018-04-12T09:40:01.304Z",
            "dateCreateTimestamp": 1523526001304,
            "dateUpdate": "2018-04-12T09:40:04.476Z",
            "status": "DRAFT",
            "owner": {
                "$class": "org.chainpad.user.User",
                "userId": "79819469906",
                "phone": "79819469906",
                "role": "PARTICIPANT"
            },
            "participantsInvited": [],
            "participantsAccepted": [],
            "participantsDeclined": [],
            "cryptoAlgorithm": "aes-256-ctr",
            "files": [
                {
                    "$class": "org.chainpad.pad.File",
                    "hash": "Qmc3AH98CMmqoQfXMyFP3HvPYjw3H5SKUPZuvo1xpME3Pc",
                    "name": "ac5e27f9c321aaa7a14e92a7bb7bdc68.jpg",
                    "size": 105353,
                    "mime": "image/jpeg",
                    "extension": "jpg",
                    "cryptoAlgorithm": "aes-256-ctr",
                    "crc": "baf211fad47bedd91c952a88b36b94a5a7fa33ebf56101740e72acfe797e948d",
                    "dateCreate": "2018-04-12T09:37:16.552Z",
                    "dateCreateTimestamp": 1523525836552
                },
                {
                    "$class": "org.chainpad.pad.File",
                    "hash": "QmYYmJxrqQhueFGCefemLa1bqx54Wm2Ty63G7wqys68XMP",
                    "name": "2017-06-12 22.17.31.jpg",
                    "size": 275862,
                    "mime": "image/jpeg",
                    "extension": "jpg",
                    "cryptoAlgorithm": "aes-256-ctr",
                    "crc": "cacd0ef095b00247b1620870a874b837d425cf861ee1d0c934b80eb9f7254a87",
                    "dateCreate": "2018-04-12T09:37:16.552Z",
                    "dateCreateTimestamp": 1523525836552
                }
            ],
            "crc": "73ace2967925f999e05f916e540f35cc8834f98131a7a09fed0ccda29ac578b3"
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

Шлём `POST` запрос на адрес `/users/search`

##### Список полей в запросе
* token
* query - Поисковой запрос, поиск будет идти по номеру телефона.

В ответ мы получаем  json c Пользователями.
```json
[
    {
            "role": "PARTICIPANT",
            "_id": "5ac243d20da5683b4b36975f",
            "phone": "79819469916",
            "networkCard": "79819469916@chainpad-network",
            "__v": 0,
            "participantId": "79819469916"
        },
    {
            "role": "PARTICIPANT",
            "_id": "5ac243d20da5683b4b36973f",
            "phone": "79819469926",
            "networkCard": "79819469926@chainpad-network",
            "__v": 0,
            "participantId": "79819469926"
        }
]
```
#### 9. Получить текущего пользователя


Шлём `POST` запрос на адрес `/users/me`

##### Список полей в запросе
* token

Внутри будет 

* item - это обьект юзера в блокечейне
* user - это обьект юзера в монго БД


#### 10. Обновить текущего пользователя


Шлём `POST` запрос на адрес `/users/edit`

##### Список полей в запросе
* token - обязательное
* userId - обязательное, тут номер телефона юзера (только цифры 79999999999)
* name - Имя    
* lastName - Фамилия 
* email - Почта
* role  - PARTICIPANT или ADMIN

#### 11. Получить файл


Шлём `POST` запрос на адрес `/pads/file/get`

##### Список полей в запросе
* token - обязательное
* padId - pad id
* hash - hash файла    

В ответ мы получаем  json файлом.

```json
{
    "success": true,
    "contentType": "image/jpeg",
    "fileExtension": "jpg",
    "file": {
        "type": "Buffer",
        "data": ["< here bufer data>"]
      },
    "hash": "QmYYmJxrqQhueFGCefemLa1bqx54Wm2Ty63G7wqys68XMP"
    }
```

#### 12. Удалить файл
Шлём `POST` запрос на адрес `/pads/file/delete`

##### Список полей в запросе
* token - обязательное
* padId - pad id
* hash - hash файла    

В ответ мы получаем  json с успехом или провалом.