# ANTIGRAVITY MIGRATION PROMPT

Paste this entire prompt into Antigravity to automate dashboard integration.

---

## CONTEXT

I have a chatbot application that needs dashboard integration. I have a migration package (`_DASHBOARD_MIGRATION_V2`) containing all necessary dashboard files and a working chatbot codebase that needs these features added.

## YOUR TASK

Integrate the dashboard feature from `_DASHBOARD_MIGRATION_V2` into the main chatbot codebase, following the persistent app shell architecture pattern.

---

## PHASE 1: Copy Dashboard Files

Copy these folders from `_DASHBOARD_MIGRATION_V2/1_COPY_AS_IS/` to the root of the chatbot codebase (create folders if they don't exist):

1. **types/** → Copy `dashboard-types.ts`
2. **constants/** → Copy `dashboard-data.ts` (merge if folder exists)
3. **services/** → Copy `dashboard-ai.ts` (create folder if needed)
4. **components/dashboard/** → Copy all 8 dashboard component files
5. **layouts/** → Copy `AppShell.tsx` and `MobileShell.tsx`
6. **pages/** → Copy `ChatPage.tsx` and `MobileChatPage.tsx`

These files are standalone and won't conflict with existing code.

---

## PHASE 2: Update package.json

Add these dependencies to `package.json`:
```json
"dependencies": {
  "react-router-dom": "^6.20.0",
  "recharts": "^2.10.0",
  "lucide-react": "^0.300.0"
}
```

Then run: `npm install --legacy-peer-deps`

---

## PHASE 3: Refactor App.tsx for Routing

**CRITICAL:** The current `App.tsx` needs to be refactored to use React Router. Reference the file at `_DASHBOARD_MIGRATION_V2/2_MANUAL_MERGE/App.tsx` for the pattern.

### Current Structure (Typical):
```typescript
const App = () => {
  // All state management here
  const [sessions, setSessions] = useState([]);
  // ... more state
  
  return isMobile ? <MobileLayout {...props} /> : <DesktopLayout {...props} />;
};
```

### New Structure (Target):
```typescript
// Desktop routing function
const App = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return <MobileApp />; // Contains mobile routing
  }
  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<ChatPage />} />
          <Route path="/dashboard" element={<DeepDiveDashboard isDarkMode={true} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
```

### Key Actions:
1. **Extract chat-specific UI** from `DesktopLayout.tsx` and move to `ChatPage.tsx` (if not already done)
2. **Move all state management** from `App.tsx` to `AppShell.tsx`
3. **Update imports:** Add `react-router-dom` imports
4. **Keep existing functionality:** Ensure all current features (modals, sessions, etc.) still work

**Mobile Routing:** Create `MobileApp` component that uses `BrowserRouter` → `MobileShell` → routes for `/` and `/dashboard`

---

## PHASE 4: Update Sidebar.tsx for Navigation

Reference: `_DASHBOARD_MIGRATION_V2/2_MANUAL_MERGE/Sidebar.tsx`

### Add these imports:
```typescript
import { useLocation, useNavigate } from 'react-router-dom';
```

### Inside the Sidebar component:
```typescript
const location = useLocation();
const navigate = useNavigate();
```

### Update Dashboard button (find the NavButton for Dashboard):
```typescript
<NavButton
  onClick={() => navigate('/dashboard')}
  icon={LayoutGrid}  // or whatever icon is used
  label="Dashboard"
  theme={theme}
  collapsed={isCollapsed}
  isActive={location.pathname === '/dashboard'}
/>
```

### Update Chat button:
```typescript
<NavButton
  // ... other props
  isActive={location.pathname === '/'}
/>
```

---

## PHASE 5: Verify Architecture

Ensure this structure is in place:

### Desktop:
```
App (Router logic)
└── BrowserRouter
    └── AppShell (Persistent, contains sidebar & all state)
        └── Outlet (Swaps between routes)
            ├── ChatPage (route: /)
            └── DeepDiveDashboard (route: /dashboard)
```

### Mobile:
```
MobileApp (in App.tsx)
└── BrowserRouter
    └── MobileShell (Persistent, contains sidebar drawer)
        └── Outlet (Swaps between routes)
            ├── MobileChatPage (route: /)
            └── DeepDiveDashboard (route: /dashboard, wrapped in mobile styles)
```

---

## PHASE 6: Handle State Context

**AppShell** must pass state to child routes via `<Outlet context={{...}} />`

**ChatPage** and **MobileChatPage** receive state via:
```typescript
const { state, handlers } = useOutletContext<ContextType>();
```

Ensure all chat state (sessions, messages, modals, etc.) flows correctly.

---

## IMPORTANT NOTES

1. **Sidebar Persistence:** The sidebar must live in `AppShell`/`MobileShell`, NOT in the route components
2. **Dark Mode:** Dashboard components use hardcoded dark colors (`bg-[#101010]`, `bg-[#0a0a0a]`), no `dark:` modifiers needed
3. **Mobile Input:** `MobileChatPage` has a fixed input box at the bottom with proper spacing
4. **Existing Features:** Preserve ALL current chatbot functionality (modals, sessions, themes, etc.)

---

## TESTING CHECKLIST

After integration, verify:
- [ ] http://localhost:3000/ loads the chat page
- [ ] http://localhost:3000/dashboard loads the dashboard
- [ ] Clicking "Dashboard" in sidebar navigates correctly
- [ ] Clicking "Chat" returns to chat page
- [ ] Sidebar stays mounted during navigation
- [ ] Active route is highlighted in sidebar
- [ ] Mobile view works (test at 375px width)
- [ ] All existing chatbot features still work

---

## ERROR HANDLING

If you encounter errors:

### "useLocation() may be used only in the context of a <Router>"
- **Fix:** Ensure `BrowserRouter` wraps both desktop and mobile layouts

### Import errors for dashboard components
- **Fix:** Check that paths match: `../../constants/dashboard-data`, `../../services/dashboard-ai`

### Type errors in context
- **Fix:** Ensure the interface in `ChatPage.tsx` matches what `AppShell` passes via Outlet

### Styling looks wrong
- **Fix:** Dashboard should always be dark. Check that components use hardcoded colors, not Tailwind `dark:` modifiers

---

## DELIVERABLES

When complete:
1. All files from `1_COPY_AS_IS` should be in the codebase
2. `App.tsx`, `Sidebar.tsx`, `package.json` should be updated with routing
3. Application runs without errors
4. Both `/` and `/dashboard` routes work
5. Navigation is functional on desktop and mobile

**DO NOT:**
- Remove any existing chatbot functionality
- Change the styling of the existing chat page
- Modify dashboard component colors (they're already correct)

**DO:**
- Preserve all current features while adding routing
- Test both desktop (>768px) and mobile (<768px) views
- Ensure smooth navigation between Chat and Dashboard
