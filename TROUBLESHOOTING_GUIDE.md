# MKTify · Troubleshooting Guide

## 🔍 **Issue: "No funciona" (App doesn't work)**

This guide helps diagnose and fix the most common problems when MKTify doesn't work as expected.

---

## 1. **Page Won't Load / Blank Screen**

### Symptoms:
- Page shows nothing or just the landing shell
- White screen of death
- Nothing happens after opening index.html

### Possible Causes & Fixes:

#### A. **Console Errors**
1. Press **F12** to open Developer Tools
2. Click the **Console** tab
3. Note any red error messages
4. Common errors:
   - `ReferenceError: MKT is not defined`
   - `Cannot read property 'addEventListener' of null`
   - `Script error.`

#### B. **Script Loading Order**
The HTML must load scripts in this order:
- `data.js` (demo data) → first
- `app.js` (core logic) → second
- Make sure both `<script src="assets/data.js"></script>` and `<script src="assets/app.js"></script>` exist in the HTML

**Fix**: Verify both script tags are present near the bottom of index.html

#### C. **DOM Content Loaded**
The app initializes on `DOMContentLoaded`. If scripts load before the HTML parser completes, elements may not exist yet.

**Fix**: Ensure index.html renders fully before scripts execute

---

## 2. **Login Doesn't Work**

### Symptoms:
- Clicking "Empezar gratis" or "Ingresar" does nothing
- Page stays on landing
- Error messages appear

### Possible Causes & Fixes:

#### A. **localStorage Full or Disabled**
The app uses `localStorage` to persist state between sessions.

**Test**: In the browser console (F12 → Console), type:
```javascript
localStorage.setItem('test', '1')
```
If this fails, localStorage is blocked/disabled.

**Fix**: 
- Clear browser storage: `localStorage.clear()`
- Try a different browser
- Check browser privacy settings

#### B. **Auth State Protection**
After login, the app checks `state.loggedIn` and shows the app shell.

**Test**: Open console and type:
```javascript
window.MKT.state.loggedIn
```
Should return `true` after login.

**Fix**: 
- If `false`, the navigation protection is blocking
- Try navigating directly: `location.hash = 'home'`

#### C. **Hash Route Not Matching**
The app uses URL hashes for navigation: `#home`, `#clientes`, etc.

**Test**: After login, check the URL bar should have `#home` or similar.

**Fix**: 
- Manually set: `location.hash = 'home'`
- Or click the MKTify logo to go home

---

## 3. **Data Disappears After Refresh**

### Symptoms:
- Create a client/campaign
- Refresh the page
- Data is gone

### Possible Causes & Fixes:

#### A. **localStorage Persistence Not Working**
The app saves to `localStorage` under key `mktify-state-v2`.

**Test**: In console:
```javascript
localStorage.getItem('mktify-state-v2')
```
Should return a JSON string after creating data.

**Fix**: 
- Check if private browsing mode is on (disables localStorage)
- Check if storage quota is exceeded
- Try: `localStorage.clear()` then recreate data

#### B. **Storage Key Mismatch**
Old versions used different storage keys.

**Fix**: The current key is `mktify-state-v2`. If you had data from an older version, it may not be found. Try clearing storage.

---

## 4. **Sidebar/Menu Doesn't Toggle**

### Symptoms:
- Mobile menu doesn't open/close
- Sidebar stays fixed in one position

### Possible Causes & Fixes:

#### A. **Breakpoint Misunderstanding**
The sidebar collapses automatically at `< 980px` width.

**Fix**: 
- Resize browser window smaller than 980px
- Click the hamburger menu (☰) icon in the topbar
- Or swipe/press the menu toggle

#### B. **CSS Not Loading**
Ensure `assets/styles.css` is referenced correctly in index.html.

---

## 5. **Charts Don't Render**

### Symptoms:
- Revenue charts show empty or broken
- Sparklines don't appear

### Possible Causes & Fixes:

#### A. **Chart Element Missing**
The charts look for specific HTML elements: `#homeRevenue`, `reportRevenue`.

**Fix**: 
- Ensure you're on the home view (`#view-home`)
- The revenue chart only renders on the home dashboard

#### B. **Data Array Empty**
Charts need data arrays to display.

**Fix**: 
- Create some clients/campaigns first
- The charts use demo data from `data.js`

---

## 6. **Forms Don't Submit**

### Symptoms:
- Client form doesn't create new client
- Campaign form doesn't create new campaign
- No error messages, just doesn't work

### Possible Causes & Fixes:

#### A. **JavaScript Errors Prevent Execution**
If there's a syntax error earlier in app.js, later code may not run.

**Fix**: 
- Check the Console tab for any red errors
- Fix the first error, then test again

#### B. **Required Fields Not Filled**
Forms have validation for required fields:
- Client: Name + Phone are required
- Campaign: Name is required
- Project: Name is required

**Fix**: 
- Fill all required fields (marked with `*`)
- Check the form for red border indicators

---

## 7. **Quick Diagnostic Commands**

Open the browser console (F12 → Console) and try these:

```javascript
// Check if MKTify loaded
window.MKT !== undefined  // Should be: true

// Check if data loaded
window.MKT.data !== undefined  // Should be: true

// Check state
window.MKT.state.loggedIn  // Should be: false (before login)

// Test localStorage
try { localStorage.setItem('test', '1'); alert('localStorage OK'); } 
catch(e) { alert('localStorage blocked: ' + e.message); }

// Check if app initialized
window.MKT !== undefined && window.MKT.initials  // Should work if initialized
```

---

## 8. **Browser Compatibility**

### Tested Browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ⚠️ Safari (may have localStorage issues)
- ❌ Internet Explorer 11 (not supported - too old)

### Try:
- A different browser
- Updating your current browser
- Incognito/Private mode (may reset localStorage)

---

## 7. **Fresh Start - Clear All Data**

If the app is in a broken state, do this:

1. **Clear browser storage**:
   - F12 → Application → Local Storage → Clear site data
   - Or: `localStorage.clear()` in console

2. **Refresh the page**

3. **Start fresh**:
   - Land on landing page
   - Click "Empezar gratis"
   - Create clients/campaigns new

---

## 📱 **Mobile-Specific Issues**

### Sidebar on Mobile:
- Width < 980px triggers mobile sidebar
- Use the ☰ menu button in the topbar
- Swipe from left or press the toggle button

### Touch Targets:
- All buttons should be ≥ 44px tall
- If touching doesn't register, try a different browser
- Zoom may interfere with touch events

---

## 🆘 **If None of the Above Works**

Please provide me with:

1. **Browser name and version** (Chrome 120, Firefox 125, etc.)
2. **Operating System** (Windows 10, macOS, Linux, Android, iOS)
3. **Exact error messages** from the browser console (F12 → Console)
4. **What you were doing** when it broke (login, creating client, resizing, etc.)
5. **Screenshots** if possible

With this information, I can pinpoint the exact issue and provide a targeted fix.

---

## ✅ **Quick Fix Checklist**

[ ] Press F12 → Check Console tab for errors
[ ] Try Ctrl+F5 (hard refresh)
[ ] Try `localStorage.clear()` in console then refresh
[ ] Try a different browser (Chrome recommended)
[ ] Resize window < 980px for mobile menu
[ ] Fill all required form fields (marked with *)
[ ] Check URL hash: should have `#home` after login
[ ] Verify both script tags exist in index.html
[ ] Click MKTify logo to return home

---

**Most common fix**: Clear localStorage (`localStorage.clear()` in console) then refresh the page. This resets the app state and often resolves persistence-related issues.

---

*If you still can't get MKTify working after trying these steps, please provide the diagnostic information above and I'll help you further.*