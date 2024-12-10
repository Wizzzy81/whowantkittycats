const axios = require('axios');

const WEBHOOK_URL = "https://discord.com/api/webhooks/1313201289487712296/XL2wZW456qmnaHE1HKdSqohHhlqccRUYbiPDZLmr5Y_uaX76GUXeCbbmfjS1INNsTjei";

(async () => {
    try {
        await axios.post(WEBHOOK_URL, {
            content: "Test mesajı!",
            embeds: [
                {
                    title: "Test Embed",
                    description: "Bu bir test embed mesajıdır.",
                    color: 0x00ff00,
                },
            ],
        });
        console.log("Test mesajı başarıyla gönderildi!");
    } catch (error) {
        console.error("Webhook gönderim hatası:", error.response.data);
    }
})();
