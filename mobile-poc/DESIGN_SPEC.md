# Design Specification - Mobile App PoC

## UI/UX Flow Documentation

### Screen Layout

```
┌────────────────────────────────────────┐
│  GEARBOX                               │ ← Header (Blue #1976D2)
│  Inspection Checklist                  │
├────────────────────────────────────────┤
│ GENERATOR │ GEARBOX │ MAIN BEARING     │ ← Tabs (GEARBOX active)
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Gearbox make, model           !  │  │ ← Item (collapsed, has issue)
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Gearbox serial number         ✓  │  │ ← Item (collapsed, completed)
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │ Gearbox housing               !  │  │ ← Item (collapsed, has issue)
│  └──────────────────────────────────┘  │
│                                        │
│  ...more items...                      │
│                                        │
└────────────────────────────────────────┘
```

---

### Expanded Item View

When user clicks "Gearbox housing":

```
┌────────────────────────────────────────┐
│  ┌──────────────────────────────────┐  │
│  │ Gearbox housing               !  │  │ ← Header (Light Blue when expanded)
│  ├──────────────────────────────────┤  │
│  │                                  │  │
│  │ Inspection Point                 │  │
│  │ Check gearbox housing for        │  │
│  │ defects, wear, or damage         │  │
│  │                                  │  │
│  │ Select Keywords (max 3)          │  │
│  │ ┌─────────┐ ┌──────────┐         │  │
│  │ │ Cracks  │ │Corrosion │ [leak]  │  │ ← Keyword chips
│  │ └─────────┘ └──────────┘         │  │   (blue = selected, grey = unselected)
│  │                                  │  │
│  │ Severity Level                   │  │
│  │ ┌──────────┐ ┌──────────┐        │  │
│  │ │🟢 Normal │ │🟡 Warning│        │  │ ← Severity buttons
│  │ └──────────┘ └──────────┘        │  │   with color indicators
│  │ ┌────────────┐ ┌────────────┐    │  │
│  │ │🟠Progressed│ │🔴 Critical │    │  │
│  │ └────────────┘ └────────────┘    │  │
│  │                                  │  │
│  │ Generate Comment                 │  │
│  │ ┌──────────────┐ ┌─────────────┐ │  │
│  │ │⚡Quick Mode  │ │🎤Voice Mode │ │  │ ← Action buttons
│  │ └──────────────┘ └─────────────┘ │  │
│  │                                  │  │
│  │ Generated Comment:               │  │
│  │ ┌────────────────────────────┐   │  │
│  │ │ Gearbox housing exhibits   │   │  │ ← Comment display
│  │ │ Cracks and Corrosion.      │   │  │   (appears after generation)
│  │ │ Severity: Major...         │   │  │
│  │ └────────────────────────────┘   │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

---

### Voice Mode Modal

When user clicks "🎤 Voice Mode":

```
┌────────────────────────────────────────┐
│                                        │
│    ╔══════════════════════════════╗    │
│    ║  Voice Input                 ║    │
│    ╠══════════════════════════════╣    │
│    ║                              ║    │
│    ║  ┌─────────────────────────┐ ║    │
│    ║  │   🎤 Start Recording    │ ║    │ ← Initial state
│    ║  └─────────────────────────┘ ║    │
│    ║                              ║    │
│    ║  ┌─────────────────────────┐ ║    │
│    ║  │      Cancel             │ ║    │
│    ║  └─────────────────────────┘ ║    │
│    ║                              ║    │
│    ╚══════════════════════════════╝    │
│                                        │
└────────────────────────────────────────┘
```

**During Recording:**

```
┌────────────────────────────────────────┐
│                                        │
│    ╔══════════════════════════════╗    │
│    ║  Voice Input                 ║    │
│    ╠══════════════════════════════╣    │
│    ║                              ║    │
│    ║        🔴 Recording...       ║    │ ← Recording indicator
│    ║                              ║    │   (red dot + text)
│    ║                              ║    │
│    ╚══════════════════════════════╝    │
│                                        │
└────────────────────────────────────────┘
```

**After Recording (with transcript):**

```
┌────────────────────────────────────────┐
│                                        │
│    ╔══════════════════════════════╗    │
│    ║  Voice Input                 ║    │
│    ╠══════════════════════════════╣    │
│    ║                              ║    │
│    ║  Transcript:                 ║    │
│    ║  ┌────────────────────────┐  ║    │
│    ║  │ Housing shows visible  │  ║    │ ← Editable transcript
│    ║  │ cracks on outer surface│  ║    │
│    ║  │ near mounting flange   │  ║    │
│    ║  └────────────────────────┘  ║    │
│    ║                              ║    │
│    ║  ┌─────────────────────────┐ ║    │
│    ║  │ Convert to Full Comment │ ║    │ ← Primary action (blue)
│    ║  └─────────────────────────┘ ║    │
│    ║  ┌─────────────────────────┐ ║    │
│    ║  │      Re-record          │ ║    │ ← Secondary (grey)
│    ║  └─────────────────────────┘ ║    │
│    ║  ┌─────────────────────────┐ ║    │
│    ║  │      Cancel             │ ║    │
│    ║  └─────────────────────────┘ ║    │
│    ║                              ║    │
│    ╚══════════════════════════════╝    │
│                                        │
└────────────────────────────────────────┘
```

---

## Component Specifications

### 1. ChecklistItem Component

**Props:**
- `item`: ChecklistItemType
- `onUpdate`: (itemId, keywords, severity) => void

**States:**
- `isExpanded`: boolean
- `selectedKeywords`: string[]
- `selectedSeverity`: SeverityLevel | null
- `generatedComment`: string

**Behavior:**
- Click to expand/collapse
- Background changes when expanded (light blue)
- Shows status indicator (✓ or !)

---

### 2. KeywordSelector Component

**Props:**
- `keywords`: string[]
- `selectedKeywords`: string[]
- `onToggle`: (keyword) => void

**Design:**
- Chips displayed in a row (flex-wrap)
- Unselected: White background, grey border
- Selected: Blue background (#2196F3), white text
- Disabled (when 3 selected): Opacity 0.4
- Max 3 keywords selectable

**Dimensions:**
- Chip padding: 16px horizontal, 10px vertical
- Chip border radius: 20px
- Font size: 14px
- Gap between chips: 8px

---

### 3. SeverityPicker Component

**Props:**
- `severityLevels`: SeverityLevel[]
- `selectedSeverity`: SeverityLevel | null
- `onSelect`: (severity) => void

**Design:**
- 4 buttons in 2x2 grid
- Each button shows:
  - Color indicator dot (12px diameter)
  - Severity label
- Unselected: White background, grey border (2px)
- Selected: Light grey background, colored border (3px)

**Colors:**
- Normal: #4CAF50 (Green)
- Warning: #FFC107 (Yellow)
- Progressed: #FF9800 (Orange)
- Critical: #F44336 (Red)

**Dimensions:**
- Button min-width: 100px
- Button padding: 14px horizontal, 10px vertical
- Border radius: 8px
- Font size: 14px

---

### 4. CommentGenerator Component

**Props:**
- `itemTitle`: string
- `selectedKeywords`: string[]
- `selectedSeverity`: SeverityLevel | null
- `onCommentGenerated`: (comment) => void

**Design:**

**Quick Mode Button:**
- Background: #2196F3 (Blue)
- Icon: ⚡ (20px)
- Text: "Quick Mode"
- Disabled state: Grey (#BDBDBD)
- Enabled when: keywords.length > 0 AND severity !== null

**Voice Mode Button:**
- Background: #4CAF50 (Green)
- Icon: 🎤 (20px)
- Text: "Voice Mode"
- Always enabled

**Dimensions:**
- Button height: 44px
- Button border radius: 8px
- Buttons side-by-side with 12px gap
- Font size: 14px, weight: 600

---

### 5. Voice Modal

**Layout:**
- Full-screen overlay with semi-transparent background
- Centered white card (max-width: 400px)
- Border radius: 16px
- Padding: 24px

**Recording State:**
- Red dot (12px) + "Recording..." text
- Centered in modal
- Text color: #F44336 (Red)

**Transcript Input:**
- Multiline text input
- Min height: 100px
- Border: 1px solid #E0E0E0
- Border radius: 8px
- Padding: 12px

**Buttons:**
- "Convert to Full Comment": Blue (#2196F3)
- "Re-record": Light grey (#EEEEEE)
- "Cancel": Light grey (#EEEEEE)
- Full width buttons with 12px gap

---

## Interaction States

### State 1: Collapsed Item
- Grey background (#F5F5F5)
- Status indicator (right side)
- Click anywhere to expand

### State 2: Expanded Item
- Light blue background (#E3F2FD)
- All interaction elements visible
- Top border separates from content

### State 3: Keyword Selection
- 0 keywords: All chips available
- 1-2 keywords: All chips still available
- 3 keywords: Unselected chips become disabled (opacity 0.4)

### State 4: Severity Selection
- No severity: All buttons available
- Severity selected: Selected button has thicker border

### State 5: Quick Mode
- **Disabled**: No keywords OR no severity selected
- **Enabled**: At least 1 keyword AND severity selected
- **Generating**: Immediate feedback (no loading state needed for PoC)

### State 6: Voice Mode
- **Idle**: "Start Recording" button
- **Recording**: Red dot + "Recording..." (2 seconds)
- **Transcript Ready**: Show text + "Convert" button
- **Generating**: Loading spinner on "Convert" button (1.5 seconds)

---

## Color Palette

### Primary Colors
- **App Primary**: #1976D2 (Dark Blue - Header)
- **Interactive Blue**: #2196F3 (Buttons, selected items)
- **Success Green**: #4CAF50 (Voice button, Normal severity)

### Severity Colors
- **Normal**: #4CAF50 (Green)
- **Warning**: #FFC107 (Yellow)
- **Progressed**: #FF9800 (Orange)
- **Critical**: #F44336 (Red)

### Neutral Colors
- **Dark Text**: #212121
- **Medium Text**: #616161
- **Light Text**: #757575
- **Border**: #E0E0E0
- **Background**: #F5F5F5
- **Card Background**: #FFFFFF
- **Disabled**: #BDBDBD

---

## Typography

### Font Sizes
- **Header Title**: 24px, weight 700
- **Header Subtitle**: 14px
- **Item Title**: 16px, weight 600
- **Section Label**: 14px, weight 600
- **Body Text**: 14px
- **Button Text**: 14px, weight 600
- **Tab Text**: 12px, weight 600

### Font Family
- System default (San Francisco on iOS, Roboto on Android)

---

## Spacing System

### Padding
- **Screen edges**: 12px
- **Card padding**: 16px
- **Modal padding**: 24px
- **Button padding**: 14px horizontal, 10-12px vertical

### Margins
- **Between sections**: 16px
- **Between elements**: 8-12px
- **Section label margin**: 8px bottom

### Gaps
- **Keyword chips**: 8px
- **Severity buttons**: 8px
- **Action buttons**: 12px

---

## Animation & Transitions

### Expand/Collapse
- Duration: 300ms
- Easing: easeInEaseOut
- Uses `LayoutAnimation.Presets.easeInEaseOut`

### Modal
- Appears from bottom (slide)
- Semi-transparent overlay fades in

### Button Press
- Opacity: 0.7 on press
- Native feedback

---

## Accessibility

- All touchable elements have minimum 44x44px touch target
- Color is not the only indicator (text labels present)
- Sufficient contrast ratios:
  - Text on white: #212121 (16:1)
  - Text on blue: #FFFFFF (4.5:1)
- Supports dynamic type (scales with system font size)

---

**Version**: 1.0
**Last Updated**: 2025-12-31
