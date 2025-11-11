# Video Troubleshooting - BAPAS Bandung Display

## ✅ Perbaikan Video Playback

Video yang diupload sekarang sudah dapat diputar dengan baik di display.

## 🔧 Perbaikan yang Dilakukan

### 1. **Video Element Attributes**
```jsx
<video
  src={src}
  autoPlay        // Auto play saat load
  loop            // Loop terus menerus
  muted           // Muted untuk allow autoplay
  playsInline     // Play inline di mobile
  preload="auto"  // Preload video
>
```

**Penjelasan:**
- `autoPlay`: Video otomatis play saat loaded
- `loop`: Video diulang terus menerus
- `muted`: Required untuk autoplay di browser modern
- `playsInline`: Prevent fullscreen di mobile
- `preload="auto"`: Load video sebelum play

### 2. **Multiple Source Tags**
```jsx
<source src={src} type="video/mp4" />
<source src={src} type="video/webm" />
<source src={src} type="video/ogg" />
```

**Penjelasan:**
- Browser akan pilih format yang didukung
- Fallback ke format lain jika tidak support
- Compatibility lebih baik

### 3. **Proper MIME Types (Backend)**
```javascript
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    if (path.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
    } else if (path.endsWith('.webm')) {
      res.setHeader('Content-Type', 'video/webm');
    } else if (path.endsWith('.ogg')) {
      res.setHeader('Content-Type', 'video/ogg');
    }
  }
}));
```

**Penjelasan:**
- Server mengirim MIME type yang benar
- Browser dapat recognize video format
- Prevent download instead of play

### 4. **VideoPlayer Component**
```jsx
// Custom component dengan:
- useRef untuk video element
- useEffect untuk lifecycle management
- Error handling
- Loading state
- Auto-play trigger
```

**Features:**
- ✅ Loading indicator saat video load
- ✅ Error message jika gagal load
- ✅ Auto-play dengan error handling
- ✅ Force load video
- ✅ Event listeners untuk monitoring

## 🎬 Supported Video Formats

### Recommended
- **MP4 (H.264)** - Best compatibility
  - Codec: H.264
  - Container: MP4
  - Browser support: 99%+

### Alternative
- **WebM (VP8/VP9)** - Good for web
  - Codec: VP8 or VP9
  - Container: WebM
  - Browser support: 90%+

- **OGG (Theora)** - Open source
  - Codec: Theora
  - Container: OGG
  - Browser support: 70%+

## 📊 Video Specifications

### Optimal Settings
```
Format: MP4 (H.264)
Resolution: 1280x720 (HD) or 1920x1080 (Full HD)
Frame Rate: 30 fps
Bitrate: 2-5 Mbps
Audio: AAC, 128 kbps (optional, akan di-mute)
Duration: 30 seconds - 5 minutes
File Size: < 50MB
```

### Encoding Settings (FFmpeg)
```bash
# Optimal web video
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -preset slow \
  -crf 22 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  output.mp4

# Compress large video
ffmpeg -i input.mp4 \
  -vf scale=1280:720 \
  -c:v libx264 \
  -b:v 2M \
  -c:a aac \
  -b:a 128k \
  output.mp4
```

## 🐛 Common Issues & Solutions

### Issue 1: Video Uploaded but Not Playing

**Symptoms:**
- Video uploaded successfully
- Display shows loading or black screen
- No error message

**Solutions:**

1. **Check Video Format**
   ```
   - Use MP4 with H.264 codec
   - Convert video if needed
   - Test with small sample first
   ```

2. **Check File Size**
   ```
   - Max 50MB
   - Compress if larger
   - Use online tools or FFmpeg
   ```

3. **Check Browser Console**
   ```
   F12 → Console
   Look for errors:
   - CORS errors
   - Network errors
   - Video codec errors
   ```

4. **Check Network Tab**
   ```
   F12 → Network → Filter: Media
   - Check if video is loading
   - Check response status (should be 200)
   - Check Content-Type header
   ```

### Issue 2: Video Loads but Doesn't Autoplay

**Symptoms:**
- Video visible but paused
- Need manual click to play

**Solutions:**

1. **Browser Autoplay Policy**
   ```
   - Video must be muted for autoplay
   - Already implemented in code
   - Some browsers still block
   ```

2. **User Interaction Required**
   ```
   - Some browsers require user interaction
   - Click anywhere on page first
   - Refresh page
   ```

3. **Browser Settings**
   ```
   Chrome: chrome://settings/content/sound
   - Allow autoplay
   - Add localhost to exceptions
   ```

### Issue 3: Video Stuttering or Buffering

**Symptoms:**
- Video plays but stutters
- Frequent buffering
- Poor quality

**Solutions:**

1. **Reduce File Size**
   ```bash
   # Lower bitrate
   ffmpeg -i input.mp4 -b:v 1M output.mp4
   
   # Lower resolution
   ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4
   ```

2. **Optimize for Streaming**
   ```bash
   # Add faststart flag
   ffmpeg -i input.mp4 -movflags +faststart output.mp4
   ```

3. **Check Network**
   ```
   - Use wired connection
   - Check bandwidth
   - Close other applications
   ```

### Issue 4: Video Not Showing (404 Error)

**Symptoms:**
- 404 error in console
- Video URL not found

**Solutions:**

1. **Check URL**
   ```javascript
   // Should be full URL
   http://localhost:3000/uploads/video_123456.mp4
   
   // Not relative
   /uploads/video_123456.mp4
   ```

2. **Check Backend Running**
   ```
   - Backend must be running on port 3000
   - Check uploads folder exists
   - Check file permissions
   ```

3. **Re-upload Video**
   ```
   - Delete and re-upload
   - Check upload success message
   - Verify file in uploads folder
   ```

### Issue 5: CORS Error

**Symptoms:**
- CORS error in console
- Video blocked by browser

**Solutions:**

1. **Check CORS Settings**
   ```javascript
   // backend/server.js
   app.use(cors()); // Should allow all origins
   ```

2. **Use Same Origin**
   ```
   - Display and backend on same domain
   - Use full URL with localhost
   ```

## 🔍 Debugging Steps

### Step 1: Check Upload
```
1. Upload video via operator app
2. Check success message
3. Note the filename
4. Check backend/uploads folder
5. Verify file exists
```

### Step 2: Check Settings
```
1. Open operator app
2. Menu Display
3. Check video_url value
4. Should be full URL: http://localhost:3000/uploads/...
```

### Step 3: Check Display
```
1. Open display app (localhost:5175)
2. Open browser console (F12)
3. Check for errors
4. Check Network tab for video request
```

### Step 4: Manual Test
```
1. Copy video URL from settings
2. Open in new browser tab
3. Should download or play
4. If 404, file not found
5. If plays, issue is in display component
```

## 🎯 Best Practices

### Video Preparation
1. **Convert to MP4 H.264**
   - Use HandBrake or FFmpeg
   - Preset: Web optimized
   - Quality: Medium-High

2. **Optimize File Size**
   - Target: 5-20MB
   - Resolution: 720p or 1080p
   - Bitrate: 2-3 Mbps

3. **Test Before Upload**
   - Play locally
   - Check format
   - Verify quality

### Upload Process
1. **Use Operator App**
   - Login as admin
   - Menu Display
   - Upload video section

2. **Wait for Completion**
   - Don't close browser
   - Wait for success message
   - Verify preview

3. **Test on Display**
   - Open display app
   - Check video plays
   - Verify loop works

### Maintenance
1. **Regular Checks**
   - Test video weekly
   - Check file integrity
   - Monitor performance

2. **Backup Videos**
   - Keep original files
   - Store in safe location
   - Document video details

3. **Update as Needed**
   - Refresh content regularly
   - Update for events
   - Maintain quality

## 🛠️ Tools & Resources

### Video Conversion
- **HandBrake**: https://handbrake.fr (Free, GUI)
- **FFmpeg**: https://ffmpeg.org (Free, CLI)
- **Online Converter**: https://cloudconvert.com

### Video Compression
- **Clideo**: https://clideo.com/compress-video
- **YouCompress**: https://www.youcompress.com
- **FreeConvert**: https://www.freeconvert.com/video-compressor

### Video Testing
- **Can I Use**: https://caniuse.com (Check browser support)
- **Video Test**: Play in VLC or browser first

## 📝 Checklist

Before uploading video:
- [ ] Format: MP4 (H.264)
- [ ] Size: < 50MB
- [ ] Resolution: 720p or 1080p
- [ ] Duration: < 5 minutes
- [ ] Tested locally
- [ ] Optimized for web

After uploading:
- [ ] Success message received
- [ ] Preview shows in operator app
- [ ] Video plays in display app
- [ ] Loop works correctly
- [ ] No console errors
- [ ] Performance is good

## 🆘 Still Having Issues?

### Check Logs
1. **Browser Console** (F12)
   - Look for red errors
   - Note error messages
   - Check network requests

2. **Backend Console**
   - Check terminal running backend
   - Look for upload errors
   - Check file permissions

3. **Video Info**
   - Use MediaInfo or FFprobe
   - Check codec details
   - Verify format

### Contact Support
Provide:
- Video format and codec
- File size
- Error messages
- Browser and version
- Steps to reproduce

---

**Video playback sudah diperbaiki dan siap digunakan!** 🎬

Upload video format MP4 (H.264) untuk hasil terbaik.
