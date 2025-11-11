# Responsive Layout - Mobile & Desktop

## 📱 Fitur Auto-Responsive

Display sekarang otomatis menyesuaikan layout berdasarkan orientasi layar:

### Landscape (Desktop/TV) → Layout KPP
```
┌─────────────────────────────────────┐
│ Header (Logo + Jam)                 │
├─────────────────────────────────────┤
│ ┌──────┐  ┌──────────────────────┐ │
│ │Loket │  │                      │ │
│ │  +   │  │       Video          │ │
│ │Nomor │  │                      │ │
│ └──────┘  └──────────────────────┘ │
│ [L1] [L2] [L3] [L4]                │
├─────────────────────────────────────┤
│ ★★★ RUNNING TEXT ★★★                │
└─────────────────────────────────────┘
```

### Portrait (Mobile/Tablet) → Layout Vertical
```
┌─────────────────┐
│ Header          │
│ (Logo + Jam)    │
├─────────────────┤
│ LOKET 1         │
├─────────────────┤
│ NOMOR ANTRIAN   │
├─────────────────┤
│                 │
│   B  002        │
│                 │
├─────────────────┤
│                 │
│     Video       │
│                 │
├─────────────────┤
│ [L1]      [L2]  │
│                 │
│ [L3]      [L4]  │
├─────────────────┤
│ ★★★ TEXT ★★★    │
└─────────────────┘
```

## 🔄 Auto-Detection

### Cara Kerja:
```javascript
// Check orientation
if (window.innerHeight > window.innerWidth) {
  // Portrait → Use AppMobile
} else {
  // Landscape → Use AppKPP
}

// Listen to changes
window.addEventListener('orientationchange', handleResize)
```

### Real-time Switch:
- Rotate device → Layout otomatis berubah
- Resize browser → Layout menyesuaikan
- No reload needed → Seamless transition

## 📐 Layout Specifications

### Desktop/Landscape (AppKPP):
```
Min Width: 1024px
Aspect Ratio: 16:9 atau 16:10
Recommended: 1920x1080 (Full HD)
Layout: Horizontal (2 columns)
- Left: Loket + Nomor (40%)
- Right: Video (60%)
- Bottom: 4 Loket + Running Text
```

### Mobile/Portrait (AppMobile):
```
Max Width: 768px
Aspect Ratio: 9:16 atau 3:4
Recommended: 1080x1920 (Portrait HD)
Layout: Vertical (1 column)
- Top: Header
- Stack: Loket → Nomor → Video
- Grid: 4 Loket (2x2)
- Bottom: Running Text
```

## 🎨 Mobile Layout Features

### Optimized for Portrait:
✅ **Vertical scrolling** - All content accessible
✅ **Larger touch targets** - Easy interaction
✅ **Readable text** - Optimized font sizes
✅ **Compact header** - Logo + info stacked
✅ **Grid layout** - 2x2 for 4 loket
✅ **Smaller video** - 200px height
✅ **Responsive borders** - 2px instead of 4px
✅ **Adjusted spacing** - Tighter margins

### Font Sizes (Mobile):
```
Header Title: text-xl (20px)
Clock: text-2xl (24px)
Loket Label: text-2xl (24px)
Queue Prefix: text-5xl (48px)
Queue Number: text-6xl (60px)
Running Text: text-base (16px)
Loket Preview: text-lg (18px)
```

### Spacing (Mobile):
```
Container Margin: m-2 (8px)
Border Width: border-2 (2px)
Padding: p-2, p-3 (8px, 12px)
Gap: gap-2 (8px)
```

## 📱 Use Cases

### Use Case 1: TV Display (Landscape)
```
Device: Smart TV / Monitor
Resolution: 1920x1080
Orientation: Landscape
Layout: AppKPP (Horizontal)
Features: Full layout, large video
```

### Use Case 2: Tablet Portrait
```
Device: iPad / Android Tablet
Resolution: 1536x2048
Orientation: Portrait
Layout: AppMobile (Vertical)
Features: Scrollable, touch-friendly
```

### Use Case 3: Mobile Phone
```
Device: Smartphone
Resolution: 1080x1920
Orientation: Portrait
Layout: AppMobile (Vertical)
Features: Compact, optimized
```

### Use Case 4: Rotating Display
```
Device: Rotating monitor
Orientation: Auto-switch
Layout: Dynamic (both)
Features: Seamless transition
```

## 🔧 Testing

### Test Orientations:

#### Desktop Browser:
```
1. Open display (localhost:5175)
2. Open DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M)
4. Select device:
   - iPhone 12 Pro (Portrait)
   - iPad Pro (Portrait)
   - Responsive (Custom)
5. Rotate device icon
6. See layout change
```

#### Real Device:
```
1. Open display on mobile
2. View in portrait → Mobile layout
3. Rotate to landscape → Desktop layout
4. Rotate back → Mobile layout
```

### Breakpoint:
```css
Portrait: height > width
Landscape: width >= height
```

## 🎯 Responsive Elements

### Header:
**Desktop:**
- Horizontal layout
- Logo left, info center, clock right
- Large logo (80px)

**Mobile:**
- Vertical stack
- Logo + info centered
- Clock below
- Smaller logo (48px)

### Main Content:
**Desktop:**
- 2 columns (loket + video)
- Side by side
- Large video area

**Mobile:**
- 1 column (stacked)
- Vertical flow
- Smaller video (200px)
- Scrollable

### 4 Loket Preview:
**Desktop:**
- 1 row, 4 columns
- Horizontal grid
- Larger cards

**Mobile:**
- 2 rows, 2 columns
- Square grid
- Compact cards

### Running Text:
**Desktop:**
- Large text (text-2xl)
- More padding

**Mobile:**
- Smaller text (text-base)
- Less padding

## 💡 Best Practices

### For Portrait Display:
1. **Use tablet or phone** - Better than rotated monitor
2. **Mount vertically** - Natural orientation
3. **Touch screen** - Better interaction
4. **Higher resolution** - More content visible
5. **Test scrolling** - Ensure smooth

### For Landscape Display:
1. **Use TV or monitor** - Best experience
2. **Mount horizontally** - Standard orientation
3. **Full HD minimum** - 1920x1080
4. **No scrolling needed** - All visible
5. **Fullscreen mode** - F11

### For Both:
1. **Test orientation** - Before deployment
2. **Check all elements** - Visible and readable
3. **Verify video** - Plays correctly
4. **Test theme** - Colors look good
5. **Check running text** - Smooth animation

## 🔄 Dynamic Switching

### Automatic:
```
- Device rotation → Auto switch
- Window resize → Auto adjust
- No manual intervention
- Seamless transition
- State preserved
```

### Manual Override (Optional):
```javascript
// Force mobile layout
localStorage.setItem('forceLayout', 'mobile')

// Force desktop layout
localStorage.setItem('forceLayout', 'desktop')

// Auto (default)
localStorage.removeItem('forceLayout')
```

## 📊 Comparison

| Feature | Desktop (Landscape) | Mobile (Portrait) |
|---------|-------------------|-------------------|
| **Layout** | Horizontal | Vertical |
| **Columns** | 2 (Loket + Video) | 1 (Stacked) |
| **Video Size** | Large (60% width) | Small (200px) |
| **Loket Grid** | 1x4 | 2x2 |
| **Scrolling** | No | Yes |
| **Font Size** | Large | Medium |
| **Border** | 4px | 2px |
| **Spacing** | Generous | Compact |
| **Best For** | TV, Monitor | Phone, Tablet |

## 🎨 Customization

### Adjust Mobile Breakpoint:

Edit `main.jsx`:
```javascript
// Current: height > width
const isPortrait = window.innerHeight > window.innerWidth

// Custom: specific width
const isPortrait = window.innerWidth < 768

// Custom: aspect ratio
const isPortrait = (window.innerHeight / window.innerWidth) > 1.2
```

### Adjust Mobile Sizes:

Edit `AppMobile.jsx`:
```javascript
// Video height
style={{ height: '200px' }}  // Change to 300px for larger

// Queue number size
className="text-6xl"  // Change to text-7xl for larger

// Loket grid
className="grid-cols-2"  // Change to grid-cols-4 for 1 row
```

## 🐛 Troubleshooting

### Layout Not Switching:
```
1. Check console for errors
2. Refresh page (Ctrl+F5)
3. Clear cache
4. Try different browser
```

### Mobile Layout on Desktop:
```
1. Check window size
2. Maximize browser
3. Exit fullscreen
4. Resize window wider
```

### Desktop Layout on Mobile:
```
1. Rotate device
2. Check orientation lock
3. Refresh page
4. Try landscape mode
```

### Elements Cut Off:
```
1. Enable scrolling
2. Adjust zoom (Ctrl+0)
3. Check viewport meta tag
4. Reduce content size
```

## 📱 Mobile-Specific Tips

### Performance:
- Smaller images
- Compressed video
- Reduced animations
- Optimized fonts

### Touch Interaction:
- Larger buttons
- More spacing
- Clear feedback
- Easy scrolling

### Battery:
- Lower refresh rate
- Dimmer screen
- Disable unused features
- Optimize video

---

**Display sekarang responsive untuk semua orientasi!** 📱💻

**Auto-switch antara landscape dan portrait layout!** 🔄
