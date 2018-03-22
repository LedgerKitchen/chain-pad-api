# CHAIN PAD API

> The system works on the basis of JWT (json web tokens)

> All responses are returned in JSON format, there is always a `success` (true \ false) field, which logically tells us about the success of the operation
if the field is `false`, the response will contain the field` message`, which will contain the error text of the application.

Example of an error response
```
{
    "success": false,
    "message": "Incorrect Email or Password"
}
```
#### 1. Отрпавка SMS кода для авторизации
---
Send `POST` request to the address `/auth/send-sms` 

> Now the code will be sent with an answer. While there is no real SMS sending.


#### 2. Authorize \ Register
---
Send `POST` request to the address `/auth/sign-in` 

##### List of fields in the query
* phone - phone
* code - sms code

> If the user is new, the system automatically creates it.

> I recommend that you save the token, then it will be required to send any requests.

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

#### 3. Creating a PAD
---
Send `POST` request to the address`/pads/new`

##### List of fields in the query
* name - Name
* text - Content (Can include html)
* participantsInvited - invited participants, a multiple field, that would pass several simply to specify in the request one more field with the same name
* participantsInvited - the second participant if there are, participants not limited number.
* token

In response, we get json with success or failure.


#### 4. Editing the PAD
---
Send `POST` request to the address `/pads/edit`

##### List of fields in the query
* padId - id Pad
* name - Name
* text - Content (Can include html)
* participantsInvited - invited participants, a multiple field, that would pass several simply to specify in the request one more field with the same name
* participantsInvited - the second participant if there are, participants not limited number.
* token

In response, we get json with success or failure.

#### 5. Getting the PAD by ID
---
Send `POST` request to the address `/pads/detail`

##### List of fields in the query
* token

In response, we get json c Pad and the current user.

```json
{
    "item": {
        "$class": "org.chainpad.pad.Pad",
        "padId": "84b105e6dea242189e47270f9d303d62f00b2906bc9f89c96a494728959f0448",
        "name": "New Test Pad 2",
        "text": "Text for a new test pad",
        "dateCreate": "2018-03-01T12:44:40.672Z",
        "dateUpdate": "2018-03-02T11:38:02.422Z",
        "status": "NEW",
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


#### 6. PAD status changes by ID
---
Send the `POST` request to the address `/pads/<ACTION_NAME> `

<ACTION_NAME> can apply options

* accept - confirm Pad
* decline - reject Pad
* delete - delete Pad

##### List of fields in the query
* token
* padId

#### 7. Getting the Pad List

Send `GET` request to the address of`/pads`

##### List of fields in the query
* token

In response, we get json c Pads and the current user.

> Now the entire list will contain Pads as their own and the Pads to which this participant is attached.

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


#### 8. Search the list of users

Send `POST` request to the address`/users/search`

##### List of fields in the query
* token
* query - Search query, the search will follow a set of fields.

In response, we get json c Pads and the current user.

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

#### 9. Get authorized user


Send `POST` request to the address `/users/me`

##### List of fields in the query
* token


Response 
* item - user object in blockchain
* user -user object in mongo DB


#### 10. Update user


Send `POST` request to the address `/users/edit`

##### List of fields in the query
* token - required
* userId - required, here user phone number (only numbers 79999999999)
* name -
* lastName - 
* email - 
* phone - 
* role  - PARTICIPANT or ADMIN