# מפרט דרישות תוכנה  - SRS


## Project 'Hands' 


Table of Contents
=================

  * [introduction](#introduction)
    * [purpose](#purpose)
    * [scope](#scope)
    * [terms](#terms)
    * [review](#review)
  * [usecases](#usecases)
    * [diagrams](#diagrams)
  * [userstories](#userstories)
  * [requirements](#requirements)
    * [hardware](#hardware)
    * [software](#software) 
    * [additionalrequirements](#additionalrequirements)
    * [prototype](#prototype)

Team Members
============
* Ruby Lichtenstein - <a href="https://github.com/RubyLichtenstein" target="_blank">RubyLichtenstein</a>
* Ihab Zhaika - <a href="https://github.com/ihabZhaika" target="_blank">ihabZhaika</a>
* Dan Draiman - <a href="https://github.com/DDraiman1990" target="_blank">DDraiman1990</a>
* Netanel Draiman - <a href="https://github.com/Nexxado" target="_blank">Nexxado</a>

related documents
=================
 * a
 * b 
 


## introduction

#### purpose

התוכנה תייעל תנהל ותתעד את עבודת השיפוצים אותם הארגון מבצע
</br>
תיעוד
 
 * כמות המתנדבים
 * שמות המתנדבים
 * כמה שעות ארך השיפוץ
 * כמה כסף הושקע
 * מה בוצע במסגרת השיפוץ
 * הכתובת
 * הגורם שהפנה לאותה דירה

ועוד.

ניהול צוותים
ע"י חדר צאט לכל קבוצה
שבה יוכלו המתנדבים לת
קשר כאשר בנוסף יהיו ה
ודעות נעוצות שבהן יפו
רטו הכלים הנדרשים אישו
ר הגעה של מתנדבים, וני
הול רשימת משימות  כתוב
ת לוח זמנים ועוד.
 
## scope

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

## terms 

**Volunteer**  איש שמתנדב לעבוד בלי שכר
</br>
**Renovation Manager** מנהל המוסד והאתר והוא משבץ Volunteer לפרויקט שיפוץ
</br>
**Renovation Place** מקום שנדרש לשפץ אותו
</br>
**Renovation Owner** בעל הדירה/הבית אותו משפצים
</br>

## review

בהמשך יפורטו תרחישי שימוש 
</br>
כולל דיאגרמות מפורטות של שימושים במערכת 
</br>
תרחישי שימוש פורמאלים וסיכונים וסיפורי שימוש 


## usecases
 

### players table 
|    |player name     | Goals | 
|----|----------------|-------|
| 1  | Volunteer  |  הרשמה למערכת, הרשמה לשיפוצים עתידיים. | 
| 2 | Renovation Manager  | ניהול מאגר השיפוצים והשמת המתנדבים לשיפוץ | 
| 3 | Renovation Owner | קבלת עדכון על תהליך השיבוץ |  
| 4 | Employees seeker | לחפש עובדים להעסקה |  

## diagrams

![uml_d](https://github.com/Nexxado/ProjectHands/blob/master/documents/uml-d.png)

## userstories 
## requirements 
## hardware  
## software 
## additionalrequirements 
## prototype 

 
