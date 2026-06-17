# SKL IDN - Component Showcase & Implementation Guide

## 🎯 Landing Page Components

### 1. Premium Sticky Navbar
**Location**: Top of page, sticky positioning (z-50)

**Features**:
- Glassmorphic design with backdrop blur
- Logo with gradient background
- Navigation links with animated underline
- Responsive menu
- Dashboard/Login button with gradient

**CSS Classes**:
- `.glass-nav` - Glassmorphism effect
- `.group` - For animated underlines
- `.transition-all` - Smooth animations

**Code Structure**:
```jsx
<nav className="glass-nav sticky top-0 z-50 border-b border-white/10">
  {/* Logo Section */}
  {/* Navigation Menu */}
  {/* Auth Buttons */}
</nav>
```

---

### 2. Hero Section with Badge
**Visual Effect**: Animated entrance with staggered delays

**Components**:
1. **Premium Badge** - Accent background, sparkles icon
   - Hover: Sparkles icon spins
   - Animation: fade-in, slide-in 800ms

2. **Luxury Heading** - Large serif typography
   - Color: Gold gradient with underline glow
   - Size: 56-112px responsive
   - Animation: slide-in 1000ms delay-100

3. **Subheading** - Light weight body text
   - Two-line layout: subtitle + key benefit
   - Animation: slide-in 1000ms delay-200

**CSS Styles**:
```css
.text-gradient-gold {
  background: linear-gradient(to right, #D4A017, #FCD34D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

### 3. Premium Search Card
**Visual Effect**: Glassmorphic with animated glow

**Structure**:
```
[Glow Background] ← Animated, increases on hover
  ├─ Search Icon (accent color, hides on mobile)
  ├─ Input Field (transparent, no border)
  ├─ Button (gradient gold, glow shadow)
  └─ Helper Text (trustworthiness signals)
```

**Features**:
- Glow effect: `from-secondary/30 via-accent/20 to-secondary/30`
- Button gradient: `from-accent to-accent/80`
- Shadow: `shadow-accent/30` → `shadow-accent/50` on hover
- Spinner on loading
- Input placeholder: soft gray color

**Interactions**:
- Hover: shadow increases, glow becomes brighter
- Focus: input maintains transparency
- Loading: button shows custom spinner

---

### 4. Graduation Result Card - Premium WOW Section
**Visual Effect**: Success-themed with glowing border

**Premium Touches**:
1. **Glowing Border** - Animated gradient halo
   ```css
   background: linear-gradient(to right, 
     rgba(34,197,94,0.4), 
     rgba(212,160,23,0.2), 
     rgba(34,197,94,0.4)
   );
   opacity: 60% → 100% on hover
   ```

2. **Status Badge** - Animated pulse with green glow
   - Pulse animation: 0.8-1.0 opacity
   - Shadow: `shadow-[0_0_30px_rgba(34,197,94,0.25)]`
   - Icon: CheckCheck (premium confirmation)

3. **Success Gradient Background**
   - Subtle background: `from-success/5 via-transparent to-transparent`
   - Increases trust perception

4. **Content Grid**
   - Responsive 2-column (or 1 on mobile)
   - Clear label → value hierarchy
   - Icons for key information

5. **Divider**
   - Gradient: `from-transparent via-border to-transparent`
   - Psychological break between info and action

6. **Action Buttons**
   - Primary: `from-success to-success/80` (green gradient)
   - Secondary: Outline style with accent hover

**Entrance Animation**:
- Trigger: Search result received
- Animation: slide-in-from-bottom 700ms
- Scroll: Auto-scroll to center view

---

### 5. Feature Cards Section
**Visual Effect**: Glassmorphic cards with hover elevation

**Card Structure**:
```
[Glow Background] ← Appears on hover
  ├─ Badge (accent/15 background, accent text)
  ├─ Icon Box (accent/10, scale 110% on hover)
  ├─ Title (serif bold)
  ├─ Description (muted, flex-1 grows)
  └─ Arrow Indicator (translate-x-2 on hover)
```

**Hover Effects**:
- Card: lift 6px, shadow increase
- Icon: scale 110%, rotate -6°, color intensify
- Arrow: translate-x-2
- Overall: smooth 300ms transition

**3 Feature Types**:
1. **Transparan & Terverifikasi** - CheckCircle2 icon
2. **Proses Instan** - Zap icon
3. **Keamanan Berlapis** - ShieldCheck icon

---

### 6. Announcement Section
**Visual Effect**: Interactive cards with hover glow

**Card Components**:
1. **Date Card** (left side)
   - Gradient background: `from-accent/10 to-accent/5`
   - Large bold number
   - Small uppercase month
   - Border: accent/20 → accent/40 on hover

2. **Content Area** (middle)
   - Icon + Title layout
   - Color transitions: foreground → accent on hover
   - Description with line-clamp

3. **Interaction Indicator** (right side)
   - ChevronRight icon
   - Animates on parent hover

**Glow Effect**:
- Background: `from-accent/20 to-secondary/10`
- Blur: `blur-lg`
- Appears on hover

---

### 7. Call-to-Action Section
**Visual Effect**: Premium gradient background with overlay

**Layers**:
1. Bottom: `from-secondary/30 via-accent/20 to-secondary/30`
2. Middle: `from-foreground/5 via-transparent to-transparent`
3. Top: `.glass-panel` glassmorphism

**Content**:
- Large heading (serif)
- Descriptive subtext
- Dual action buttons:
  - Primary: gradient, shadow
  - Secondary: outline, transparent hover

---

### 8. Premium Footer
**Visual Effect**: Subtle gradient overlay

**Structure**:
- Top border: `border-white/10`
- Background: `from-white/5 to-transparent` gradient
- Backdrop: `blur-xl`

**Sections**:
1. **Brand** (2/4 width)
   - Logo with gradient
   - Description text
   - Social icons (f, 𝕏, in)

2. **Quick Links** (1/4 width)
   - Arrow indicator appears on hover
   - Smooth color transition to accent

3. **Contact Info** (1/4 width)
   - Emoji icons for visual interest
   - Emoji + text layout
   - Links with hover color

**Bottom Section**:
- Divider: gradient from transparent
- Copyright + Links
- Responsive flex layout

---

## 🎬 Animation Timeline

### Page Load
```
0ms    ├─ Badge: fade-in
200ms  ├─ Heading: slide-in-bottom
400ms  ├─ Subheading: slide-in-bottom
600ms  ├─ Search Card: fade-in zoom-in
800ms  └─ Background blobs: continue flowing

Search Triggered
1500ms └─ Result Card: slide-in-bottom (on result)
       └─ Auto-scroll to result
```

### Hover Animations
```
Card Hover:
├─ Shadow: 0 → 20px/60px shadow
├─ Elevation: 0 → -6px translate-y
├─ Glow: opacity 0% → 100%
└─ Duration: 300ms ease-out

Icon Hover:
├─ Scale: 100% → 110%
├─ Rotation: 0° → -6°
├─ Color: muted → accent
└─ Duration: 300ms ease-out

Link Hover:
├─ Underline: width 0 → 100%
├─ Color: muted → accent
└─ Duration: 300ms ease-out
```

---

## 🎨 Color Usage Guide

### Backgrounds
- **Main BG**: `#F8FAFC` (soft white)
- **Cards**: `rgba(255,255,255,0.8)` (light)
- **Dark Mode Cards**: `rgba(11,28,44,0.8)` (dark navy)

### Text Colors
- **Primary**: `#0B1C2C` (deep navy)
- **Secondary**: `#2563EB` (modern blue)
- **Muted**: `#5A6B7A` (gray)
- **Accent**: `#D4A017` (gold)
- **Success**: `#22C55E` (green)

### Borders
- **Subtle**: `border-white/20` on light, `border-white/10` on dark
- **Accent**: `border-accent/30` → `border-accent/60` on hover

### Shadows
```
soft:       0 10px 30px rgba(0,0,0,0.08)
hover:      0 20px 60px rgba(0,0,0,0.15)
glow:       0 0 20px rgba(212,160,23,0.5)
glow-blue:  0 0 20px rgba(37,99,235,0.4)
success:    0 0 30px rgba(34,197,94,0.25)
```

---

## 📐 Sizing Reference

### Typography
- **H1**: 56-112px (responsive)
- **H2**: 36-48px
- **H3**: 24-32px
- **Body**: 16-18px
- **Small**: 14px
- **Tiny**: 12px

### Spacing
- **Container**: Max 1400px, padding 2rem
- **Section**: Py 40px (desktop), 32px (mobile)
- **Card**: P 24-40px depending on size
- **Gap**: 8-32px depending on context

### Border Radius
- **XL**: 24px (cards, panels)
- **LG**: 20px (larger elements)
- **MD**: 12px (medium elements)
- **SM**: 8px (small elements)

---

## 🔧 Customization Examples

### Change Gold Accent to Silver
```css
/* src/index.css */
--accent: 200 10% 60%; /* Silver HSL */
```

Then update shadows:
```css
/* src/App.css */
@keyframes glow {
  box-shadow: 0 0 20px rgba(192, 192, 192, 0.5);
}
```

### Increase Animation Speed
```css
/* src/index.css */
.animate-blob {
  animation: blob 5s infinite; /* Changed from 7s */
}
```

### Enhance Glass Effect
```jsx
// In LandingPage.jsx
className="backdrop-blur-2xl" // Changed from xl
```

### Make Buttons More Bold
```jsx
// Add drop shadow
className="shadow-lg shadow-accent/50" // Increased shadow
```

---

## 📋 Component Checklist

- [x] Premium Sticky Navbar
- [x] Hero Section with Badge
- [x] Luxury Heading
- [x] Premium Search Card
- [x] Graduation Result Card
- [x] Feature Cards (3 variations)
- [x] Announcement Cards
- [x] Call-to-Action Section
- [x] Premium Footer
- [x] Animations (Blobs, Entrance, Hover)
- [x] Glassmorphism Effects
- [x] Gradient Overlays
- [x] Glow Effects
- [x] Dark Mode Support
- [x] Responsive Design
- [x] Accessibility (Basic)

---

**Last Updated**: March 13, 2026  
**Design System Version**: 1.0.0  
**Status**: ✅ Complete & Production Ready
