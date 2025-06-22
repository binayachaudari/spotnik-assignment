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

## Getting Started

### 1. Environment Setup

First, copy the example environment file:

```bash
cp .env.example .env
```

Then open the `.env` file and add your Monday.com credentials:

```env
VITE_MONDAY_API_KEY=your_actual_api_token_here
VITE_MONDAY_BOARD_ID=your_board_id_number_here
```

**Getting your API token:**

1. Go to your Monday.com account settings > Developer section
2. Create a new token with "boards:read" and "boards:write" permissions
3. Copy the token and paste it in your `.env` file

**Finding your board ID:**

1. Open the Monday.com board you want to use
2. Look at the URL - it'll be something like `https://yourcompany.monday.com/boards/1234567890`
3. That number (1234567890) is your board ID

### 2. Install and run

```bash
yarn install
yarn dev
```

That's it! The form should load and automatically pull your board structure.

## How it works

The form automatically fetches your board schema from Monday.com and creates the appropriate input fields. Here's the basic flow:

1. On load, it fetches your board columns and their types
2. Creates form inputs based on each column type
3. Validates inputs as you type
4. Submits the data to Monday.com when you hit create
5. Shows a success message and resets for the next item

## Project Structure

```
src/
├── components/ItemForm/
│   ├── ItemForm.tsx          # Main form component
│   └── ColumnInput.tsx       # Handles different column types
├── hooks/
│   └── useMondayData.ts      # Custom hooks for Monday.com API
├── services/
│   └── mondayService.ts      # Monday.com API calls
└── config/
    └── monday.ts             # Configuration
```

## Supported Column Types

| Monday.com Column | What it creates                           |
| ----------------- | ----------------------------------------- |
| Text              | Text input with character limit           |
| Numbers           | Number input with validation              |
| Status            | Dropdown with your board's status options |
| Date              | Date picker                               |

## Technical Notes

Built with:

- React + TypeScript
- Monday.com Vibe Design System
- React Query for API state management
- Tailwind CSS for styling

The form uses custom hooks to separate the Monday.com API logic from the UI components. All the API calls are handled through React Query, so you get caching and loading states for free.

## Troubleshooting

**Form not loading?**

- Check your API token has the right permissions
- Make sure your board ID is correct
- Open browser dev tools to see any console errors

**Dropdown not showing options?**

- This happens when your status column doesn't have any options set up in Monday.com
- Go to your board and add some status options to that column

## Contributing

If you want to add support for more column types or fix bugs, feel free to open a pull request. The code is pretty straightforward - most of the logic is in `ColumnInput.tsx` where different column types are handled.
