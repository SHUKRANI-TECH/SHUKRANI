<h1 align="center">âœ§ SHUKRANI âœ§</h1>

<p align="center">
  <a href="https://github.com/SHUKRANI-TECH/SHUKRANI">
    <img alt="SHUKRANI LOGO" height="350" src="https://files.catbox.moe/bvy2u1.jpg">
  </a>
</p>

<p align="center">
  <a href="https://github.com/SHUKRANI-TECH">
    <img title="Author" src="https://img.shields.io/badge/SHUKRANI%20BOT-RAYMOND%20KIMATH-darkgreen?style=for-the-badge&logo=whatsapp">
  </a>
</p>

---

<p align="center">
  <strong>1. FORK THIS REPOSITORY</strong><br>
  <a href="https://github.com/SHUKRANI-TECH/SHUKRANI/fork" target="_blank">
    <img alt="Fork Repo" src="https://img.shields.io/badge/Fork%20Repo-100000?style=for-the-badge&logo=github&logoColor=white&labelColor=blue&color=blue"/>
  </a>
</p>

<p align="center">
  <strong>2. SESSION ID & DEPLOYMENT</strong><br>
  <a href="https://www.shukrani.space/" target="_blank">
    <img alt="Website" src="https://img.shields.io/badge/Generate%20Session%20Now-100000?style=for-the-badge&logo=linktree&logoColor=white&labelColor=darkred&color=darkred"/>
  </a>
</p>

---

## ðŸ” HOW TO GENERATE SESSION

1. **Make sure Node.js and npm are installed**  
You can install them via terminal:

```bash
sudo apt install nodejs npm git
```

2. **Install dependencies**

```bash
npm install
```

3. **Run session script**

```bash
node session.js
```

4. **Scan the QR code** using WhatsApp on your phone.  
This will create a session file (e.g. `auth_info.json`).

---

## â˜ï¸ DEPLOY ON PLATFORM

### ðŸ”· Render

1. Create a new Web Service at [Render.com](https://render.com/)
2. Connect your GitHub repo: `https://github.com/SHUKRANI-TECH/SHUKRANI`
3. Set the **start command**:
```bash
node index.js
```
4. Upload your session file as a secret file (`auth_info.json`) or via environment variable if supported.

---

### ðŸŸ£ Heroku

1. Go to [Heroku.com](https://heroku.com/)
2. Create a new app and connect your GitHub repository
3. Go to **Settings > Buildpacks** and add:
    - `heroku/nodejs`
4. Add a `Procfile` in your repo with this line:
```
worker: node index.js
```
5. Upload your session file (`auth_info.json`) in the root of the project before deploying.

---

âœ… You're ready to run SHUKRANI on the cloud!
