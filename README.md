# Monday.com Item Creation Form

A React form that lets you create items directly in your Monday.com boards. Built with their Vibe design system, so it feels right at home with the Monday.com experience.

## What it does

This form automatically pulls your board structure from Monday.com and creates input fields for each column. Currently supports:

- **Text fields** - regular text with validation
- **Numbers** - with proper numeric validation
- **Status dropdowns** - pulls your actual status options from the board
- **Date pickers** - using Monday's own date picker component
- **Item names** - the main item title field

The form validates everything in real-time and shows you exactly what went wrong if something's not right. When you successfully create an item, it shows you a confirmation with the item name and resets the form for the next one.

### 🎯 Context-Driven State Management

- **AppContext** - Global application state (loading, errors, notifications)
- **FormContext** - Form-specific state with validation logic
- Clean separation between global and feature-specific state

### 🪝 Custom Hooks Pattern

- **useToast** - Toast notification management
- **useFormSubmit** - Form submission logic with error handling
- **useMondayData** - Monday.com API interactions with React Query
- Reusable logic extracted from components

### 🧩 Component Composition

- **Presentational Components** - Pure UI components (FormField, LoadingSpinner)
- **Container Components** - Logic-heavy components using contexts
- **Memoized Components** - Performance-optimized with React.memo

## 📁 Project Structure

```
src/
├── components/
│   ├── forms/                    # Reusable form components
│   │   ├── FormField.tsx         # Context-aware form field
│   │   ├── FormActions.tsx       # Submit buttons and actions
│   │   └── index.ts              # Barrel exports
│   ├── ItemForm/                 # Feature-specific components
│   │   ├── ItemForm.tsx          # Main form with providers
│   │   ├── ColumnInput.tsx       # Monday.com column renderer
│   │   └── index.ts
│   └── ui/                       # Reusable UI components
│       ├── ToastNotification.tsx # Global toast component
│       ├── LoadingSpinner.tsx    # Loading states
│       ├── ErrorMessage.tsx      # Error displays
│       └── index.ts
├── contexts/                     # React Context providers
│   ├── AppContext.tsx            # Global app state
│   ├── FormContext.tsx           # Form state with validation
│   └── index.ts
├── hooks/                        # Custom hooks
│   ├── useMondayData.ts          # API hooks
│   ├── useFormSubmit.ts          # Form submission logic
│   ├── useToast.ts               # Toast management
│   └── index.ts
├── services/                     # Business logic layer
│   └── mondayService.ts          # Monday.com API service
├── config/                       # Configuration
│   └── monday.ts                 # Monday.com config
└── constants/                    # App constants
    └── queryKeys.ts              # React Query keys
```

## 🚀 Getting Started

### 1. Environment Setup

```bash
# Clone and install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Add your Monday.com credentials to `.env`:

```env
VITE_MONDAY_API_KEY=your_api_token_here
VITE_MONDAY_BOARD_ID=your_board_id_here
```

### 2. Getting Monday.com Credentials

**API Token:**

1. Monday.com → Profile → Developer → Create new token
2. Grant `boards:read` and `boards:write` permissions
3. Copy token to your `.env` file

**Board ID:**

1. Open your Monday.com board
2. Extract ID from URL: `https://yourcompany.monday.com/boards/1234567890`
3. Use `1234567890` as your board ID

### 3. Run the Application

```bash
npm run dev
```

## 🔧 Development Patterns

## 📚 Supported Column Types

| Monday Column | Component Used     | Validation             |
| ------------- | ------------------ | ---------------------- |
| Text          | TextField          | Character limits       |
| Numbers       | TextField (number) | Numeric validation     |
| Status        | Dropdown           | Required selection     |
| Date          | DatePicker         | Date format validation |
| Custom        | Extensible         | Custom validation      |

## 🛠️ Extending the Application

### Adding New Column Types

1. **Update service layer** in `mondayService.ts`
2. **Add component** to `ColumnInput.tsx`
3. **Include validation** in FormContext
4. **Update TypeScript types**

---

Built with ❤️ using React, TypeScript, and Monday.com Vibe Design System
