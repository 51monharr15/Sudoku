# FTP deploy via Cursor secrets

**Never type FTP passwords in chat.**

---

## 1. Open Secrets (phone or PC)

1. Log in at **cursor.com**
2. Go to **Dashboard → Cloud Agents**
3. Open **Secrets**  
   (Or open your environment:  
   https://cursor.com/dashboard/cloud-agents/environments )

4. If you use a **saved environment** for Sudoku, add secrets **scoped to that environment** or to repo **51mon/Sudoku**.

---

## 2. Add these four secrets

Use type **Runtime secret** (passwords hidden from chat/logs).

| Name | Example | Notes |
|------|---------|--------|
| `FTP_HOST` | `ftp.yoursite.com` | Host only, no `ftp://` |
| `FTP_USER` | your login | |
| `FTP_PASS` | your password | Runtime secret |
| `FTP_REMOTE_DIR` | `/public_html` | Folder where `index.html` must live |

Optional:

| Name | Value |
|------|--------|
| `FTP_PORT` | `21` or `990` (FTPS) |

---

## 3. Start a **new** agent

Secrets load when the agent **starts**.

This chat **will not** see secrets you add now.

Start a **new** Cloud Agent run on Sudoku and say:

**Deploy deploy/website to my FTP using the secrets.**

---

## 4. What the agent runs

Script: `scripts/ftp-deploy.sh`  
Uploads **deploy/website/** (built site).

---

## 5. If Secrets tab missing

You need permission on the Cursor team/account that owns Cloud Agents.

---

## 6. Still stuck this week

Manual: download **deploy/sudoku-studio-upload.zip** (when on **main**) → phone FTP → your https site.

No secrets required.
