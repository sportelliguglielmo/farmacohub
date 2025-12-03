# Italian Pharmacy Theme

## Design Philosophy

This theme is inspired by Italian pharmaceutical design, characterized by:
- **Professional green** - The distinctive green used in Italian pharmacy logos (HSL: 142°)
- **Clean white backgrounds** - For a medical, sterile, and trustworthy appearance
- **Subtle green accents** - For a cohesive, professional look throughout the platform

## Color Palette

### Primary Colors
- **Primary Green**: `hsl(142, 52%, 35%)` - Main brand color, used for buttons, links, and key actions
- **Primary Foreground**: White text on green backgrounds

### Background Colors
- **Background**: Pure white `hsl(0, 0%, 100%)` - Main page background
- **Card**: White for elevated surfaces
- **Popover**: White for dropdowns and overlays

### Secondary Colors
- **Secondary**: `hsl(142, 20%, 96%)` - Soft green-gray for subtle backgrounds
- **Muted**: `hsl(142, 15%, 95%)` - Light green-gray for disabled/inactive states
- **Accent**: `hsl(142, 40%, 92%)` - Lighter green for highlights and hover states

### Text Colors
- **Foreground**: `hsl(145, 15%, 15%)` - Dark green-gray for primary text (excellent readability)
- **Muted Foreground**: `hsl(145, 10%, 45%)` - Medium gray for secondary text

### Border & Input Colors
- **Border**: `hsl(142, 10%, 88%)` - Soft green-tinted borders
- **Input**: `hsl(142, 10%, 88%)` - Input field borders matching the theme

### Status Colors
- **Destructive**: Red `hsl(0, 84.2%, 60.2%)` - For errors and warnings (maintains medical alert standards)

## Usage Guidelines

### Primary Actions
Use `bg-primary` for main call-to-action buttons and important interactive elements.

### Secondary Elements
Use `bg-secondary` or `bg-muted` for subtle backgrounds, cards, and non-primary interactive elements.

### Text Hierarchy
- Use `text-foreground` for primary text
- Use `text-muted-foreground` for secondary/helper text
- Use `text-primary` for links and emphasized text

### Borders & Dividers
Use `border-border` for consistent, subtle borders throughout the interface.

## Accessibility

All color combinations meet WCAG AA contrast requirements:
- Primary green on white: ✅ 4.5:1+ contrast
- Dark text on white: ✅ 4.5:1+ contrast
- Primary green on white (buttons): ✅ 4.5:1+ contrast

## Dark Mode

Dark mode maintains the green theme with:
- Dark green-gray backgrounds
- Lighter green for primary actions
- Maintained contrast ratios for accessibility

