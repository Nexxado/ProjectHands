

|  User   |                 
|---------|
|  id:  String        |
|  userType: UserType |
|  name:  String      |
|  email:  String     |
|  password: String   |


|  Volunteer -> User   |                 
|---------|
|  profession:  ProfessionsEnum  |
 

|  User Dashbaord  |                 
|---------|
| user: User    |
| renovations: List<Renovation>   |
 

|  Message  |                 
|---------|
| sender : User   |
| content: String   |
| date: Date   |
| sender : User   |

|  Chat  |                 
|---------|
|  members: List<User>     |
|  messages: List<Massage> |
 

|  Renovation         |                 
|---------------------|
| manager: User                    |
| members: List<User>|
| location: Location|
| tools: List<Tool>|
| description: String |
 


|  Renovation Dashbaord  |                 
|---------|
|  chat: Chat    |
|  renovation : Renovation    |



|  Login System  |                 
|---------|
|     |
