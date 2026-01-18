# Dashboard Migration Package v2

## 📦 Package Contents

This migration package contains all files needed to integrate the dashboard feature into a new chatbot codebase.

### Folder Structure

```
_DASHBOARD_MIGRATION_V2/
├── 1_COPY_AS_IS/              # Files to copy directly (no conflicts)
│   ├── types/
│   │   └── dashboard-types.ts
│   ├── constants/
│   │   └── dashboard-data.ts
│   ├── services/
│   │   └── dashboard-ai.ts
│   ├── components/dashboard/  # All 8 dashboard components
│   ├── layouts/               # AppShell.tsx, MobileShell.tsx
│   └── pages/                 # ChatPage.tsx, MobileChatPage.tsx
│
├── 2_MANUAL_MERGE/            # Reference files for manual merge
│   ├── App.tsx
│   ├── Sidebar.tsx
│   └── package.json
│
└── 3_INSTRUCTIONS/            # This README and migration prompt
    ├── README.md
    └── ANTIGRAVITY_PROMPT.md
```

---

## 🎯 Quick Start

1. **Copy files from `1_COPY_AS_IS/`** to your new chatbot codebase (maintaining folder structure)

2. **Install dependencies:**
   ```bash
   npm install react-router-dom recharts lucide-react --legacy-peer-deps
   ```

3. **Use the Antigravity prompt** in `3_INSTRUCTIONS/ANTIGRAVITY_PROMPT.md` to automate the merging process

---

## 📋 What This Migration Adds

### Features
- ✅ Dashboard page with analytics and metrics
- ✅ React Router for navigation between Chat and Dashboard
- ✅ Persistent sidebar (never unmounts during navigation)
- ✅ Full mobile support with dedicated routing
- ✅ Dark mode styling throughout

### Architecture
- **Desktop:** `BrowserRouter` → `AppShell` → `Outlet` (routes: `/` and `/dashboard`)
- **Mobile:** `BrowserRouter` → `MobileShell` → `Outlet` (same routes)
- **State Management:** Lifted to shells, passed via `useOutletContext()`

---

## 🔧 Dependencies Required

Add to `package.json` dependencies:
```json
{
  "react-router-dom": "^6.20.0",
  "recharts": "^2.10.0",
  "lucide-react": "^0.300.0"
}
```

---

## 📝 Manual Merge Guide

### Files That Need Merging

#### 1. `App.tsx`
- **Reference:** `2_MANUAL_MERGE/App.tsx`
- **Changes:** Routing structure with `BrowserRouter` and nested routes
- **Strategy:** Keep new UI features, apply routing structure

#### 2. `components/Sidebar.tsx`
- **Reference:** `2_MANUAL_MERGE/Sidebar.tsx`
- **Changes:** Added `useLocation`, `useNavigate`, dashboard navigation
- **Strategy:** Merge navigation hooks and button updates

#### 3. `package.json`
- **Reference:** `2_MANUAL_MERGE/package.json`
- **Changes:** Added 3 dependencies
- **Strategy:** Add dependencies to existing file

---

## 🤖 Using Antigravity

The `ANTIGRAVITY_PROMPT.md` file contains a complete prompt you can paste into Antigravity to automate the migration.

**To use it:**
1. Place your new chatbot codebase and this `_DASHBOARD_MIGRATION_V2` folder in the same workspace
2. Open Antigravity
3. Copy and paste the entire content of `ANTIGRAVITY_PROMPT.md`
4. Antigravity will handle the integration automatically

---

## ✅ Testing Checklist

After migration, verify:
- [ ] Chat page loads at `/`
- [ ] Dashboard loads at `/dashboard`
- [ ] Sidebar navigation works (Chat ↔ Dashboard)
- [ ] Sidebar persists during navigation
- [ ] Active route highlighting works
- [ ] Mobile view works for both routes
- [ ] New UI features from cofounder still work
- [ ] No console errors

---

## 🆘 Need Help?

Common issues and solutions are documented in the Antigent prompt. If you encounter problems:

1. Check import paths match new file locations
2. Verify `BrowserRouter` wraps the entire app
3. Ensure context types match between shells and pages
4. Dashboard uses hardcoded dark colors (no `dark:` classes needed)
