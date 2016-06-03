# Server Api

**Table of Contents**

* [**Authentication**](#authentication)
    * [Login](#login)
    * [isLoggedIn](#isloggedin)
    * [Logout](#logout)
    * [Sign Up](#sign-up)
    * [OAuth Sign Up](#oauth-sign-up)
    * [Email Activation](#email-activation)
    * [Authenticate User Action](#authenticate-user-action)
    * [Update User Role](#update-user-role)
    * [Forgot Password](#forgot-password)
    * [Reset Password](#reset-password)
* [**Chat**](#chat)
    * [Get Chat History](#chat-history)
* [**Status**](#Status)
    * [Update Status](#update-status)
    * [Get Status](#get-status)
* [**Data Exchange**](#data-exchange)
    * [Import Data](#import-data)
    * [Export Data](#export-data)
* [**Photos**](#photos)
    * [Upload Photos](#upload-photos)
    * [Delete Photos](#delete-photos)
    * [Get Album Data](#get-album-data)
* [**Renovations**](#renovations)
    * [Get Renovation Info](#get-renovation-info)
    * [Get All Renovations](#get-all-renovations)
    * [Create Renovation](#create-renovation)
* [**Users**](#users)
    * [Get All Users](#get-all-users)
    * [Get All Sign-ups](#get-all-sign-ups)
    * [Approve User](#approve-user)
    * [Delete User](#delete-user)
* [**Teams**](#teams)
    * [Create Team](#create-team)
    * [Delete Team](#delete-team)
    * [Add Members](#add-members)
    

---

## Authentication

### Login

#### Request

| Method | Url |
|---|---|
|  POST | /api/auth/login |

| Type  | Params | Values |
|---|---|---|
| BODY  | email | String |
| BODY  | password | String

#### Response

| Status  | Response |
|---|---|
| 200 | { success: true,  name: String, email: String, <br> role: String, phone: String, isOAuth: boolean, <br> approved: boolean, signup_complete: boolean, joined_date: Date ISO String, <br> avatar: img url, renovations: Array, tasks: Array } |
| 400 | {errMessage: "Email or Password are incorrect"} |
| 401 | {data: "Error: User is not logged in", status: 401 } |

---

### isLoggedIn

#### Request

| Method | Url |
|---|---|
|  GET | /api/auth/isLoggedIn |

| Type  | Params | Values |
|---|---|---|
|   |  |  |

#### Response

| Status  | Response |
|---|---|
| 200 | { success: true,  name: String, email: String, <br> role: String, phone: String, isOAuth: boolean, <br> approved: boolean, signup_complete: boolean, joined_date: Date ISO String, <br> avatar: img url, renovations: Array, tasks: Array } |
| 401 | {errMessage : "Error: User is not logged in" } |

---

### Logout

#### Request

| Method | Url |
|---|---|
|  GET | /api/auth/logout |

| Type  | Params | Values |
|---|---|---|
|   |  |  |

#### Response

| Status  | Response |
|---|---|
| 200  |{success: true} |
| 401 | {errMessage : "Error: User is not logged in" } |

---

### Sign Up

#### Request

| Method | Url |
|---|---|
|  POST | /api/auth/signup |

| Type  | Params | Values |
|---|---|---|
|  BODY | email | String |
|  BODY | password | String |
|  BODY | name | String |
|  BODY | phone | String |
|  BODY | area | String |
|  BODY | team_leader | String |

#### Response

| Status  | Response |
|---|---|
| 200 | {success: true} |
| 400 | {errMessage: "Please Provide all required fields"} |
| 400 | {errMessage: "User Already Logged In"} |

---

### OAuth Sign Up

#### Request

| Method | Url |
|---|---|
|  POST | /api/auth/signup_oauth |

| Type  | Params | Values |
|---|---|---|
|  BODY | phone | String |
|  BODY | area | String |
|  BODY | team_leader | String |

#### Response

| Status  | Response |
|---|---|
| 200  |{success: true} |
| 400 | {errMessage: "Please Provide all required fields"} |
| 400 | {errMessage: "Sign-Up Process has already been completed"} |

---

### Email Activation

#### Request

| Method | Url |
|---|---|
|  GET | /api/auth/activation/:token |

| Type  | Params | Values |
|---|---|---|
|  PARAMS | token | String |

#### Response

| Status  | Response |
|---|---|
| --  | Redirects to error\success page |

---

### Authenticate User Action
Server assigns action id to request according to passed param

#### Request

| Method | Url |
|---|---|
|  GET | /api/auth/authenticate/:action |

| Type  | Params | Values |
|---|---|---|
|  PARAMS | action | String |

#### Response

| Status  | Response |
|---|---|
| 200 | {success: true} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "No Action ID"} |

---

### Update User Role
Server assigns action id to request according to passed param

#### Request

| Method | Url |
|---|---|
| POST | /api/auth/assignrole |

| Type  | Params | Values |
|---|---|---|
|  BODY | action | String |

#### Response

| Status  | Response |
|---|---|
| 200 | {success: true} |
| 400 | {errMessage: "No user or new role provided"} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "No Action ID"} |

---

### Forgot Password

#### Request

| Method | Url |
|---|---|
| POST | /api/auth/forgot |

| Type  | Params | Values |
|---|---|---|
|  BODY | email | String |
|  BODY | old_password | String |
|  BODY | new_password | String |

#### Response

| Status  | Response |
|---|---|
| 200 | {success: true} |
| 400 | {errMessage: ""} |
| 500 | {errMessage: ""} |

---

### Reset Password

#### Request

| Method | Url |
|---|---|
| GET | /api/auth/reset/:token |

| Type  | Params | Values |
|---|---|---|
|  PARAMS | token | String |

#### Response

| Status  | Response |
|---|---|
| 200 | {success: true} |
| 400 | {errMessage: ""} |
| 500 | {errMessage: ""} |

---

---

## Chat

### Chat History

#### Request

| Method | Url |
|---|---|
| GET | /api/chat/history/:chatId |

| Type  | Params | Values |
|---|---|---|
|  PARAMS | chatId | String |

#### Response

| Status  | Response |
|---|---|
| 200 | {id: chat_id, messages: [{align: msgSide, class: msgClass, content: msgContent, timestamp: HH:mm, user: username}]} |
| 400 | {errMessage: "Invalid Chat Id"} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 500 | {errMessage: "Error getting chat history"} |

---

---

# Status

Endpoints regarding ProjectHands' Referral Receiving Status

### Update Status

#### Request

| Method | Url |
|---|---|
| POST | /api/status/update_status |

| Type  | Params | Values |
|---|---|---|
|  BODY | active | boolean |
|  BODY | message | String |

#### Response

| Status  | Response |
|---|---|
| 200 | {active: boolean, message: ""} |
| 400 | {errMessage: "Invalid new status"} |
| 500 | {errMessage: "Error updating status"} |

---

### Get Status

#### Request

| Method | Url |
|---|---|
| GET | /api/status/get_status |

| Type  | Params | Values |
|---|---|---|
|   |   |   |

#### Response

| Status  | Response |
|---|---|
| 200 | {active: boolean, message: ""} |
| 500 | {errMessage: "Error getting status"} |

---

---

## Data Exchange

### Import Data

#### Request

| Method | Url |
|---|---|
| POST | /api/dataexchange/import |

| Type  | Params | Values |
|---|---|---|
|   |   |   |

#### Response

| Status  | Response |
|---|---|
|   |   |

---

### Export Data

#### Request

| Method | Url |
|---|---|
| GET | /api/dataexchange/export/:collectionName&:query |

| Type  | Params | Values |
|---|---|---|
|   |   |   |

#### Response

| Status  | Response |
|---|---|
|   |   |

---

---

## Photos

### Upload Photos

#### Request

| Method | Url |
|---|---|
| POST | /api/photos/uploads |

| Type  | Params | Values |
|---|---|---|
| FILES | file    | File     |
| BODY  | album   | string   |

#### Response

| Status  | Response |
|---|---|
|200   | {album: string, file_id: string, web_link: string} |
|400   | {errMessage: "Error: missing album"}  |
|400   | {errMessage: "Error: missing file"}  |
|500   | {errMessage: "Error: file not saved"}  |

### Delete Photos

#### Request

| Method | Url |
|---|---|
| DELETE | /api/photos/delete |

| Type  | Params | Values |
|---|---|---|
| QUERY | file_id  | string    |

#### Response

| Status  | Response |
|---|---|
|200   | {success: true}  |
|500   | {errMessage: "Error: file not deleted"} |

---

### Get Album Data

#### Request

| Method | Url |
|---|---|
| GET | /api/photos/album |

| Type  | Params | Values |
|---|---|---|
| QUERY | album   | string  |

#### Response

| Status  | Response |
|---|---|
|200   | [{album: string, file_id: string, web_link: string},...]  |
|500   | {errMessage: "Couldn't find album"} |

---

---

## Renovations

### Get Renovation Info

#### Request

| Method | Url |
|---|---|
| GET | /api/renovation/get_info/:city&:street&:num |

| Type  | Params | Values |
|---|---|---|
| PARAMS | city  | String  |
| PARAMS | street  | String  |
| PARAMS | num  | int  |

#### Response

| Status  | Response |
|---|---|
| 200 | {isRSVP: boolean, renovation: {addr: {}, created: date, updated: date, date: date, tasks: [{name: username, ... }], ...} |
| 400 | {errMessage: "No renovation matches the address"} |
| 400 | {errMessage: "Invalid renovation address"} |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "Failed to get renovation info"} |

---

### Get All Renovations

#### Request

| Method | Url |
|---|---|
| GET | /api/renovation/all |

| Type  | Params | Values |
|---|---|---|
|  |   |   |

#### Response

| Status  | Response |
|---|---|
| 200 | [{...}, {...}, ...] |
| 400 | {errMessage: "No renovations found"} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "Failed to get renovations"} |

---

### Create Renovation

#### Request

| Method | Url |
|---|---|
| GET | /api/renovation/create |

| Type  | Params | Values |
|---|---|---|
| BODY  | city  |  String  |
| BODY  | street  |  String  |
| BODY  | num  |  int  |

#### Response

| Status  | Response |
|---|---|
| 200 | {success: true} |
| 400 | {errMessage: "Invalid renovation address"} |
| 400 | {errMessage: "Renovation already exists"} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "Failed to create renovation"}  |

---

---

## Users

### Get All Users

#### Request

| Method | Url |
|---|---|
| GET | /api/user/all_users |

| Type  | Params | Values |
|---|---|---|
|  |   |   |

#### Response

| Status  | Response |
|---|---|
| 200 | [{name: "", email: "", role: "", approved: true, ...}, {...}, ...] |
| 400 | {errMessage: "No users found"} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "Failed to get users"} |

---

### Get All Sign-ups

#### Request

| Method | Url |
|---|---|
| GET | /api/user/all_signups |

| Type  | Params | Values |
|---|---|---|
|  |   |   |

#### Response

| Status  | Response |
|---|---|
| 200 | [{name: "", email: "", role: guest, approved: false, ...}, {...}, ...] |
| 400 | {errMessage: "No signups found"} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "Failed to get signups"} |

---

### Approve User
Approve a user to join Project Hands

#### Request

| Method | Url |
|---|---|
| POST | /api/user/approve |

| Type  | Params | Values |
|---|---|---|
| BODY | email | String  |
| BODY | role  | String  |

#### Response

| Status  | Response |
|---|---|
| 200 | {success: true} |
| 400 | {errMessage: "Invalid user email or role"} |
| 401 | {errMessage: "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "Failed to approve user"} |

---

### Delete User

#### Request

| Method | Url |
|---|---|
| DELETE | /api/user/delete/:email |

| Type  | Params | Values |
|---|---|---|
| PARAMS | email | String  |

#### Response

| Status  | Response |
|---|---|
| 200 | {success: true} |
| 400 | {errMessage: "Invalid user email"} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "Failed to delete user"} |

---

---

## Teams

### Create Team

#### Request

| Method | Url |
|---|---|
| POST | /api/team/create |

| Type  | Params | Values |
|---|---|---|
| BODY | name | String |

#### Response

| Status  | Response |
|---|---|
| 200 | {success: true} |
| 400 | {errMessage: "Invalid team name"} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "Failed to create team"} |

---

### Delete Team

#### Request

| Method | Url |
|---|---|
| DELETE | /api/team/delete/:name |

| Type  | Params | Values |
|---|---|---|
| PARAMS | name | String |

#### Response

| Status  | Response |
|---|---|
| 200 | {success: true} |
| 400 | {errMessage: "Invalid team name"} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "Failed to delete team"} |

---

### Add Members

#### Request

| Method | Url |
|---|---|
| POST | /api/team/add_members |

| Type  | Params | Values |
|---|---|---|
| BODY | name | String |
| BODY | members | Array |

#### Response

| Status  | Response |
|---|---|
| 200 | {newMembersAdded: ["", "", ...], alreadyInTeam: ["", "", ...]} |
| 400 | {errMessage: "Invalid team name or members email"} |
| 400 | {errMessage: "Team does not exists"} |
| 400 | {errMessage: "No new members to add"} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "Failed to add members to team"} |

---