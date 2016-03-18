#SRS - Software Requirements Specification
 
Table of Contents
=================

  * [introduction](#introduction)
    * [goal](#goal)
    * [scope](#scope)
    * [glossary](#glossary)
    * [overview](#overview)
  * [usecases](#usecases)
    * [actorastakeholertable](#actorastakeholertable)
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
 
#### scope

התוכנה תפעל במודל שרת-לקוח 
צד השרת יספק את שמירת המידע במסד נתונים, מערכת צ'אט, אימות משתמשים.
צד הלקוח יספק גישה למערכת, תצוגה של לו"ז השיפוצים, מידע על כל שיפוץ, מידע על המתנדבים.
כאשר לצד הלקוח יהיו שלשה חלקים 
ממשק תיעוד שאליו תהיה כניסה של המנהל בלבד שבו ישמרו הפרטים על כל ההתנדבויות והשיפוצים 
ממשק רישום שבו מתנדב חדש יוכל להציע את עצמו להתנדבות ובו יפרט את כישוריו את זמינותו ואת מיקומו 
ממשק ניהול שיפוץ שבו יהיה הצאט עצמו ומידע על המיקום השיפוץ הכלים ועוד 
גבולות המערכת:
לא יהיו מפות מוטמעות במרכת עצמה אלא רק לינק למיקום 
לא תהיה אפשרות להעברת כספים (למשל כדי לקנות כלים) 
המוצר יעבוד דרך web  זא שכל המתנדבים חייבים להיות עם  smartphone עליהם שמחובר לרשת 
ביצועים ואמינות:
אנו משתמשים בטכנולוגיות ובסיפריות העדכניות ביותר עם דגש על ביצועים ואמינות בעולם ה spa 

#### glossary 

**Volunteer**  איש שמתנדב לעבוד בלי שכר
</br>
**Renovation Manager** מנהל המוסד והאתר והוא משבץ Volunteer לפרויקט שיפוץ
</br>
**Renovation Place** מקום שנדרש לשפץ אותו
</br>
**Renovation Owner** בעל הדירה/הבית אותו משפצים
</br>

#### overview

בהמשך יפורטו תרחישי שימוש 
</br>
כולל דיאגרמות מפורטות של שימושים במערכת 
</br>
תרחישי שימוש פורמאלים וסיכונים וסיפורי שימוש 


## usecases
 

#### actorastakeholertable 

|    |player name     | Goals | 
|----|----------------|-------|
| 1  | Volunteer  |  הרשמה למערכת, הרשמה לשיפוצים עתידיים. | 
| 2 | Renovation Manager  | ניהול מאגר השיפוצים והשמת המתנדבים לשיפוץ | 
| 3 | Renovation Owner | קבלת עדכון על תהליך השיבוץ |  
| 4 | Employees seeker | לחפש עובדים להעסקה |  

#### mainucdiagrams


![uml_d](https://github.com/Nexxado/ProjectHands/blob/master/documents/uml-d.png)


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

Description


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
#### software 
#### additionalrequirements 
## prototype 

 
