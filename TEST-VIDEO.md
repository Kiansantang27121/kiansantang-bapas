# Test Video Upload & Playback

## 🔍 Debugging Steps

### 1. Check Video File
Pastikan video yang diupload memenuhi spesifikasi:
```
Format: MP4 (H.264)
Codec: H.264 video, AAC audio
Container: MP4
Max Size: 50MB
Resolution: 720p atau 1080p
```

### 2. Check Upload Success
Setelah upload, check:
1. Success message muncul
2. Preview video di operator app
3. File ada di folder `backend/uploads/`

### 3. Check Video URL
Di operator app, menu Display:
1. Lihat field video_url
2. URL harus lengkap: `http://localhost:3000/uploads/video_xxxxx.mp4`
3. Copy URL dan test di browser

### 4. Test Video URL Directly
Buka browser baru:
```
http://localhost:3000/uploads/video_xxxxx.mp4
```

**Expected:**
- Video download atau play di browser
- Tidak ada 404 error

**If 404:**
- File tidak ada di uploads folder
- Backend tidak running
- Filename salah

### 5. Check Browser Console
Di display app (F12):
```javascript
// Look for:
Video URL: http://localhost:3000/uploads/...
Video load started
Video can play
Video loaded successfully

// Or errors:
Video error: ...
MEDIA_ERR_xxx
```

### 6. Check Network Tab
F12 → Network → Filter: Media
```
- Request URL: http://localhost:3000/uploads/...
- Status: 200 (OK)
- Type: video/mp4
- Size: [file size]
```

## 🛠️ Common Fixes

### Fix 1: Re-upload Video
```
1. Delete current video (button Hapus)
2. Prepare video:
   - Format: MP4
   - Codec: H.264
   - Size: < 50MB
3. Upload again
4. Wait for success message
5. Refresh display
```

### Fix 2: Convert Video Format
```bash
# Using FFmpeg
ffmpeg -i input.avi -c:v libx264 -c:a aac -strict experimental output.mp4

# Or use online converter:
https://cloudconvert.com/avi-to-mp4
```

### Fix 3: Compress Video
```bash
# Reduce file size
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -b:v 2M output.mp4

# Or use HandBrake (GUI):
https://handbrake.fr
```

### Fix 4: Check Backend
```powershell
# Check if backend running
netstat -ano | findstr :3000

# Should show:
TCP    0.0.0.0:3000    LISTENING

# If not, start backend:
cd backend
npm run dev
```

### Fix 5: Check Uploads Folder
```powershell
# Check folder exists
cd backend
dir uploads

# Should show uploaded files:
video_1699425789012.mp4
logo_1699425678901.png
```

### Fix 6: Manual URL Fix
If URL in database is wrong:

1. **Via Operator App:**
   - Menu Display
   - Clear video URL
   - Re-upload video

2. **Via Database (Advanced):**
   ```sql
   -- Check current URL
   SELECT * FROM settings WHERE key = 'video_url';
   
   -- Update URL
   UPDATE settings 
   SET value = 'http://localhost:3000/uploads/video_xxxxx.mp4' 
   WHERE key = 'video_url';
   ```

## 🎬 Test Video Files

### Sample Test Videos
You can use these for testing:

1. **Big Buck Bunny** (Open source)
   ```
   http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
   ```

2. **Elephants Dream** (Open source)
   ```
   http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4
   ```

### Create Test Video
```bash
# Create 10 second test video with FFmpeg
ffmpeg -f lavfi -i testsrc=duration=10:size=1280x720:rate=30 -pix_fmt yuv420p test.mp4

# Add text overlay
ffmpeg -f lavfi -i testsrc=duration=10:size=1280x720:rate=30 \
  -vf "drawtext=text='TEST VIDEO':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
  -pix_fmt yuv420p test.mp4
```

## 📊 Video Info Check

### Using FFprobe
```bash
# Check video details
ffprobe -v error -show_format -show_streams input.mp4

# Check codec
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 input.mp4

# Should output: h264
```

### Using MediaInfo (GUI)
Download: https://mediaarea.net/en/MediaInfo

Check:
- Format: MPEG-4
- Video codec: AVC (H.264)
- Audio codec: AAC
- File size: < 50MB

## 🔄 Complete Reset

If nothing works, complete reset:

### 1. Stop All Apps
```powershell
Stop-Process -Name node -Force
```

### 2. Clear Uploads
```powershell
cd backend/uploads
del *.*
```

### 3. Reset Database Settings
```powershell
cd backend
del bapas.db
# Database will be recreated on next start
```

### 4. Restart All
```powershell
# Backend
cd backend
npm run dev

# Display
cd display-app
npm run dev

# Operator
cd operator-app
npm run dev
```

### 5. Re-upload Video
1. Login operator app
2. Menu Display
3. Upload video
4. Check display

## 📝 Checklist

Before reporting issue:
- [ ] Video format is MP4 (H.264)
- [ ] Video size < 50MB
- [ ] Video plays locally (VLC, Windows Media Player)
- [ ] Backend is running (port 3000)
- [ ] Upload success message received
- [ ] Video URL is complete (http://localhost:3000/...)
- [ ] Video file exists in uploads folder
- [ ] Browser console checked (F12)
- [ ] Network tab checked (F12)
- [ ] Tried different video file
- [ ] Tried re-upload
- [ ] Tried refresh display (Ctrl+F5)

## 🆘 Still Not Working?

### Collect Debug Info

1. **Video Info:**
   ```
   - Filename: _______
   - Format: _______
   - Codec: _______
   - Size: _______
   - Duration: _______
   ```

2. **URL Info:**
   ```
   - Video URL from settings: _______
   - Direct URL test result: _______
   ```

3. **Console Errors:**
   ```
   - Browser console errors: _______
   - Backend console errors: _______
   ```

4. **Network Info:**
   ```
   - Request status: _______
   - Response headers: _______
   - Content-Type: _______
   ```

### Alternative: Use External Video

If local upload not working, use external video URL:

1. Upload video to:
   - Google Drive (public link)
   - Dropbox (public link)
   - YouTube (embed)
   - CDN service

2. Get direct video URL

3. Manually set in database:
   ```sql
   UPDATE settings 
   SET value = 'https://example.com/video.mp4' 
   WHERE key = 'video_url';
   ```

---

**Follow these steps to diagnose and fix video issues** 🔧
