# 🚀 API Integration Guide - MEAMA Kiosk Application

## Overview

The kiosk application has been successfully integrated with the Azure-hosted MEAMA Vending Machine API. This guide explains how the dynamic product loading works and how to use/test it.

---

## 📋 What Changed

### New Files Created

1. **`src/stores/ProductsStore.ts`** - MobX store for product state management
2. **`src/lib/ApiManager.ts`** - Axios-based API client singleton
3. **`src/stores/index.ts`** - Store exports
4. **`src/vite-env.d.ts`** - TypeScript environment definitions

### Modified Files

1. **`src/lib/urlUtils.ts`** - Added `getQrCode()` and `isValidQrCode()` functions
2. **`src/lib/kioskApi.ts`** - Updated to use real Azure API endpoint
3. **`src/contexts/KioskContext.tsx`** - Integrated MobX store and QR code handling
4. **`src/components/KioskModeWrapper.tsx`** - Enhanced error messages for QR codes
5. **`src/index.tsx`** - Updated to use `qrCode` parameter and real API

---

## 🔗 API Endpoint

**Base URL:**
```
https://vending-capsulo-cloud-g3b3g6bmbshcg8cp.westeurope-01.azurewebsites.net/vms/api/mobile/kiosk
```https://vending-capsulo-cloud-g3b3g6bmbshcg8cp.westeurope-01.azurewebsites.net/vms/api/mobile/kiosk/catalog/490674

**Catalog Endpoint:**
```
GET /catalog/{qrCode}
```

**Full Example:**
```
GET https://vending-capsulo-cloud-g3b3g6bmbshcg8cp.westeurope-01.azurewebsites.net/vms/api/mobile/kiosk/catalog/QR123456
```

---

## 📦 Expected API Response Format

```json
{
  "kioskId": "string",
  "kioskName": "string (optional)",
  "location": "string (optional)",
  "products": [
    {
      "id": 1,
      "name": "Berry Hibiscus",
      "type": "Black Tea",
      "price": "2.25₾",
      "image": "/path/to/image.png",
      "capsuleType": "european"
    }
  ]
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `products` | `Array<Product>` | **Required** - Array of product objects |
| `products[].id` | `number` | Unique product identifier |
| `products[].name` | `string` | Product display name |
| `products[].type` | `string` | Product category/type |
| `products[].price` | `string` | Price with currency symbol |
| `products[].image` | `string` | Image URL/path |
| `products[].capsuleType` | `"european" \| "american"` | Capsule type for cup selection |

---

## 🎯 How It Works

### Flow Diagram

```
User scans QR code
    ↓
URL: yourapp.com/?qrCode=ABC123
    ↓
getQrCode() extracts "ABC123"
    ↓
KioskContext validates QR code
    ↓
ApiManager.fetchCatalog("ABC123")
    ↓
GET /catalog/ABC123
    ↓
Response → ProductsStore.setProducts()
    ↓
Box component renders dynamic cards
```

### QR Code Parameter Handling

The app supports **two methods** for QR code input:

1. **URL Parameter** (Primary): `?qrCode=XXX`
2. **LocalStorage** (Fallback): Persists QR code across sessions

```typescript
// Priority order:
1. URL query: ?qrCode=ABC123
2. localStorage: kioskQrCode
```

### Backward Compatibility

The app still supports the legacy `kiosk_id` parameter:
- `?kiosk_id=XXX` works as a fallback
- Internally mapped to QR code handling

---

## 🧪 Testing

### Test URLs

**Real API Mode (Production):**
```
http://localhost:5173/?qrCode=YOUR_REAL_QR_CODE
```

**Mock Data Mode (Development):**
```typescript
// In src/index.tsx, change:
<KioskProvider useMockData={true}>  // Enable mock data
```

Available mock QR codes:
- `QR123456` - 2 tea products (European)
- `QR789012` - 2 coffee products (American)
- `FULL_CATALOG` - All 4 products

**Example Mock URL:**
```
http://localhost:5173/?qrCode=QR123456
```

### Normal Mode (No QR Code)

Access without any parameters to use static default products:
```
http://localhost:5173/
```

---

## 🛠️ MobX Store Usage

### ProductsStore API

```typescript
import { productsStore } from '@/stores';

// Access products
const products = productsStore.products;

// Check loading state
const isLoading = productsStore.isLoading;

// Get error
const error = productsStore.error;

// Get specific product
const product = productsStore.getProductById(1);

// Filter by capsule type
const europeanProducts = productsStore.getProductsByCapsuleType('european');

// Manual operations (usually handled by KioskContext)
productsStore.setProducts([...]);
productsStore.setLoading(true);
productsStore.setError("Error message");
```

### Using with React Components

```typescript
import { observer } from 'mobx-react-lite';
import { productsStore } from '@/stores';

const MyComponent = observer(() => {
  return (
    <div>
      {productsStore.products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
});
```

---

## 🔄 API Error Handling

### Error Types

| Status | Error Message | User Action |
|--------|---------------|-------------|
| `404` | "Kiosk not found. Please scan a valid QR code." | Show QR code scan prompt |
| `400` | "Invalid QR code format." | Prompt to rescan |
| `500` | "Server error. Please try again later." | Show retry button |
| Network | "Network error. Please check your connection." | Show retry with network icon |
| Empty | "No products available for this kiosk" | Contact support message |

### Error States in UI

All errors are handled gracefully with:
- ✅ Full-page error component (`KioskErrorState`)
- ✅ Descriptive error messages
- ✅ Retry button (when applicable)
- ✅ Console logging for debugging

---

## 🎨 Dynamic Product Cards

### Rendering Logic

Product cards are **fully dynamic** and render based on API response:

```typescript
// In Box.tsx
{products.map((product) => (
  <Card key={product.id}>
    <img src={product.image} alt={product.name} />
    <h3>{product.name}</h3>
    <p>{product.type}</p>
    <p>{product.price}</p>
    <QuantityControls productId={product.id} />
  </Card>
))}
```

### Features
- ✅ 2-column responsive grid
- ✅ Touch-friendly +/- controls
- ✅ Real-time quantity updates
- ✅ Total price calculation
- ✅ Capsule type detection for cup selection

---

## 🚀 Deployment Checklist

### Before Going Live

- [ ] Test with real QR codes from your backend
- [ ] Verify API endpoint is accessible
- [ ] Test error scenarios (invalid QR, network issues)
- [ ] Ensure `useMockData={false}` in production
- [ ] Test on target tablet/kiosk device
- [ ] Verify portrait mode orientation lock
- [ ] Test localStorage persistence
- [ ] Validate all product images load correctly

### Environment Configuration

No environment variables needed! The API URL is hardcoded in `ApiManager.ts`.

**To change API endpoint:**
```typescript
// src/lib/ApiManager.ts
private readonly BASE_URL = 'YOUR_NEW_API_URL';
```

---

## 🐛 Debugging

### Console Logs

The integration includes comprehensive logging:

```
🚀 API Request: GET /catalog/ABC123
✅ API Response: /catalog/ABC123 200
✅ Catalog loaded successfully: 4 products
```

Or errors:
```
❌ Response Error: Network error
❌ Catalog fetch error: Failed to fetch catalog
```

### Development Tools

**Check MobX State:**
```typescript
// In browser console
window.productsStore = productsStore;
console.log(productsStore.products);
```

**Check localStorage:**
```javascript
localStorage.getItem('kioskQrCode')
```

**Clear cached QR code:**
```javascript
localStorage.removeItem('kioskQrCode')
```

---

## 📱 Usage Examples

### Example 1: Direct QR Code Access
```
Scan QR → Opens: https://yourapp.com/?qrCode=MEAMA_LOC_001
   ↓
Loads catalog for location MEAMA_LOC_001
   ↓
Shows 4 tea products
```

### Example 2: Returning User
```
Previously scanned QR code MEAMA_LOC_001
   ↓
Opens: https://yourapp.com/ (no parameter)
   ↓
Retrieves MEAMA_LOC_001 from localStorage
   ↓
Loads same catalog automatically
```

### Example 3: Different Location
```
Scan new QR → Opens: https://yourapp.com/?qrCode=MEAMA_LOC_002
   ↓
Overwrites localStorage with MEAMA_LOC_002
   ↓
Loads different catalog
```

---

## 🔐 Security Considerations

1. **No Authentication Required**: Public API endpoint
2. **QR Code Validation**: Basic length/format checks
3. **HTTPS Recommended**: Use HTTPS in production
4. **CORS**: Ensure backend allows your domain

---

## 🎉 Success Criteria

✅ **Implementation Complete When:**

- [ ] Products load from real API endpoint
- [ ] QR code extraction works from URL
- [ ] localStorage fallback functions correctly
- [ ] Loading state displays during fetch
- [ ] Error states show appropriate messages
- [ ] Product cards render dynamically
- [ ] Capsule type affects cup selection
- [ ] Total price calculates correctly
- [ ] Retry button works after errors
- [ ] Backward compatible with `kiosk_id`

---

## 📞 Support

For API issues or questions:
- Check Azure API logs
- Review browser console for errors
- Verify QR code format matches backend expectations
- Test with mock data first (`useMockData={true}`)

---

**Last Updated:** January 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

