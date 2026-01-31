# Design System Quick Reference

## Color Palette

### Primary Colors

```
Steel Blue       #1a4d7a   (Primary text, headers, buttons)
Primary Dark     #0d2d47   (Hover states, dark gradients)
Primary Light    #2563b8   (Alternative highlights)
```

### Accent Colors

```
Muted Orange     #c97c4a   (CTAs, highlights, links)
Accent Dark      #a85e38   (Hover, active states)
```

### Neutral Colors

```
Grey Light       #f5f5f5   (Light backgrounds)
Grey Medium      #d1d5db   (Borders, dividers)
Grey Dark        #4b5563   (Body text)
Text Dark        #1a1a1a   (Primary text)
```

## CSS Variables

```css
/* Colors */
--primary: #1a4d7a;
--primary-dark: #0d2d47;
--primary-light: #2563b8;
--accent: #c97c4a;
--accent-dark: #a85e38;
--secondary: #3d4a54;
--grey-light: #f5f5f5;
--grey-medium: #d1d5db;
--grey-dark: #4b5563;
--text-dark: #1a1a1a;

/* Transitions */
--transition-fast: 150ms ease-in-out;
--transition-base: 300ms ease-in-out;
--transition-slow: 500ms ease-in-out;
```

## Animation Classes

### Page Load Animations

```jsx
animate-fade-in        // Simple fade in
animate-fade-in-up     // Fade + move up
animate-slide-in-left  // Slide from left
animate-slide-in-right // Slide from right
animate-scale-in       // Scale up
```

### Delay Utilities

```jsx
delay - 100; // 100ms
delay - 200; // 200ms
delay - 300; // 300ms
delay - 400; // 400ms
```

### Hover Effects

```jsx
hover: scale - 105; // Slight scale
hover: scale - 110; // Image zoom
hover: shadow - xl; // Shadow upgrade
hover: text - accent; // Color change
hover: bg - opacity - 10; // Background tint
transition - transform; // Scale animation
transition - colors; // Color animation
transition - shadow; // Shadow animation
```

### Transitions

```jsx
duration-300   // 300ms (default interactions)
duration-500   // 500ms (slower transitions)
ease-in-out    // Standard easing
```

## Common Patterns

### Hero Section

```jsx
<section className="bg-gradient-to-br from-primary via-primary-dark to-secondary py-24 md:py-32">
  <div className="container text-white">
    <h1 className="text-5xl md:text-6xl font-bold animate-fade-in-up">
      Heading
    </h1>
    <p
      className="text-lg md:text-xl text-grey-light animate-fade-in-up"
      style={{ animationDelay: "100ms" }}
    >
      Subtitle
    </p>
  </div>
</section>
```

### Feature Cards

```jsx
{
  features.map((item, idx) => (
    <div
      key={idx}
      className="bg-white p-8 rounded-lg shadow-lg 
               hover:shadow-xl hover:scale-105 
               transition-all duration-300 
               text-center animate-fade-in-up"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      <h3 className="text-primary mb-2">{item.title}</h3>
      <p className="text-grey-dark">{item.description}</p>
    </div>
  ));
}
```

### Product Card

```jsx
<div
  className="group animate-fade-in-up"
  style={{ animationDelay: `${idx * 75}ms` }}
>
  <div
    className="bg-grey-medium rounded-lg overflow-hidden 
                  shadow-md group-hover:shadow-lg"
  >
    <img
      src={image}
      alt={name}
      className="w-full h-64 object-cover 
                 group-hover:scale-110 
                 transition duration-500"
    />
  </div>
  <h3
    className="text-primary group-hover:text-accent 
                 transition-colors"
  >
    {name}
  </h3>
</div>
```

### Form Input

```jsx
<input
  type="text"
  className="px-4 py-3 
             border border-grey-medium 
             rounded-lg 
             focus:outline-none 
             focus:border-primary 
             focus:ring-2 
             focus:ring-primary 
             focus:ring-opacity-20 
             transition-all"
/>
```

### Button with Hover

```jsx
<button
  className="btn-primary 
                   hover:scale-105 
                   transform 
                   transition-transform"
>
  Click Me
</button>
```

### Link with Hover

```jsx
<a
  href="/"
  className="text-grey-dark 
              hover:text-accent 
              transition-colors 
              duration-300"
>
  Link
</a>
```

### Staggered List

```jsx
{
  items.map((item, idx) => (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${idx * 100}ms` }}
    >
      {item}
    </div>
  ));
}
```

## Responsive Breakpoints

```jsx
// Mobile first approach
<div className="p-4 md:p-8 lg:p-12">
  Content
</div>

// Hide on mobile
<div className="hidden md:block">Desktop Only</div>

// Show on mobile only
<div className="md:hidden">Mobile Only</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Cards */}
</div>

// Responsive text size
<h1 className="text-4xl md:text-5xl lg:text-6xl">Heading</h1>
```

## Accessibility Checklist

- [ ] All text has sufficient contrast (4.5:1)
- [ ] Focus indicators visible on all elements
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (`aria-labels`)
- [ ] Respects `prefers-reduced-motion`
- [ ] Touch targets ≥ 44px
- [ ] Color not only indicator of state

## Performance Tips

1. **Use GPU-accelerated properties**
   - ✅ `transform: scale()`
   - ✅ `opacity`
   - ❌ `width`, `height`, `left`, `top`

2. **Keep animations short**
   - ✅ 300-600ms
   - ❌ 1000ms+

3. **Minimize delay differences**
   - ✅ 75-100ms stagger
   - ❌ 500ms between items

4. **Use `will-change` sparingly**

   ```css
   .element:hover {
     will-change: transform;
   }
   ```

5. **Test on real devices**
   - Mobile devices, tablets, desktop
   - Check frame rate in DevTools

## Common Issues & Fixes

### Animations not working

```bash
# Clear cache
Ctrl+Shift+Delete  # Windows
Cmd+Shift+Delete   # Mac
```

### Layout shift

```css
/* Prevent content jump */
min-height: 100vh;
width: 100%;
```

### Janky scrolling

```css
/* Optimize scroll performance */
will-change: transform;
transform: translateZ(0);
```

### Color not updating

```bash
# Hard refresh
Ctrl+Shift+R   # Windows
Cmd+Shift+R    # Mac
```

## File Locations

- **Colors**: `styles/globals.css` (`:root` variables)
- **Animations**: `styles/globals.css` (@keyframes)
- **Tailwind Config**: `tailwind.config.js`
- **Components**: `components/*.jsx`
- **Pages**: `pages/*.jsx`

## Useful Links

- Tailwind CSS Docs: https://tailwindcss.com
- Next.js Docs: https://nextjs.org
- CSS Animations: https://mdn.io/css-animation
- Accessibility: https://www.w3.org/WAI/

---

**Version:** 1.0.0  
**Last Updated:** 2024
