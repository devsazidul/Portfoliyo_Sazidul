# Portfolio Website Design Guidelines

## Design Approach
**Aesthetic Direction**: Vibrant, futuristic 3D portfolio with bold gradients, neon accents, and immersive animations. Think cyberpunk meets modern minimalism - high energy, high contrast, with depth and dimensionality.

## Typography System
- **Headings**: Bold, modern sans-serif (e.g., "Space Grotesk" or "Outfit" from Google Fonts) - weights: 700-800
- **Body**: Clean geometric sans-serif (e.g., "Inter" or "DM Sans") - weights: 400, 500
- **Accent Text**: Same as headings but with gradient text effects
- **Hierarchy**: Hero (text-6xl to text-8xl), Section Titles (text-4xl to text-5xl), Subsections (text-2xl), Body (text-base to text-lg)

## Layout & Spacing System
**Spacing Units**: Use Tailwind units of 4, 8, 12, 16, 20, 24, and 32 consistently
- Section padding: py-20 to py-32 (desktop), py-12 to py-16 (mobile)
- Component gaps: gap-8 to gap-12
- Container: max-w-7xl with px-6 to px-8

## Page Structure & Sections

### 1. Hero Section (80vh)
- Full-width animated gradient background with floating 3D geometric shapes
- Centered content with large animated headline and subtitle
- Prominent CTA button with blur background (glass-morphism effect)
- Parallax scroll effect on geometric elements
- **Image**: Abstract 3D rendered background with geometric shapes, colorful gradients (purple/blue/pink spectrum)

### 2. About/Personal Information (Natural height)
- Two-column layout (lg:grid-cols-2): Profile image + bio text
- Animated skill tags with gradient borders
- Stats counter section (3-4 columns): Years experience, Projects completed, Documents shared, etc.
- **Image**: Professional headshot or creative portrait with vibrant background treatment

### 3. Projects Showcase
- Masonry grid layout (md:grid-cols-2, lg:grid-cols-3)
- Project cards with 3D tilt effect on hover (perspective transform)
- Each card: Thumbnail image, title, description, tech stack tags, "View Project" link
- Staggered fade-in animation on scroll
- Filter/category tabs at top (All, Web, Design, Development)
- **Images**: Project screenshots/mockups for each card

### 4. Documents Gallery
- Grid layout (md:grid-cols-2, lg:grid-cols-4) with document preview cards
- Document type icons (PDF, DOC, etc.) with vibrant colored backgrounds
- Hover effect: Lift and glow animation
- Quick actions: View, Download buttons
- Search bar and category filters at top
- Organized by type/category with visual separators

### 5. Contact Section
- Two-column layout (lg:grid-cols-2): Contact form + Contact info/social links
- Form fields: Name, Email, Subject, Message (textarea)
- Animated input fields with gradient focus states
- Submit button with loading animation
- Right column: Email, location, social media links with icon buttons
- **Image**: Abstract gradient blob shapes in background (non-intrusive)

### 6. Footer
- Three-column grid (md:grid-cols-3): About snippet, Quick links, Social + Newsletter
- Newsletter signup with inline form
- Social media icon buttons with hover glow effects
- Copyright and back-to-top button

## Component Specifications

### Navigation
- Fixed header with glass-morphism (backdrop-blur)
- Logo left, nav links right, mobile hamburger menu
- Smooth scroll-spy active state indicators
- Gradient underline animation on hover

### Cards (Projects/Documents)
- Rounded corners (rounded-2xl)
- Gradient borders (border-2 with gradient overlay)
- 3D transform on hover (scale + rotateX/Y slight tilt)
- Shadow elevation on hover (shadow-2xl with colored glow)
- Padding: p-6 to p-8

### Buttons
- Primary: Large rounded buttons (rounded-full, px-8, py-4)
- Glass-morphism background when on images (backdrop-blur-lg, bg-white/20)
- Gradient backgrounds for standalone CTAs
- Icon + text combinations where appropriate

### 3D Interactive Elements
- Floating geometric shapes (spheres, cubes, pyramids) using CSS 3D transforms
- Parallax scrolling at different speeds for depth
- Mouse-follow effect for hero elements (subtle movement)
- Intersection observer animations for scroll-triggered reveals

## Animation Strategy
- **Page Load**: Staggered fade-in animations (hero → nav → content)
- **Scroll Animations**: Fade-up on sections entering viewport, parallax on backgrounds
- **Hover Effects**: Scale, lift, glow, 3D tilt transforms
- **Transitions**: All 300-500ms with easing curves (ease-in-out, cubic-bezier)
- **Micro-interactions**: Button ripples, form field focus glows, icon bounces

## Responsive Behavior
- Mobile: Stack all columns, reduce animation intensity, simplified 3D effects
- Tablet: Two-column layouts where appropriate
- Desktop: Full multi-column grids, enhanced 3D and parallax effects
- Touch devices: Disable hover-dependent features, ensure tap targets 44px minimum

## Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus visible states with gradient outlines
- Reduced motion support (@prefers-reduced-motion)
- Semantic HTML5 structure throughout
- Form validation with clear error states

**Design Personality**: Bold, energetic, futuristic, professional yet playful - a portfolio that demonstrates technical skill and creative vision through its very existence.