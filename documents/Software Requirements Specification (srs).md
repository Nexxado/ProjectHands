#SRS - Software Requirements Specification
 
Table of Contents
=================

  * [Introduction](#introduction)
    * [Goal](#goal)
    * [Scope](#scope)
    * [Glossary](#glossary)
    * [Overview](#overview)
  * [Use Cases](#usecases)
    * [Actor & Stakeholer Table](#actorastakeholertable)
    * [Main Use-case diagrams](#mainucdiagrams)
    * [Use-case 1](#uc1)
    * [Use-case 2](#uc2)
  * [User Stories](#userstories)
  * [Requirements](#requirements)
    * [Hardware Requirements](#hardware)
    * [Software Requirements](#software) 
    * [Additional Requirements](#additionalrequirements)
  * [User Interface Prototype](#prototype)

 
 
## SRS External Document


## <a name="introduction">Introduction</a> 

#### <a name="goal">Goal</a> 

התוכנה תייעל תנהל ותתעד את עבודת השיפוצים אותם הארגון מבצע
</br>
##### תיעוד
 
 * כמות המתנדבים
 * שמות המתנדבים
 * כמה שעות ארך השיפוץ
 * כמה כסף הושקע
 * מה בוצע במסגרת השיפוץ
 * הכתובת
 * הגורם שהפנה לאותה דירה

##### ניהול צוותים

לכל צוות יהיה חדר צאט שבו יוכלו המתנדבים לתקשר כאשר בנוסף יהיו הודעות נעוצות שבהן יפורטו הכלים הנדרשים, אישור הגעה של מתנדבים, ניהול רשימת משימות, לוח זמנים ועוד.

<hr/>

#### <a name="scope">Scope</a> 
</br>
התוכנה תפעל במודל שרת-לקוח  </br>
צד השרת יספק את שמירת המידע במסד נתונים, מערכת צ'אט, אימות משתמשים.</br>
צד הלקוח יספק גישה למערכת, תצוגה של לו"ז השיפוצים, מידע על כל שיפוץ, מידע על המתנדבים.</br>
כאשר לצד הלקוח יהיו שלשה חלקים </br>
 *  ממשק תיעוד שאליו תהיה כניסה של המנהל בלבד שבו ישמרו הפרטים על כל ההתנדבויות והשיפוצים </br> 
 *  ממשק רישום שבו מתנדב חדש יוכל להציע את עצמו להתנדבות ובו יפרט את כישוריו את זמינותו ואת מיקומו </br>
 *  ממשק ניהול שיפוץ שבו יהיה הצאט עצמו ומידע על המיקום השיפוץ הכלים ועוד </br>
 
**גבולות המערכת**    
 
 *  לא יהיו מפות מוטמעות במרכת עצמה אלא רק לינק למיקום </br>
 *  לא תהיה אפשרות להעברת כספים (למשל כדי לקנות כלים) </br>
 *  המוצר יעבוד בטכנולוגית web  וזה דורש שכל המתנדבים חייבים להיות עם  smartphone  שמחובר לרשת </br>
 
**ביצועים ואמינות**
 
 * אנו משתמשים בטכנולוגיות ובסיפריות העדכניות ביותר עם דגש על ביצועים ואמינות .

<hr/>

#### <a name="glossary">Glossary</a>  


|    |    |   | 
|----|----------------|-------|
| 1  | Volunteer  |    איש שמתנדב לעבוד בלי שכר | 
| 2 | Renovation Manager  |מנהל המוסד והאתר והוא משבץ Volunteer לפרויקט שיפוץ  | 
| 3 | Renovation Owner |  מקום שנדרש לשפץ אותו | 
| 4 | Employees Place |   בעל הדירה/הבית אותו משפצים | 


<hr/>


#### <a name="overview">Overview</a> 

בהמשך יפורטו תרחישי שימוש 
</br>
כולל דיאגרמות מפורטות של שימושים במערכת 
</br>
תרחישי שימוש פורמאלים וסיכונים וסיפורי שימוש 


## <a name="usecases">Use Cases</a>
 

#### <a name="actorastakeholertable">Actor & Stkeholer Table</a> 

|    |player name     | Goals | 
|----|----------------|-------|
| 1  | Volunteer  |  הרשמה למערכת, הרשמה לשיפוצים עתידיים. | 
| 2 | Renovation Manager  | ניהול מאגר השיפוצים והשמת המתנדבים לשיפוץ | 
| 3 | Renovation Owner | קבלת עדכון על תהליך השיבוץ |  
| 4 | Employees seeker | לחפש עובדים להעסקה |  


<hr/>


#### <a name="mainucdiagrams">Main Use-case Diagrams</a> 


![uml_d](https://github.com/Nexxado/ProjectHands/blob/master/documents/uml-d.png)

<hr/>


#### <a name="uc1">UC 1</a> 

|    |                |       | 
|----|----------------|-------|
| main player                      |   | | 
| goal                             |   | | 
| scope                            |   | | 
| Description                      |   | | 
| Trigger                          |   | | 
| Prerequisites                    |   | | 
| Successful completion conditions |   | | 
| Failure end conditions           |   | | 
| Scenario major success           |   | | 
| Extensions ( errors )            |   | | 
| Alternative scenarios            |   | | 
 

<hr/>


#### <a name="uc2">UC 2</a> 

|    |                |       | 
|----|----------------|-------|
| main player                      |   | | 
| goal                             |   | | 
| scope                            |   | | 
| Description                      |   | | 
| Trigger                          |   | | 
| Prerequisites                    |   | | 
| Successful completion conditions |   | | 
| Failure end conditions           |   | | 
| Scenario major success           |   | | 
| Extensions ( errors )            |   | | 
| Alternative scenarios            |   | | 
 
## <a name="userstories">User Stories</a>  

##  <a name="requirements">Requirements</a>  

#### <a name="hardware">Hardware Requirements</a>    
<hr/>

#### <a name="software">Software Requirements</a>  
<hr/>

#### <a name="additionalrequirements">Additional Requirements</a>  
<hr/>

## <a name="prototype">User Interface Prototype</a>   

 
