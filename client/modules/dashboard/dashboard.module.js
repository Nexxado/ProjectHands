angular.module('ProjectHands.dashboard', ['ngMaterial', 'ui.calendar'])

/**************************************/
/***** Application Wide Constants *****/
/**************************************/
.constant('RENOVATION_STAGES', {
	STAGE1: "ביקור ראשוני בדירה לבדיקת התאמה",
	STAGE2: "הוחלט לשפץ, יש צורך לעדכן עובד סוציאלי",
	STAGE3: "עובד סוציאלי עודכן, יש צורך לשבץ צוות",
	STAGE4: "על ראש הצוות להגיע לביקור לצרכי תכנון",
	STAGE5: "שלב ההכנות לשיפוץ",
	STAGE6: "הדירה בשיפוץ",
	STAGE7: "הסתיים השיפוץ"
});