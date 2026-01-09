# Kiosk Mode - Quick Start Guide

## 🚀 Getting Started in 2 Minutes

### Step 1: Start the Development Server

```bash
npm run dev
```

### Step 2: Test Kiosk Mode

Open your browser with a kiosk_id parameter:

```
http://localhost:5173?kiosk_id=QR123456
```

**That's it!** The app will now:
- ✅ Detect kiosk mode
- ✅ Load products for that specific kiosk
- ✅ Show a locked, full-screen interface

---

## 🧪 Test URLs

### Working Kiosk IDs (Mock Data):

| Kiosk ID | Products | URL |
|----------|----------|-----|
| `QR123456` | Tea products (European) | `?kiosk_id=QR123456` |
| `QR789012` | Coffee products (American) | `?kiosk_id=QR789012` |
| `FULL_CATALOG` | All products | `?kiosk_id=FULL_CATALOG` |

### Error Testing:

```bash
# Invalid kiosk → Shows error
http://localhost:5173?kiosk_id=INVALID

# No kiosk_id → Normal mode (default products)
http://localhost:5173
```

---

## 📱 Expected Behavior

### ✅ Valid Kiosk ID:
1. Shows "Loading Kiosk..." spinner
2. Fetches catalog (mock data for now)
3. Displays products for that kiosk only
4. Full-screen, touch-friendly UI

### ❌ Invalid Kiosk ID:
1. Shows error screen: "Kiosk Not Found"
2. Offers retry button
3. All interactions disabled

### 🔄 No Kiosk ID:
1. Runs in normal mode
2. Shows default product catalog
3. Backward compatible with existing app

---

## 🔧 Configuration

### Using Mock Data (Current Default):

The app uses hardcoded mock catalogs for testing. No backend needed!

**File:** `src/index.tsx`
```typescript
<KioskProvider useMockData={true}>  // ✅ Using mock data
```

### Switching to Real API:

1. **Update flag:**
   ```typescript
   <KioskProvider useMockData={false}>  // ❌ Using real API
   ```

2. **Set API URL** in `src/lib/kioskApi.ts`:
   ```typescript
   const apiUrl = 'https://api.yourdomain.com';
   ```

3. **Backend endpoint must return:**
   ```json
   GET /api/catalog?kiosk_id=QR123456
   
   {
     "kioskId": "QR123456",
     "kioskName": "Main Lobby",
     "products": [...]
   }
   ```

---

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `src/index.tsx` | Entry point - detects kiosk mode |
| `src/contexts/KioskContext.tsx` | Manages kiosk state |
| `src/lib/kioskApi.ts` | API calls & mock data |
| `src/lib/urlUtils.ts` | URL parameter parsing |
| `src/components/KioskModeWrapper.tsx` | Handles loading/error states |

---

## 🐛 Troubleshooting

### Issue: Shows default products, not kiosk catalog
**Fix:** Check URL has `?kiosk_id=XXX` parameter

### Issue: Stuck on loading screen
**Fix:** Check browser console for errors

### Issue: "Kiosk not found" error
**Fix:** Use a valid mock kiosk ID (see test URLs above)

---

## 📖 Full Documentation

For complete details, see [KIOSK_MODE_GUIDE.md](./KIOSK_MODE_GUIDE.md)

---

## ✅ What's Implemented

- [x] URL parameter detection (`kiosk_id`)
- [x] Kiosk validation
- [x] Dynamic catalog loading
- [x] Error states with retry
- [x] Loading states
- [x] Mock data for testing
- [x] Backward compatibility (normal mode)
- [x] Full-screen kiosk UI

## ⏳ Not Yet Implemented

- [ ] Real backend API integration
- [ ] Payment processing
- [ ] User authentication
- [ ] Analytics tracking
- [ ] Admin dashboard

---

**Happy Testing! 🎉**

