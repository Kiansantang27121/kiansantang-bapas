# 🔐 KIANSANTANG - Panel Pengaturan Administrator

## 📖 Overview

**Panel Pengaturan Administrator** adalah aplikasi khusus yang hanya dapat diakses oleh Administrator untuk mengelola seluruh sistem KIANSANTANG.

### 🎯 Perubahan dari Operator App

**Sebelumnya:** Operator App (Multi-role: Admin, Operator, PK, Petugas)

**Sekarang:** Panel Pengaturan Administrator (Admin Only)

## 🔐 Akses & Keamanan

### Admin Only Access
- ✅ Hanya Administrator yang dapat login
- ✅ Role check di login page
- ✅ Route protection dengan middleware
- ✅ Error page untuk non-admin users

### Login Credentials
```
Username: admin
Password: admin123
URL: http://localhost:5174
```

### Security Features
- JWT authentication
- Role-based access control
- Protected routes
- Session management
- Auto logout on inactivity

## 🎨 Desain Baru

### Modern & Canggih
- ✅ Gradient purple & indigo theme
- ✅ Glass morphism effects
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Modern UI components

### Color Scheme
- **Primary:** Purple (#7c3aed)
- **Secondary:** Indigo (#4f46e5)
- **Accent:** White with transparency
- **Background:** Gradient gray

### UI Components
- **Navbar:** Gradient purple dengan glass effect
- **Sidebar:** White dengan purple accents
- **Cards:** Gradient backgrounds dengan shadows
- **Buttons:** Gradient dengan hover effects
- **Icons:** Lucide React icons

## 📊 Home Dashboard

### Header Section
- Welcome message dengan nama admin
- KIANSANTANG branding
- Admin access badge
- Gradient purple background

### Quick Stats (4 Cards)
1. **Total Antrian Hari Ini**
   - Icon: Users
   - Color: Blue gradient
   - Trend indicator

2. **Antrian Aktif**
   - Icon: Activity
   - Color: Purple gradient
   - Real-time count

3. **Selesai Hari Ini**
   - Icon: CheckCircle
   - Color: Green gradient
   - Completion rate

4. **Rata-rata Waktu**
   - Icon: Clock
   - Color: Orange gradient
   - Performance metric

### System Metrics
- Total Users: 70
- Active Services: 12
- Database Size: 2.4 MB
- API Uptime: 99.9%

### Chart Section
- 7-day queue trend
- Bar chart visualization
- Interactive hover effects
- Purple gradient bars

### Recent Activities
- Real-time activity feed
- User actions tracking
- Timestamp display
- Color-coded icons

### Quick Actions (4 Buttons)
1. **Kelola Pengguna** → /users
2. **Kelola Layanan** → /services
3. **Pengaturan Sistem** → /settings
4. **Lihat Laporan** → /reports

### System Status
- Backend API: Online
- Database: Connected
- Real-time Updates: Active

## 📱 Menu & Features

### Dashboard (/)
- Admin home dashboard
- Statistics & metrics
- Quick actions
- System status

### Antrian (/queue)
- Queue management
- Call queue
- Monitor status
- Real-time updates

### Layanan (/services)
- Service CRUD
- Enable/disable services
- Set estimation time
- Service categories

### Pengguna (/users)
- User management
- Create/edit/delete users
- Role assignment
- Password reset

### Management PK (/pk)
- PK accounts (63)
- PK data management
- Google Sheets sync
- Statistics

### Management Klien (/clients)
- Client database
- Client per PK
- Import/export
- Search & filter

### Display (/display)
- Display settings
- Running text
- Video configuration
- Layout options

### Theme (/theme)
- Color customization
- Logo upload
- Branding settings
- Preview mode

### Pengaturan (/settings)
- System settings
- Office information
- Operating hours
- General config

## 🚀 Getting Started

### 1. Start Application
```bash
cd operator-app
npm run dev
```

### 2. Access URL
```
http://localhost:5174
```

### 3. Login as Admin
```
Username: admin
Password: admin123
```

### 4. Explore Dashboard
- View statistics
- Check system status
- Use quick actions
- Navigate menu

## 🔒 Access Control

### Login Page
- Admin only notice
- Role check on submit
- Error message for non-admin
- Modern gradient design

### Route Protection
```javascript
<PrivateRoute adminOnly={true}>
  <Layout />
</PrivateRoute>
```

### Access Denied Page
- Shown to non-admin users
- Clear error message
- Return to home button
- Modern design

## 🎯 Key Features

### 1. Admin Dashboard
- ✅ Modern & canggih design
- ✅ Real-time statistics
- ✅ Quick actions
- ✅ System monitoring

### 2. User Management
- ✅ CRUD operations
- ✅ Role assignment
- ✅ Password management
- ✅ User statistics

### 3. Service Management
- ✅ Service CRUD
- ✅ Enable/disable
- ✅ Time estimation
- ✅ Categories

### 4. System Settings
- ✅ Office info
- ✅ Operating hours
- ✅ Display config
- ✅ Theme settings

### 5. PK & Client Management
- ✅ 63 PK accounts
- ✅ Client database
- ✅ Google Sheets sync
- ✅ Statistics & reports

## 📊 Statistics & Monitoring

### Real-time Stats
- Total queues today
- Active queues
- Completed queues
- Average waiting time

### System Health
- API status
- Database connection
- Real-time updates
- Uptime monitoring

### Performance Metrics
- Response times
- Success rates
- Error rates
- User activity

## 🎨 UI/UX Improvements

### Before vs After

**Before (Operator App):**
- Blue theme
- Multi-role access
- Standard dashboard
- Basic design

**After (Admin Panel):**
- Purple/Indigo theme
- Admin only access
- Modern dashboard
- Advanced design

### Design Elements
- ✅ Gradient backgrounds
- ✅ Glass morphism
- ✅ Smooth animations
- ✅ Hover effects
- ✅ Shadow depth
- ✅ Rounded corners
- ✅ Icon integration

## 🛠️ Technical Details

### Framework
- React 18
- Vite
- TailwindCSS
- Lucide Icons

### State Management
- React Context (Auth)
- Local state
- Real-time updates

### Routing
- React Router v6
- Protected routes
- Role-based access

### API Integration
- Axios
- JWT authentication
- Socket.IO for real-time

## 📝 Usage Guidelines

### For Administrators

#### Daily Tasks
1. Check dashboard statistics
2. Monitor system health
3. Review recent activities
4. Manage users if needed

#### Weekly Tasks
1. Review queue performance
2. Update services if needed
3. Check system logs
4. Backup database

#### Monthly Tasks
1. Generate reports
2. Review user accounts
3. Update system settings
4. Plan improvements

### Best Practices
- ✅ Regular monitoring
- ✅ Timely updates
- ✅ Security checks
- ✅ Data backups
- ✅ User training

## 🔧 Troubleshooting

### Cannot Login
**Problem:** Login fails with admin credentials

**Solution:**
1. Check username: `admin` (lowercase)
2. Check password: `admin123`
3. Clear browser cache
4. Check backend is running

### Access Denied
**Problem:** "Akses Ditolak" message

**Solution:**
1. Only admin can access
2. Login with admin account
3. Check user role in database
4. Contact system administrator

### Dashboard Not Loading
**Problem:** Dashboard shows loading forever

**Solution:**
1. Check backend API is running
2. Check network connection
3. Clear browser cache
4. Refresh page (Ctrl + F5)

## 📚 Related Documentation

- `README.md` - System overview
- `KIANSANTANG-GUIDE.md` - Complete guide
- `TROUBLESHOOTING.md` - Fix guide
- `STATUS-SYSTEM.md` - System status

## 🎯 Future Enhancements

### Planned Features
- 📋 Advanced analytics
- 📋 Custom reports
- 📋 Email notifications
- 📋 Audit logs
- 📋 Backup automation
- 📋 Multi-language support

### UI Improvements
- 📋 Dark mode toggle
- 📋 Customizable dashboard
- 📋 Widget system
- 📋 More chart types

## 📞 Support

### Contact
- **Email:** bapas.bandung@kemenkumham.go.id
- **Phone:** (022) 4204501

### Office Hours
- **Senin - Jumat:** 08:00 - 16:00 WIB
- **Sabtu - Minggu:** Tutup

---

**KIANSANTANG - Panel Pengaturan Administrator**

**BAPAS Kelas I Bandung**

*Kelola sistem dengan mudah dan efisien* 🔐✨
