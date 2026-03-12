# 🌦️ Ranch Weather & River Conditions Dashboard

A simple dashboard that shows real-time weather for your location and river conditions for the Deschutes River near Madras, OR (USGS site 14092500). The app automatically refreshes every 5 minutes.

---

## What You'll See

- **Current weather** — temperature, conditions, sunrise/sunset, and a weather icon
- **River conditions** — water temperature, streamflow, and gage height with animated visuals
- **24-hour forecast** — hour-by-hour temperature and rain chance
- **Weather details** — feels like, humidity, wind, pressure, UV index, cloud cover, and rain chance

---

## How to Set It Up

### Step 1: Make Sure Python Is Installed

This app uses Python to run a small web server.

#### On Mac:

Most Macs already have Python installed.

**To check:** Open the **Terminal** app (search for "Terminal" in Spotlight) and type:

```
python3 --version
```

If you see something like `Python 3.x.x`, you're good to go!

If not, download Python from [python.org](https://www.python.org/downloads/) and install it.

#### On Windows:

**To check:** Open **Command Prompt** (search for "cmd" in the Start menu) and type:

```
python --version
```

If you see something like `Python 3.x.x`, you're good to go!

If not:
1. Go to [python.org](https://www.python.org/downloads/)
2. Download the latest Python installer for Windows
3. **Important:** During installation, check the box that says **"Add Python to PATH"**
4. Click "Install Now"
5. After installation, restart Command Prompt and verify with `python --version`

### Step 2: Download the App Files

Make sure all these files are in the same folder:

```
weather-app/
├── index.html
├── styles.css
├── app.js
├── server.py
└── README.md
```

### Step 3: Start the Server

#### On Mac:

1. Open **Terminal**
2. Navigate to the app folder by typing:
   ```
   cd /path/to/weather-app
   ```
   (Replace `/path/to/weather-app` with the actual location of your folder — for example, `cd ~/Documents/Code/weather-app`)

3. Start the server:
   ```
   python3 server.py
   ```

4. You should see a message like:
   ```
   ╔══════════════════════════════════════════════╗
   ║  Ranch Weather & River Conditions Dashboard  ║
   ║  Server running at http://localhost:8000     ║
   ║  Press Ctrl+C to stop                        ║
   ╚══════════════════════════════════════════════╝
   ```

#### On Windows:

1. Open **Command Prompt** (search for "cmd" in the Start menu)
2. Navigate to the app folder by typing:
   ```
   cd C:\path\to\weather-app
   ```
   (Replace `C:\path\to\weather-app` with the actual location of your folder — for example, `cd C:\Users\YourName\Documents\weather-app`)
   
   **Tip:** You can also type `cd ` (with a space) and then drag the folder into the Command Prompt window to auto-fill the path.

3. Start the server:
   ```
   python server.py
   ```
   
   **Note:** On Windows, use `python` instead of `python3`

4. You should see a message like:
   ```
   ╔══════════════════════════════════════════════╗
   ║  Ranch Weather & River Conditions Dashboard  ║
   ║  Server running at http://localhost:8000     ║
   ║  Press Ctrl+C to stop                        ║
   ╚══════════════════════════════════════════════╝
   ```

### Step 4: Open in Your Browser

Open your web browser (Chrome, Safari, Firefox, etc.) and go to:

```
http://localhost:8000
```

#### Accessing from Other Devices on Your Network

The dashboard can also be accessed from other devices on your local network (phones, tablets, other computers on the same WiFi).

**On Mac:**

1. Find your Mac's local IP address:
   - Open **System Preferences** → **Network**
   - Or run this command in Terminal: `ipconfig getifaddr en0`
   - You'll see something like `192.168.1.100`

2. On another device connected to the same WiFi, open a browser and go to:
   ```
   http://YOUR_MAC_IP:8000
   ```
   For example: `http://192.168.1.100:8000`

**On Windows:**

1. Find your PC's local IP address:
   - Open **Command Prompt**
   - Type: `ipconfig`
   - Look for "IPv4 Address" under your active network connection
   - You'll see something like `192.168.1.100`

2. On another device connected to the same WiFi, open a browser and go to:
   ```
   http://YOUR_PC_IP:8000
   ```
   For example: `http://192.168.1.100:8000`

**Security Note:** The server is only accessible on your local network. It is NOT accessible from the internet unless you explicitly configure port forwarding on your router (not recommended for security reasons, you WILL get bombarded by hackers).

### Step 5: Allow Location Access

When prompted, click **"Allow"** to share your location. This is needed to show the weather for where you are. Your location data is sent directly to the weather service and is not stored anywhere.

---

## How to Stop the Server

**On Mac:** Go back to the Terminal window and press **Ctrl + C** on your keyboard.

**On Windows:** Go back to the Command Prompt window and press **Ctrl + C** on your keyboard.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| **Mac:** "Command not found" when running `python3` | Install Python from [python.org](https://www.python.org/downloads/) |
| **Windows:** "'python' is not recognized" error | Install Python from [python.org](https://www.python.org/downloads/) and make sure to check "Add Python to PATH" during installation. Restart Command Prompt after installing. |
| **Windows:** "python3: command not found" | On Windows, use `python` instead of `python3` |
| Weather shows "Location access denied" | Make sure you click "Allow" when your browser asks for location access |
| River data shows "--" | The USGS data service may be temporarily unavailable; it will retry in 5 minutes |
| Page is blank | Make sure all files (index.html, styles.css, app.js) are in the same folder as server.py |
| **Windows:** Can't navigate to folder with `cd` | Use backslashes (`\`) instead of forward slashes (`/`) in Windows paths, e.g., `cd C:\Users\YourName\Documents\weather-app` |

---

## Data Sources

- **Weather**: [Open-Meteo](https://open-meteo.com/) — free, no API key required
- **River Data**: [USGS Water Services](https://waterservices.usgs.gov/) — real-time data for USGS site 14092500 (Deschutes River near Madras, OR)
