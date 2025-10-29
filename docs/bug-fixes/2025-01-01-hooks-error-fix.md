# React Hooks Error Fix

## Problem
The application was throwing a React Hooks error:
```
React has detected a change in the order of Hooks called by List. This will lead to bugs and errors if not fixed.
Previous render            Next render
------------------------------------------------------
1. useState                   useState
2. undefined                  useEffect
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

## Root Cause
In `src/view/List.tsx`, there was an early return statement (`if (hideComponent) return null;`) that was placed **after** some hooks but **before** other hooks. This violated the Rules of Hooks because:

1. `useState` was called first
2. Early return happened
3. `useEffect` was called conditionally (only when component wasn't hidden)

This caused hooks to be called in different orders between renders, which React doesn't allow.

## Solution
Moved all hook calls to the **beginning** of the component, before any conditional logic or early returns:

```typescript
const List = (props: Props) => {
  // Props destructuring
  const { hideComponent, selected, setSelected, chatUsers, setChatUsers, nickname, onSendMessage } = props;

  // ALL HOOKS CALLED FIRST - before any conditional logic
  const [contextMenu, setContextMenu] = React.useState<{...}>({...});
  
  React.useEffect(() => {
    // Event listener logic
  }, [contextMenu.visible]);

  // Early return AFTER all hooks have been called
  if (hideComponent) return null;

  // Rest of component logic...
};
```

## Rules of Hooks
The fix ensures compliance with React's Rules of Hooks:

1. ✅ **Only call hooks at the top level** - Never inside loops, conditions, or nested functions
2. ✅ **Always call hooks in the same order** - Hooks must be called in the same order every time
3. ✅ **Only call hooks from React functions** - Either React function components or custom hooks

## Key Changes
- Moved `useState` and `useEffect` to the top of the component
- Moved early return (`if (hideComponent) return null;`) after all hooks
- Removed duplicate `useEffect` that was causing confusion

## Result
- ✅ No more hooks order errors
- ✅ Component renders correctly
- ✅ All functionality preserved
- ✅ Build passes successfully

## Prevention
To prevent similar issues in the future:
1. Always call all hooks at the very beginning of components
2. Place conditional logic and early returns after all hook calls
3. Use ESLint rules for React hooks to catch these issues automatically
4. Follow the principle: "Hooks first, everything else second"
