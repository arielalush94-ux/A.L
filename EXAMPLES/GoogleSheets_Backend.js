/* 
=========================================================
 קוד חיבור לגוגל שיטס (Google Apps Script) + התרעות לטלגרם ווואטסאפ בחינם
=========================================================
 
 עקוב אחרי השלבים הבאים כדי לחבר את הטפסים ישירות לגוגל שיטס בחינם:
 
 1. פתח קובץ Google Sheets חדש (פשוט הקלד sheets.new בדפדפן).
 2. בתפריט העליון לחץ על: Extensions (הרחבות) -> Apps Script (Google Apps Script).
 3. יפתח חלון קוד. מחק את כל מה שכתוב שם, והדבק במקום את כל הקוד שמופיע למטה.
 4. החלף את הערכים של TELEGRAM_BOT_TOKEN ו-TELEGRAM_CHAT_ID (מוסבר בהמשך מאיפה להביא אותם).
 5. לחץ על סמל הדיסקט (Save) למעלה בתפריט של הסקריפט (או Ctrl+S).
 6. בצד ימין למעלה לחץ על הכפתור הכחול: Deploy (פריסה) -> ואז New deployment (פריסה חדשה).
 7. ליד "Select type" (למעלה משמאל בחלון שניפתח) לחץ על גלגל השיניים, ובחר "Web app" (אפליקציית אינטרנט).
 8. בשדה "Description" תרשום מה שתרצה (למשל: "חיבור טפסים").
 9. תחת "Who has access" (למי יש גישה) חובה לשנות ל-"Anyone" (כל אחד!).
 10. לחץ על הכפתור למטה "Deploy" (לקראת הסוף פה). 
    * אם קופץ חלון אזהרה מצד גוגל (Authorization required), לחץ על Review permissions -> בחר את החשבון הרגיל שלך -> אם יש חלון אזהרה אדום, לחץ על Advanced (מתקדם) למטה -> ואז Go to Untitled project (unsafe) -> ולבסוף Allow (אפשר).
 11. במסך הסיום, תמצא תחת "Web app URL" כתובת ארוכה (המתחילה ב-https://script.google...). העתק אותה!
 12. פתח את הקובץ script.js שלנו, לך לשורה 11, והחלף את הכתובת הישנה (`https://your-webhook-url.com/api/leads`) בכתובת החדשה שהעתקת!
 
 =========================================================
*/

// --- הגדרות טלגרם ---
// 1. כיצד להוציא טוקן:
// פתח טלגרם וחפש את BotFather@. שלח לו את הפקודה newbot/ ועקוב אחרי ההוראות (לתת שם לבוט). בסוף הוא יביא לך מחרוזת טקסט ארוכה שזה הטוקן.
var TELEGRAM_BOT_TOKEN = "8637241994:AAHPCeBtWHkFQ8jc2LS1s0Aj5IvTmbGFUXc";

// 2. כיצד להוציא את ה-Chat ID:
// שלח הודעה לבוט שכרגע יצרת בטלגרם (למשל את המילה test).
// לאחר מכן, חפש בטלגרם את userinfobot@ (או getmyid_bot@) ותשלח לו הודעה, הוא יחזיר לך את ה-ID המספרי שלך.
var TELEGRAM_CHAT_ID = "554520902";

function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSheet();

        // מפענחים את המידע שהגיע מהטופס
        var data = JSON.parse(e.postData.contents);

        // יצירת עמודות אם הטופס ריק
        if (sheet.getLastRow() === 0) {
            sheet.appendRow(["תאריך מלא", "שם מלא", "טלפון", "מקור הפנייה"]);
            sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f0f0f0");
        }

        // יצירת תאריך מותאם ואמין לפי שעון ישראל
        var timestamp = Utilities.formatDate(new Date(), "Asia/Jerusalem", "dd/MM/yyyy HH:mm");
        var fullName = data.fullName || "לא צוין";
        var phoneOriginal = data.phone || "לא צוין";
        var source = data.source || "טופס ליד";

        // 1. שמירת הליד בגוגל שיטס בצורה בטוחה (ללא אוטו-פורמט)
        var rowData = [timestamp, fullName, phoneOriginal, source];
        var nextRow = sheet.getLastRow() + 1;
        var rowRange = sheet.getRange(nextRow, 1, 1, rowData.length);

        // הגדרת עמודת הטלפון בשורה החדשה כ"טקסט פשוט" מראש
        sheet.getRange(nextRow, 3).setNumberFormat("@");

        // הכנסת הנתונים בפועל
        rowRange.setValues([rowData]);

        // 2. הכנת הקישור לשליחת וואטסאפ ללקוח
        var cleanPhone = phoneOriginal.replace(/-/g, "");
        if (cleanPhone.startsWith("0")) {
            cleanPhone = "972" + cleanPhone.substring(1);
        }

        // חישוב שם פרטי בלבד
        var firstName = fullName.split(" ")[0] || fullName;

        // בניית ההודעה החדשה
        var messageToClient = encodeURIComponent("היי " + firstName + " קיבלנו את הפרטים שלך, ניצור איתך קשר בהמשך היום!");
        var waLink = "https://api.whatsapp.com/send?phone=" + cleanPhone + "&text=" + messageToClient;

        // 3. שליחת התרעה לטלגרם שלך הכוללת כפתור לוואטסאפ (בשימוש ב-HTML למניעת שבירת לינקים)
        var telegramMessage = "🚨 <b>ליד חדש התקבל!</b> 🚨\n\n" +
            "👤 <b>שם:</b> " + fullName + "\n" +
            "📱 <b>טלפון:</b> " + phoneOriginal + "\n" +
            "🌐 <b>מקור:</b> " + source + "\n\n" +
            "💬 <a href='" + waLink + "'>לחץ כאן לשליחת וואטסאפ ללקוח</a>";

        if (TELEGRAM_BOT_TOKEN !== "כאן-שמים-את-הטוקן-של-הבוט" && TELEGRAM_CHAT_ID !== "כאן-שמים-את-הצ'אט-איי-די") {
            var telegramUrl = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
            var options = {
                "method": "post",
                "contentType": "application/json",
                "payload": JSON.stringify({
                    "chat_id": TELEGRAM_CHAT_ID,
                    "text": telegramMessage,
                    "parse_mode": "HTML",
                    "disable_web_page_preview": true // למנוע תצוגה מקדימה לא רצויה של הקישור
                })
            };
            // שליחת הבקשה לטלגרם
            UrlFetchApp.fetch(telegramUrl, options);
        }

        return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Lead processed successfully" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
