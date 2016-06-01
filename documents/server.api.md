# Server Api

**Table of Contents**

* [Authentication](#authentication)
    * [Login](#login)
    * [isLoggedIn](#isloggedin)
    * [Logout](#logout)
    * [Sign Up](#sign-up)
    * [OAuth Sign Up](#oauth-sign-up)
    * [Email Activation](#email-activation)
    * [Authenticate User Action](#authenticate-user-action)
    * [Update User Role](#update-user-role)
    

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
| BODY | password | String

#### Response

| Status  | Response |
|---|---|
| 200  |{ success: true,  name: String, email: String, <br> role: String, phone: String, isOAuth: boolean, <br> approved: boolean, signup_complete: boolean, joined_date: Date ISO String, <br> avatar: img url, renovations: Array, tasks: Array } |
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
| 200  |{ success: true,  name: String, email: String, <br> role: String, phone: String, isOAuth: boolean, <br> approved: boolean, signup_complete: boolean, joined_date: Date ISO String, <br> avatar: img url, renovations: Array, tasks: Array } |
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
| 200  |{success: true} |
| 400 | {errMessage: "Please Provide all required fields"} or {errMessage: "User Already Logged In"} |

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
| 400 | {errMessage: "Please Provide all required fields"} or {errMessage: "Sign-Up Process has already been completed"} |

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
|200 | {success: true} |
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
|200 | {success: true} |
| 400 | {errMessage: "No user or new role provided"} |
| 401 | {errMessage : "Error: User is not logged in" } |
| 403 | {errMessage: "Not Allowed"} |
| 500 | {errMessage: "No Action ID"} |

---