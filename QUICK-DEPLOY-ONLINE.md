# ⚡ Quick Deploy Online - KIANSANTANG

## 🚀 Deploy Cepat (2 Jam)

### 1️⃣ Setup VPS (30 menit)
```bash
# SSH ke VPS
ssh root@YOUR_VPS_IP

# Update & Install
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2

# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### 2️⃣ Upload Project (20 menit)
```bash
# Create directory
mkdir -p /var/www/kiansantang
cd /var/www/kiansantang

# Upload via SCP (dari PC lokal)
scp -r D:\kiansantang\bapas-bandung root@YOUR_VPS_IP:/var/www/kiansantang/

# Install dependencies
cd /var/www/kiansantang/bapas-bandung/backend
npm install --production

cd ../registration-app && npm install && npm run build
cd ../operator-app && npm install && npm run build
cd ../display-app && npm install && npm run build
cd ../petugas-app && npm install && npm run build
```

### 3️⃣ Start Backend (5 menit)
```bash
cd /var/www/kiansantang/bapas-bandung/backend
pm2 start server.js --name kiansantang-backend
pm2 save
pm2 startup
```

### 4️⃣ Configure Nginx (30 menit)
```bash
# Create configs (5 files)
sudo nano /etc/nginx/sites-available/api.kiansantang
sudo nano /etc/nginx/sites-available/registrasi.kiansantang
sudo nano /etc/nginx/sites-available/operator.kiansantang
sudo nano /etc/nginx/sites-available/display.kiansantang
sudo nano /etc/nginx/sites-available/petugas.kiansantang

# Enable sites
sudo ln -s /etc/nginx/sites-available/*.kiansantang /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5️⃣ Install SSL (15 menit)
```bash
sudo certbot --nginx -d api.kiansantang.bapas-bandung.go.id
sudo certbot --nginx -d registrasi.kiansantang.bapas-bandung.go.id
sudo certbot --nginx -d operator.kiansantang.bapas-bandung.go.id
sudo certbot --nginx -d display.kiansantang.bapas-bandung.go.id
sudo certbot --nginx -d petugas.kiansantang.bapas-bandung.go.id
```

### 6️⃣ Setup Firewall (5 menit)
```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 7️⃣ Test! (5 menit)
```
https://registrasi.kiansantang.bapas-bandung.go.id
https://operator.kiansantang.bapas-bandung.go.id
https://display.kiansantang.bapas-bandung.go.id
https://petugas.kiansantang.bapas-bandung.go.id
```

---

## 📝 Nginx Config Templates

### API (Backend):
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
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend (Registration/Operator/Display/Petugas):
```nginx
server {
    listen 80;
    server_name registrasi.kiansantang.bapas-bandung.go.id;
    
    root /var/www/kiansantang/bapas-bandung/registration-app/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔧 Common Commands

### PM2:
```bash
pm2 status                    # Check status
pm2 logs kiansantang-backend  # View logs
pm2 restart kiansantang-backend  # Restart
pm2 stop kiansantang-backend  # Stop
```

### Nginx:
```bash
sudo nginx -t                 # Test config
sudo systemctl reload nginx   # Reload
sudo systemctl restart nginx  # Restart
```

### SSL:
```bash
sudo certbot renew            # Renew certificates
sudo certbot certificates     # List certificates
```

---

## ✅ Checklist

- [ ] VPS ready (4GB RAM)
- [ ] Domain DNS configured
- [ ] Node.js & Nginx installed
- [ ] Project uploaded
- [ ] Backend running (PM2)
- [ ] Nginx configured
- [ ] SSL installed
- [ ] Firewall enabled
- [ ] **LIVE!** 🎉

---

## 📖 Full Documentation

Baca: `DEPLOY-ONLINE-DOMAIN.md`

**Deploy selesai dalam 2 jam!** ⚡🌐
