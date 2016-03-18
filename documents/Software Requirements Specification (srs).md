#SRS - Software Requirements Specification
 
Table of Contents
=================

  * [introduction](#introduction)
    * [goal](#goal)
    * [scope](#scope)
    * [glossary](#glossary)
    * [overview](#overview)
  * [Use Cases](#usecases)
    * [Actor & Stakeholer table](#actorastakeholertable)
    * [mainucdiagrams](#mainucdiagrams)
    * [uc1](#uc1)
    * [uc2](#uc2)
  * [userstories](#userstories)
  * [requirements](#requirements)
    * [hardware](#hardware)
    * [software](#software) 
    * [additionalrequirements](#additionalrequirements)
    * [prototype](#prototype)

 
 
## SRS External Document


## introduction

#### goal

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

#### scope
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

#### glossary 


|    |    |   | 
|----|----------------|-------|
| 1  | Volunteer  |    איש שמתנדב לעבוד בלי שכר | 
| 2 | Renovation Manager  |מנהל המוסד והאתר והוא משבץ Volunteer לפרויקט שיפוץ  | 
| 3 | Renovation Owner |  מקום שנדרש לשפץ אותו | 
| 4 | Employees Place |   בעל הדירה/הבית אותו משפצים | 


<hr/>


#### overview

בהמשך יפורטו תרחישי שימוש 
</br>
כולל דיאגרמות מפורטות של שימושים במערכת 
</br>
תרחישי שימוש פורמאלים וסיכונים וסיפורי שימוש 


## <a name="usecases">Use Cases</a>
 

#### <a name="actorastakeholertable">Actor & Stkeholer table</a> 

|    |player name     | Goals | 
|----|----------------|-------|
| 1  | Volunteer  |  הרשמה למערכת, הרשמה לשיפוצים עתידיים. | 
| 2 | Renovation Manager  | ניהול מאגר השיפוצים והשמת המתנדבים לשיפוץ | 
| 3 | Renovation Owner | קבלת עדכון על תהליך השיבוץ |  
| 4 | Employees seeker | לחפש עובדים להעסקה |  


<hr/>


#### mainucdiagrams


![uml_d](https://github.com/Nexxado/ProjectHands/blob/master/documents/uml-d.png)

<hr/>


#### uc1

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


#### uc2

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




## userstories 
## requirements 
#### hardware  
<hr/>
#### software
<hr/>
#### additionalrequirements
<hr/>
## prototype 

 
