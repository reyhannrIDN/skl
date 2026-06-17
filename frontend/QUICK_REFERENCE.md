# SKL IDN - Quick Reference Card

## 🚀 Getting Started (2 minutes)

```bash
cd frontend
npm install    # If needed
npm run dev    # Start development server
```

Visit: `http://localhost:5173`

## 🎨 Design System At A Glance

### Colors
| Name | Value | Usage |
|------|-------|-------|
| Primary | #0B1C2C (Deep Navy) | Foreground, logo, main text |
| Accent | #D4A017 (Gold) | Highlights, CTAs, glows |
| Secondary | #2563EB (Blue) | Gradients, accents |
| Success | #22C55E (Green) | Status badges, confirmations |
| Background | #F8FAFC (Soft White) | Page background |

### Fonts
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Spacing
- **Container**: max-w-6xl, px-4
- **Sections**: py-40 desktop, py-32 mobile
- **Cards**: p-8 to p-12

### Border Radius
- **XL**: 24px (main cards)
- **LG**: 20px (medium elements)
- **MD**: 12px (buttons)
- **SM**: 8px (small UI)

## 🎬 Key Animations

| Animation | Duration | Trigger | Effect |
|-----------|----------|---------|--------|
| Hero Entrance | 1000ms | Page load | Staggered slides |
| Card Hover | 300ms | Mouse hover | Elevation + shadow |
| Icon Scale | 300ms | Card hover | 100% → 110% |
| Underline | 300ms | Link hover | Width 0 → 100% |
| Blob Flow | 7s | Continuous | Background movement |
| Glow Pulse | 1s | Badge active | Opacity pulse |

## 📱 Responsive Breakpoints

```
Mobile:  < 640px  (1 column, full width)
Tablet:  640-1024px (2 columns)
Desktop: > 1024px (3 columns, max container)
```

## 🔧 File Locations

```
src/
├── pages/common/
│   └── LandingPage.jsx         ← Main component (UPDATED)
├── index.css                    ← Colors, animations (UPDATED)
├── App.css                      ← Global styles (UPDATED)
└── ...

frontend/
├── index.html                   ← Fonts, meta (UPDATED)
├── DESIGN_SYSTEM.md            ← Full design spec
├── COMPONENT_GUIDE.md          ← Component showcase
├── IMPLEMENTATION_GUIDE.md     ← Setup & tips
└── BEFORE_AFTER.md            ← Visual comparison
```

## 🎨 Component Quick Links

### Navbar
```jsx
// Edit colors, logos, or menu items
// Location: LandingPage.jsx, line ~70
<nav className="glass-nav sticky top-0 z-50">
```

### Hero Section
```jsx
// Update heading, badge, search placeholder
// Location: LandingPage.jsx, line ~130
<h1 className="text-5xl md:text-6xl lg:text-7xl...">
```

### Feature Cards
```jsx
// Modify 3 feature cards and descriptions
// Location: LandingPage.jsx, line ~280
{[{ icon, title, desc, badge }, ...].map()}
```

### Announcements
```jsx
// Update announcement dates and content
// Location: LandingPage.jsx, line ~355
{[{ date, title, desc, icon }, ...].map()}
```

### Footer
```jsx
// Edit contact info and social links
// Location: LandingPage.jsx, line ~440
<footer className="border-t border-white/10...">
```

## 🎯 Customization Snippets

### Change Primary Color
```css
/* src/index.css */
:root {
  --primary: 209 60% 11%; /* Current: Deep Navy */
  /* Change HSL values to your color */
}
```

### Change Accent Gold to Blue
```css
/* src/index.css */
:root {
  --accent: 43 82% 46%; /* Current: Gold */
  --accent: 221 83% 53%; /* New: Blue */
}
```

### Speed Up Animations
```css
/* src/App.css */
@keyframes blob {
  animation: blob 7s infinite; /* Change to 5s for faster */
}
```

### Change Font Family
```html
<!-- index.html -->
<link href="https://fonts.googleapis.com/css2?
  family=YOUR_FONT:wght@400;700&display=swap" rel="stylesheet">
```

### Adjust Glass Blur Strength
```jsx
// In LandingPage.jsx, change:
backdrop-blur-xl   // Current strength
backdrop-blur-2xl  // More blur
backdrop-blur-md   // Less blur
```

## 🧪 Testing Checklist

- [ ] Load page and verify animations
- [ ] Test search feature (works in demo mode)
- [ ] Hover over interactive elements
- [ ] Test on mobile device
- [ ] Toggle dark mode
- [ ] Check all links
- [ ] Test keyboard navigation
- [ ] Verify dark mode styling

## 🐛 Common Issues & Fixes

### Fonts Not Loading
```html
<!-- Check in index.html -->
<link href="https://fonts.googleapis.com/..." rel="stylesheet">
<!-- Make sure link is present -->
```

### Animations Not Smooth
```css
/* Ensure GPU acceleration in CSS */
transform: translate(0, 0);  /* ✅ Good */
left: 100px;                  /* ❌ Slow */
```

### Colors Look Wrong
```css
/* Verify HSL format in index.css */
--primary: 209 60% 11%;  /* ✅ Correct format */
--primary: #0B1C2C;      /* ❌ Use HSL not hex */
```

### Dark Mode Not Working
```html
<!-- Add dark class to html element -->
<html class="dark">  <!-- Required for dark mode -->
```

## 📈 Performance Tips

1. **Use Development Mode for Testing**
   ```bash
   npm run dev  # Fast, live updates
   ```

2. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

3. **Optimize Images** (when adding)
   - Compress before uploading
   - Use WebP format
   - Set proper dimensions

4. **Monitor Animations**
   - Use Chrome DevTools Performance tab
   - Check FPS (should be 60fps)
   - Look for jank in animations

## 🎓 Learning Resources

### Design System
- Read: `DESIGN_SYSTEM.md` (full specifications)
- Learn: Color theory, typography, spacing

### Components
- Read: `COMPONENT_GUIDE.md` (detailed breakdown)
- Study: Each section's visual effects

### Implementation
- Read: `IMPLEMENTATION_GUIDE.md` (setup guide)
- Reference: Customization examples

### Visual Comparison
- Read: `BEFORE_AFTER.md` (transformation details)
- See: What changed and why

## 🆘 Support

### Debug Animation
```jsx
// Add temporary outline to see structure
className="border border-red-500" // Temporary debug
```

### Check Browser Console
```javascript
// Check for errors in browser DevTools
F12 → Console → Look for red errors
```

### Test CSS
```css
/* Use DevTools to inspect styles */
Right-click → Inspect → Check computed styles
```

## 📊 File Stats

| File | Lines | Purpose |
|------|-------|---------|
| LandingPage.jsx | 600+ | Main component |
| index.css | 141 | Colors & animations |
| App.css | 120+ | Global styles |
| DESIGN_SYSTEM.md | 400+ | Design docs |
| COMPONENT_GUIDE.md | 450+ | Component specs |
| IMPLEMENTATION_GUIDE.md | 350+ | Setup guide |

## ⚡ Quick Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code (if configured)
npm run format
```

## 🎉 You're All Set!

Your SKL IDN website is ready to impress! 

**Next Steps:**
1. Run `npm run dev`
2. Open `http://localhost:5173`
3. Enjoy the premium design! ✨

**Questions?** Check the documentation files:
- `DESIGN_SYSTEM.md` - Design details
- `COMPONENT_GUIDE.md` - Component reference
- `IMPLEMENTATION_GUIDE.md` - Usage guide
- `BEFORE_AFTER.md` - Visual comparison

---

**Version**: 1.0.0  
**Status**: ✅ Ready  
**Last Updated**: March 13, 2026
