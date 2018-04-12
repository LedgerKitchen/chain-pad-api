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
#### 1. Send SMS Auth code
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
* membersInvited - invited members, a multi-field, that would pass a few simply to specify in the request one more field with the same name
* membersInvited - the second participant, if any, the participants are not limited to the number.
* token
* geo - an array of two fields {latitude, longitude}
* textType - default = "plain-text" Content type
* files [] - A file or one file passed as multipart / form-data

In response, we get json with success or failure.


#### 4. Editing the PAD
---
Send `POST` request to the address `/pads/edit`

##### List of fields in the query
* name - Name
* text - Content (Can include html)
* membersInvited - invited members, a multi-field, that would pass a few simply to specify in the request one more field with the same name
* membersInvited - the second participant, if any, the participants are not limited to the number.
* token
* geo - an array of two fields {latitude, longitude}
* textType - default = "plain-text" Content type
* files [] - A file or one file passed as multipart / form-data

In response, we get json with success or failure.

#### 5. Getting the PAD by ID
---
Send `POST` request to the address `/pads/detail`

##### List of fields in the query
* token

In response, we get json c Pad and the current user.

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
* name - Naem
* lastName -  Last Name
* email - email 
* role  - PARTICIPANT or ADMIN

#### 11. Get the file


Send `POST` request to the address `/pads/file/get`

##### List of fields in the query
* token - required
* padId - pad id
* hash - hash file

In response, we get a json file.

```json
{
     "success": true,
     "contentType": "image/jpeg",
     "fileExtension": "jpg",
     "file": {
         "type": "Buffer",
         "data": ["<here bufer data>"]
       },
     "hash": "QmYYmJxrqQhueFGCefemLa1bqx54Wm2Ty63G7wqys68XMP"
     }
```

#### 12. Delete the file
Send `POST` request to the address `/pads/file/delete`

##### List of fields in the query
* token - required
* padId - pad id
* hash - hash file

In response, we get json with success or failure.