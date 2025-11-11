# 🌐 Deploy KIANSANTANG Online dengan Domain

## 🎯 Tujuan
Membuat sistem KIANSANTANG dapat diakses online melalui domain:
- **Backend**: https://api.kiansantang.bapas-bandung.go.id
- **Registration**: https://registrasi.kiansantang.bapas-bandung.go.id
- **Operator**: https://operator.kiansantang.bapas-bandung.go.id
- **Display**: https://display.kiansantang.bapas-bandung.go.id
- **Petugas**: https://petugas.kiansantang.bapas-bandung.go.id

---

## 📋 Yang Dibutuhkan

### 1. Domain
```
Domain: kiansantang.bapas-bandung.go.id
Subdomain:
- api.kiansantang.bapas-bandung.go.id
- registrasi.kiansantang.bapas-bandung.go.id
- operator.kiansantang.bapas-bandung.go.id
- display.kiansantang.bapas-bandung.go.id
- petugas.kiansantang.bapas-bandung.go.id
```

### 2. VPS/Server
```
Spesifikasi Minimum:
- CPU: 2 Core
- RAM: 4 GB
- Storage: 50 GB SSD
- OS: Ubuntu 22.04 LTS
- Bandwidth: Unlimited

Provider:
- DigitalOcean ($20/bulan)
- AWS Lightsail ($20/bulan)
- Google Cloud ($20/bulan)
- Alibaba Cloud ($15/bulan)
- Atau VPS lokal Indonesia
```

### 3. SSL Certificate
```
Gratis dari Let's Encrypt
Otomatis renewal setiap 90 hari
```

---

## 🚀 Langkah Deploy

### PART 1: Setup VPS (30 menit)

#### Step 1: Beli VPS
```
1. Pilih provider (contoh: DigitalOcean)
2. Create Droplet:
   - OS: Ubuntu 22.04 LTS
   - Plan: Basic ($20/bulan)
   - RAM: 4GB
   - Storage: 80GB SSD
   - Region: Singapore (terdekat dengan Indonesia)
3. Add SSH Key (optional)
4. Create Droplet
5. Catat IP Address: 123.45.67.89
```

#### Step 2: Connect ke VPS
```bash
# Windows: Download PuTTY
# https://www.putty.org/

# Atau gunakan PowerShell
ssh root@123.45.67.89

# Masukkan password yang dikirim via email
```

#### Step 3: Update System
```bash
# Update package list
sudo apt update

# Upgrade packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git build-essential
```

#### Step 4: Install Node.js
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # v18.x.x
npm --version   # 9.x.x
```

#### Step 5: Install PM2 (Process Manager)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

#### Step 6: Install Nginx (Web Server)
```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx

# Test: Buka browser → http://123.45.67.89
# Jika muncul "Welcome to nginx", instalasi berhasil
```

---

### PART 2: Setup Domain (15 menit)

#### Step 1: Konfigurasi DNS
```
Login ke DNS Management (contoh: Cloudflare, cPanel, atau DNS provider)

Tambahkan A Records:
┌─────────────────────────────────────────────────────────┐
│ Type │ Name        │ Value          │ TTL  │ Proxy │
├──────┼─────────────┼────────────────┼──────┼───────┤
│ A    │ api         │ 123.45.67.89   │ Auto │ No    │
│ A    │ registrasi  │ 123.45.67.89   │ Auto │ No    │
│ A    │ operator    │ 123.45.67.89   │ Auto │ No    │
│ A    │ display     │ 123.45.67.89   │ Auto │ No    │
│ A    │ petugas     │ 123.45.67.89   │ Auto │ No    │
└─────────────────────────────────────────────────────────┘

Save changes
```

#### Step 2: Tunggu DNS Propagation
```
Waktu: 5-60 menit (biasanya 5-10 menit)

Test DNS:
CMD → nslookup api.kiansantang.bapas-bandung.go.id

Jika muncul IP address, DNS sudah aktif
```

---

### PART 3: Upload Project ke VPS (20 menit)

#### Step 1: Create Directory
```bash
# SSH ke VPS
ssh root@123.45.67.89

# Create directory
mkdir -p /var/www/kiansantang
cd /var/www/kiansantang
```

#### Step 2: Upload Files

**Option A: Via SCP (dari PC lokal)**
```powershell
# Windows PowerShell
scp -r D:\kiansantang\bapas-bandung root@123.45.67.89:/var/www/kiansantang/
```

**Option B: Via Git**
```bash
# Di VPS
cd /var/www/kiansantang
git clone https://github.com/your-repo/bapas-bandung.git
cd bapas-bandung
```

**Option C: Via FTP (FileZilla)**
```
1. Download FileZilla
2. Connect:
   - Host: sftp://123.45.67.89
   - Username: root
   - Password: your-password
3. Upload folder bapas-bandung ke /var/www/kiansantang/
```

#### Step 3: Install Dependencies
```bash
# Backend
cd /var/www/kiansantang/bapas-bandung/backend
npm install --production

# Registration App
cd /var/www/kiansantang/bapas-bandung/registration-app
npm install
npm run build

# Operator App
cd /var/www/kiansantang/bapas-bandung/operator-app
npm install
npm run build

# Display App
cd /var/www/kiansantang/bapas-bandung/display-app
npm install
npm run build

# Petugas App
cd /var/www/kiansantang/bapas-bandung/petugas-app
npm install
npm run build
```

---

### PART 4: Konfigurasi Backend (10 menit)

#### Step 1: Update Backend Config
```bash
# Edit server.js
cd /var/www/kiansantang/bapas-bandung/backend
nano server.js
```

```javascript
// Update CORS configuration
const cors = require('cors');

app.use(cors({
  origin: [
    'https://registrasi.kiansantang.bapas-bandung.go.id',
    'https://operator.kiansantang.bapas-bandung.go.id',
    'https://display.kiansantang.bapas-bandung.go.id',
    'https://petugas.kiansantang.bapas-bandung.go.id'
  ],
  credentials: true
}));

// Port configuration
const PORT = process.env.PORT || 3000;
```

Save: Ctrl+X → Y → Enter

#### Step 2: Create .env File
```bash
nano .env
```

```env
NODE_ENV=production
PORT=3000
DATABASE_PATH=./bapas.db
JWT_SECRET=your-super-secret-key-change-this-in-production
```

Save: Ctrl+X → Y → Enter

#### Step 3: Start Backend with PM2
```bash
cd /var/www/kiansantang/bapas-bandung/backend

# Start backend
pm2 start server.js --name kiansantang-backend

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup

# Check status
pm2 status
pm2 logs kiansantang-backend
```

---

### PART 5: Konfigurasi Frontend (15 menit)

#### Step 1: Update API URL di Semua Frontend

**Registration App:**
```bash
cd /var/www/kiansantang/bapas-bandung/registration-app
nano src/config.js
```

```javascript
export const API_URL = 'https://api.kiansantang.bapas-bandung.go.id/api'
export const SOCKET_URL = 'https://api.kiansantang.bapas-bandung.go.id'
```

**Operator App:**
```bash
cd /var/www/kiansantang/bapas-bandung/operator-app
nano src/config.js
```

```javascript
export const API_URL = 'https://api.kiansantang.bapas-bandung.go.id/api'
export const SOCKET_URL = 'https://api.kiansantang.bapas-bandung.go.id'
```

**Display App:**
```bash
cd /var/www/kiansantang/bapas-bandung/display-app
nano src/config.js
```

```javascript
export const API_URL = 'https://api.kiansantang.bapas-bandung.go.id/api'
export const SOCKET_URL = 'https://api.kiansantang.bapas-bandung.go.id'
```

**Petugas App:**
```bash
cd /var/www/kiansantang/bapas-bandung/petugas-app
nano src/config.js
```

```javascript
export const API_URL = 'https://api.kiansantang.bapas-bandung.go.id/api'
export const SOCKET_URL = 'https://api.kiansantang.bapas-bandung.go.id'
```

#### Step 2: Rebuild Semua Frontend
```bash
# Registration
cd /var/www/kiansantang/bapas-bandung/registration-app
npm run build

# Operator
cd /var/www/kiansantang/bapas-bandung/operator-app
npm run build

# Display
cd /var/www/kiansantang/bapas-bandung/display-app
npm run build

# Petugas
cd /var/www/kiansantang/bapas-bandung/petugas-app
npm run build
```

---

### PART 6: Konfigurasi Nginx (20 menit)

#### Step 1: Create Nginx Config untuk Backend
```bash
sudo nano /etc/nginx/sites-available/api.kiansantang
```

```nginx
server {
    listen 80;
    server_name api.kiansantang.bapas-bandung.go.id;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Step 2: Create Nginx Config untuk Registration
```bash
sudo nano /etc/nginx/sites-available/registrasi.kiansantang
```

```nginx
server {
    listen 80;
    server_name registrasi.kiansantang.bapas-bandung.go.id;

    root /var/www/kiansantang/bapas-bandung/registration-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Step 3: Create Nginx Config untuk Operator
```bash
sudo nano /etc/nginx/sites-available/operator.kiansantang
```

```nginx
server {
    listen 80;
    server_name operator.kiansantang.bapas-bandung.go.id;

    root /var/www/kiansantang/bapas-bandung/operator-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Step 4: Create Nginx Config untuk Display
```bash
sudo nano /etc/nginx/sites-available/display.kiansantang
```

```nginx
server {
    listen 80;
    server_name display.kiansantang.bapas-bandung.go.id;

    root /var/www/kiansantang/bapas-bandung/display-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Step 5: Create Nginx Config untuk Petugas
```bash
sudo nano /etc/nginx/sites-available/petugas.kiansantang
```

```nginx
server {
    listen 80;
    server_name petugas.kiansantang.bapas-bandung.go.id;

    root /var/www/kiansantang/bapas-bandung/petugas-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Step 6: Enable Sites
```bash
# Enable all sites
sudo ln -s /etc/nginx/sites-available/api.kiansantang /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/registrasi.kiansantang /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/operator.kiansantang /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/display.kiansantang /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/petugas.kiansantang /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

### PART 7: Install SSL Certificate (15 menit)

#### Step 1: Install Certbot
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

#### Step 2: Generate SSL Certificates
```bash
# API
sudo certbot --nginx -d api.kiansantang.bapas-bandung.go.id

# Registration
sudo certbot --nginx -d registrasi.kiansantang.bapas-bandung.go.id

# Operator
sudo certbot --nginx -d operator.kiansantang.bapas-bandung.go.id

# Display
sudo certbot --nginx -d display.kiansantang.bapas-bandung.go.id

# Petugas
sudo certbot --nginx -d petugas.kiansantang.bapas-bandung.go.id

# Ikuti prompt:
# - Email: admin@bapas-bandung.go.id
# - Agree to terms: Yes
# - Share email: No (optional)
# - Redirect HTTP to HTTPS: Yes (2)
```

#### Step 3: Test Auto-Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Jika berhasil, SSL akan auto-renew setiap 90 hari
```

---

### PART 8: Setup Firewall (5 menit)

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Check status
sudo ufw status

# Output:
# Status: active
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW       Anywhere
# 80/tcp                     ALLOW       Anywhere
# 443/tcp                    ALLOW       Anywhere
```

---

### PART 9: Test Aplikasi (10 menit)

#### Test Backend:
```bash
curl https://api.kiansantang.bapas-bandung.go.id/api/health
# Output: {"status":"ok"}
```

#### Test Frontend:
```
1. Buka browser
2. Test semua URL:
   - https://registrasi.kiansantang.bapas-bandung.go.id
   - https://operator.kiansantang.bapas-bandung.go.id
   - https://display.kiansantang.bapas-bandung.go.id
   - https://petugas.kiansantang.bapas-bandung.go.id

3. Test login:
   - operator / operator123
   - petugas / petugas123

4. Test buat antrian di registrasi

5. ✅ Jika semua works, deploy berhasil!
```

---

## 🔧 Maintenance & Monitoring

### Check Backend Logs:
```bash
pm2 logs kiansantang-backend
pm2 monit
```

### Restart Backend:
```bash
pm2 restart kiansantang-backend
```

### Update Aplikasi:
```bash
# Pull latest code
cd /var/www/kiansantang/bapas-bandung
git pull

# Rebuild frontend
cd registration-app && npm run build
cd ../operator-app && npm run build
cd ../display-app && npm run build
cd ../petugas-app && npm run build

# Restart backend
pm2 restart kiansantang-backend

# Reload Nginx
sudo systemctl reload nginx
```

### Backup Database:
```bash
# Create backup
cp /var/www/kiansantang/bapas-bandung/backend/bapas.db \
   /var/www/kiansantang/backups/bapas-$(date +%Y%m%d).db

# Auto backup (crontab)
crontab -e

# Add line:
0 2 * * * cp /var/www/kiansantang/bapas-bandung/backend/bapas.db /var/www/kiansantang/backups/bapas-$(date +\%Y\%m\%d).db
```

---

## 📊 Monitoring Tools

### Install htop (Resource Monitor):
```bash
sudo apt install htop
htop
```

### Install Nginx Status:
```bash
# Add to nginx config
sudo nano /etc/nginx/sites-available/default

# Add:
location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    deny all;
}

# Test:
curl http://localhost/nginx_status
```

---

## 🔒 Security Best Practices

### 1. Change Default Passwords:
```bash
# Update di database atau config
# Ganti semua password default
```

### 2. Disable Root Login:
```bash
sudo nano /etc/ssh/sshd_config

# Change:
PermitRootLogin no

# Restart SSH:
sudo systemctl restart sshd
```

### 3. Install Fail2Ban:
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. Regular Updates:
```bash
# Auto update security patches
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

## ✅ Checklist Deploy

### Pre-Deploy:
- [ ] VPS ready (4GB RAM, Ubuntu 22.04)
- [ ] Domain configured (DNS A records)
- [ ] Project files ready

### Installation:
- [ ] Node.js installed
- [ ] PM2 installed
- [ ] Nginx installed
- [ ] Project uploaded
- [ ] Dependencies installed

### Configuration:
- [ ] Backend config updated
- [ ] Frontend config updated
- [ ] Nginx config created
- [ ] SSL certificates installed
- [ ] Firewall configured

### Testing:
- [ ] Backend API accessible
- [ ] All frontend apps accessible
- [ ] HTTPS working
- [ ] Login working
- [ ] Create queue working
- [ ] Socket.IO working

### Production:
- [ ] PM2 auto-start enabled
- [ ] Backup script configured
- [ ] Monitoring setup
- [ ] Security hardened
- [ ] **LIVE!** 🎉

---

## 🎉 Selesai!

**Aplikasi KIANSANTANG sudah online!**

**URL Akses**:
- Registration: https://registrasi.kiansantang.bapas-bandung.go.id
- Operator: https://operator.kiansantang.bapas-bandung.go.id
- Display: https://display.kiansantang.bapas-bandung.go.id
- Petugas: https://petugas.kiansantang.bapas-bandung.go.id
- API: https://api.kiansantang.bapas-bandung.go.id

**Total Waktu Deploy**: 2-3 jam
**Biaya VPS**: ~$20/bulan
**SSL**: Gratis (Let's Encrypt)

**Sistem siap digunakan secara online!** 🚀🌐
