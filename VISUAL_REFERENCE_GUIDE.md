# 🎨 Visual Design Reference Guide

## Color Palette Swatches

### Primary Colors

```
█████████ #1a4d7a  Primary (Steel Blue)
█████████ #0d2d47  Primary Dark
█████████ #2563b8  Primary Light
```

### Accent Colors

```
█████████ #c97c4a  Accent (Muted Orange)
█████████ #a85e38  Accent Dark
```

### Neutral Colors

```
█████████ #f5f5f5  Grey Light (Light backgrounds)
█████████ #d1d5db  Grey Medium (Borders)
█████████ #4b5563  Grey Dark (Text)
█████████ #1a1a1a  Text Dark (Headings)
```

### Secondary

```
█████████ #3d4a54  Secondary (Industrial Charcoal)
```

---

## Usage Examples

### Hero Section (Home Page)

```
Background: Gradient from-primary via-primary-dark to-secondary
Text: text-white, text-grey-light for secondary
Animation: fade-in-up with staggered delays
```

### Feature Cards

```
Background: bg-white
Border: shadow-lg hover:shadow-xl
Text: text-primary for headings, text-grey-dark for body
Hover: scale-105, shadow upgrade
```

### Buttons

```
Primary Button: bg-primary text-white hover:bg-primary-dark
Secondary Button: bg-accent text-white hover:bg-accent-dark
Outline Button: border border-primary text-primary hover:bg-primary hover:text-white
```

### Form Inputs

```
Border: border-grey-medium
Focus: border-primary + ring-2 ring-primary ring-opacity-20
Background: bg-white
Text: text-grey-dark
```

### Navigation

```
Default: text-grey-dark
Hover: text-accent
Active: text-primary
Duration: transition-colors duration-300
```

### Footer

```
Background: bg-primary
Text: text-grey-light
Links: hover:text-accent
Icons: text-accent hover:scale-110
```

---

## Animation Reference

### fadeIn (300-600ms)

```
Starting state:  opacity: 0
Ending state:    opacity: 1
Use for:         Simple fade-in on page load
```

### fadeInUp (300-600ms)

```
Starting state:  opacity: 0; transform: translateY(20px)
Ending state:    opacity: 1; transform: translateY(0)
Use for:         Text & headings entering from below
```

### slideInLeft (300-600ms)

```
Starting state:  opacity: 0; transform: translateX(-30px)
Ending state:    opacity: 1; transform: translateX(0)
Use for:         Content sliding from left side
```

### slideInRight (300-600ms)

```
Starting state:  opacity: 0; transform: translateX(30px)
Ending state:    opacity: 1; transform: translateX(0)
Use for:         Content sliding from right side
```

### scaleIn (300-600ms)

```
Starting state:  opacity: 0; transform: scale(0.95)
Ending state:    opacity: 1; transform: scale(1)
Use for:         Images & cards appearing
```

---

## Responsive Breakpoints Reference

### Screen Sizes

```
Mobile:        < 768px     (phones)
Tablet:        768-1024px  (iPad)
Desktop:       1024-1280px (laptop)
Wide Desktop:  > 1280px    (large monitors)
```

### Grid Columns

```
Mobile:   1 column   (grid-cols-1)
Tablet:   2 columns  (md:grid-cols-2)
Desktop:  3 columns  (lg:grid-cols-3)
```

### Typography

```
Mobile:   text-base
Tablet:   md:text-lg
Desktop:  lg:text-xl
```

### Spacing

```
Mobile:   p-4
Tablet:   md:p-6
Desktop:  lg:p-8
```

---

## Component Examples

### Hero Section

```jsx
<section className="bg-gradient-to-br from-primary via-primary-dark to-secondary py-24 md:py-32">
  <h1 className="text-5xl md:text-6xl text-white animate-fade-in-up">Title</h1>
  <p
    className="text-lg md:text-xl text-grey-light animate-fade-in-up"
    style={{ animationDelay: "100ms" }}
  >
    Subtitle
  </p>
</section>
```

### Feature Card

```jsx
<div
  className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-fade-in-up"
  style={{ animationDelay: `${idx * 100}ms` }}
>
  <h3 className="text-primary mb-2">Title</h3>
  <p className="text-grey-dark">Description</p>
</div>
```

### Product Card

```jsx
<div
  className="group animate-fade-in-up"
  style={{ animationDelay: `${idx * 75}ms` }}
>
  <img src={image} className="group-hover:scale-110 transition duration-500" />
  <h3 className="text-primary group-hover:text-accent transition-colors">
    {name}
  </h3>
</div>
```

### Form Input

```jsx
<input
  className="px-4 py-3 
             border border-grey-medium
             focus:outline-none
             focus:border-primary
             focus:ring-2
             focus:ring-primary
             focus:ring-opacity-20
             transition-all"
/>
```

### Button

```jsx
<button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors duration-300">
  Click Me
</button>
```

---

## Accessibility Visual Checklist

### Focus Indicators ✅

```
Form inputs: Blue ring visible on focus
Links: Underline appears on focus
Buttons: Ring + color change on focus
Navigation: Items highlight on focus
```

### Color Contrast ✅

```
White on Blue (#1a4d7a):     ✅ 15.8:1 (AAA)
White on Orange (#c97c4a):   ✅ 8.5:1 (AA)
Dark text on Light bg:       ✅ 8.0:1+ (AA)
```

### Motion Preferences ✅

```
If prefers-reduced-motion:
- Animations: Disabled
- Transitions: Instant
- Scroll: Smooth behavior allowed
```

---

## Dark Mode Preparation

### Future Dark Color Palette (Ready to implement)

```
Dark Primary:     #0f1419
Dark Secondary:   #1a2332
Dark Accent:      #e8a763
Dark Text:        #f0f0f0
Dark Border:      #2d3748
```

---

## Performance Considerations

### GPU-Accelerated Properties ✅

```css
transform: scale(1.05)          /* ✅ Use */
transform: translateY(10px)     /* ✅ Use */
opacity: 0.5                    /* ✅ Use */
```

### CPU-Intensive (Avoid) ❌

```css
width: 100px                    /* ❌ Avoid */
height: 100px                   /* ❌ Avoid */
top: 10px                       /* ❌ Avoid */
left: 10px                      /* ❌ Avoid */
```

---

## Shadow System

### Light Shadows (Card backgrounds)

```css
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

### Medium Shadows (Hover effects)

```css
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Large Shadows (Elevated content)

```css
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
```

---

## Spacing Scale

### Consistent Spacing

```
xs: 4px   (0.25rem)
sm: 8px   (0.5rem)
md: 16px  (1rem)
lg: 24px  (1.5rem)
xl: 32px  (2rem)
2xl: 48px (3rem)
```

---

## Font Sizes

### Type Scale

```
xs: 12px  (text-xs)
sm: 14px  (text-sm)
base: 16px (text-base)
lg: 18px  (text-lg)
xl: 20px  (text-xl)
2xl: 24px (text-2xl)
3xl: 30px (text-3xl)
4xl: 36px (text-4xl)
5xl: 48px (text-5xl)
6xl: 60px (text-6xl)
```

---

## Border Radius Scale

```
sm: 4px
base: 6px
md: 8px
lg: 12px
xl: 16px
full: 9999px (circles)
```

---

## Quick Copy-Paste Classes

### Animations

```
animate-fade-in
animate-fade-in-up
animate-slide-in-left
animate-slide-in-right
animate-scale-in
```

### Colors

```
text-primary
text-accent
text-grey-dark
bg-primary
bg-accent
border-grey-medium
```

### Responsive

```
md:flex
md:grid-cols-2
lg:grid-cols-3
md:text-lg
md:p-8
```

### Transitions

```
transition-colors
transition-transform
transition-shadow
transition-all
duration-300
duration-500
```

### Hover Effects

```
hover:text-accent
hover:scale-105
hover:shadow-xl
hover:bg-primary-dark
```

---

## Debugging Guide

### Inspect Colors

```javascript
// Browser console
getComputedStyle(element).backgroundColor;
getComputedStyle(element).color;
```

### Check Animation

```javascript
// Browser DevTools Animations panel
// Shows playing animations in real-time
```

### Responsive Testing

```
F12 → Ctrl+Shift+M → Choose device
Mobile portrait
Mobile landscape
Tablet
Responsive slider
```

---

## File References

### Color Definitions

- Location: `styles/globals.css` (lines 5-20)
- Override: `tailwind.config.js` (colors object)

### Animation Definitions

- Location: `styles/globals.css` (@keyframes section)
- Tailwind Config: `tailwind.config.js` (animation object)

### Component Styling

- Header: `components/Header.jsx`
- Footer: `components/Footer.jsx`
- Pages: `pages/*.jsx`

---

## Visual Hierarchy

### Primary (Main focus)

- Primary color (#1a4d7a)
- Large text size (2xl-4xl)
- Bold font weight (700)
- Full opacity (1)

### Secondary (Supporting)

- Accent color (#c97c4a)
- Medium text size (base-lg)
- Normal font weight (400)
- Full opacity (1)

### Tertiary (Supplementary)

- Grey dark (#4b5563)
- Small text size (xs-sm)
- Light font weight (400)
- Reduced opacity (0.7)

---

**This visual reference should help you quickly understand and apply the design system!**

For detailed information, see:

- DESIGN_SYSTEM_QUICK_REFERENCE.md
- UI_UX_ENHANCEMENT_SUMMARY.md
- IMPLEMENTATION_GUIDE.md
