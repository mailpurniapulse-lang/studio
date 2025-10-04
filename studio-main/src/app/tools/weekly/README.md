# Weekly Timetable Component

This is a React component for creating weekly timetables. It can be easily integrated into any React/Next.js application.

## File Structure
```
weekly/
  ├── components/
  │   ├── TimetableGrid.tsx
  │   ├── ControlPanel.tsx
  │   └── SubjectModal.tsx
  ├── lib/
  │   ├── types.ts
  │   ├── subjects.ts
  │   └── timeUtils.ts
  └── page.tsx
```

## Required Dependencies
```json
{
  "dependencies": {
    "lucide-react": "^0.453.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

## Required UI Components
Make sure you have these shadcn/ui components:
- card
- label
- input
- button
- checkbox
- select
- dialog
- toast

## Usage
1. Copy this folder to your project
2. Import and use the component:
```tsx
import Timetable from './weekly/page';

export default function YourPage() {
  return <Timetable />;
}
```
