# API Debugging Guide

## Current Error
**Error:** "Invalid QR code: Bad Request"
**Status:** 400 (Bad Request from Java backend)

## Quick Fixes to Try

### 1. Check what QR code is being sent
Open Browser Console (F12) and find these logs:
```
🚀 API Request: GET /catalog/{qrCode}
❌ Error Response Status: 400
❌ Error Response Data: {actual error message from backend}
```

### 2. Verify Your Java Backend

Your backend endpoint should accept:
```
GET /vms/api/mobile/kiosk/catalog/{qrCode}
```

Check your Java controller for:
- What format does it expect for qrCode?
- Does the QR code exist in your database?
- Are there any validation rules (length, format, etc.)?

### 3. Common Issues

#### Issue: QR Code doesn't exist in database
**Solution:** Create the QR code in your Java backend first, or use a test QR code that exists

#### Issue: Wrong QR code format
**Solution:** Check your Java backend's validation rules. Does it expect:
- Alphanumeric only?
- Specific prefix (e.g., "QR-")?
- Specific length?

#### Issue: Backend not running
**Solution:** 
```bash
# Check if backend is accessible
curl https://vending-capsulo-cloud-g3b3g6bmbshcg8cp.westeurope-01.azurewebsites.net/vms/api/mobile/kiosk/catalog/TEST123
```

### 4. Test with Mock Data First

Temporarily switch back to mock data to verify frontend works:

In `src/index.tsx` line 62:
```typescript
<KioskProvider useMockData={true}>  // Change to true
```

Then test with:
```
http://localhost:5173/?qrCode=QR123456
```

If this works, the issue is with your Java backend, not the frontend.

### 5. Manual API Test

Test your Java endpoint directly:

```bash
# Windows PowerShell
Invoke-WebRequest -Uri "https://vending-capsulo-cloud-g3b3g6bmbshcg8cp.westeurope-01.azurewebsites.net/vms/api/mobile/kiosk/catalog/YOUR_QR_CODE" -Method GET

# Or use Postman/Insomnia
GET https://vending-capsulo-cloud-g3b3g6bmbshcg8cp.westeurope-01.azurewebsites.net/vms/api/mobile/kiosk/catalog/YOUR_QR_CODE
```

### 6. Check Java Backend Logs

Look at your Azure App Service logs for:
- What request was received
- Why it returned 400
- Any validation errors

## Expected Java Response Formats

Your frontend supports both:

### Format 1: Array directly
```json
[
  {
    "id": 1,
    "name": "Espresso",
    "type": "Coffee",
    "price": "2.50₾",
    "image": "/path/to/image.png",
    "capsuleType": "european"
  }
]
```

### Format 2: Object with products
```json
{
  "kioskId": "QR123",
  "kioskName": "Main Lobby",
  "location": "Building A",
  "products": [
    {
      "id": 1,
      "name": "Espresso",
      "type": "Coffee",
      "price": "2.50₾",
      "image": "/path/to/image.png",
      "capsuleType": "european"
    }
  ]
}
```

## Next Steps

1. **Tell me what QR code you're testing with**
2. **Check browser console and share the actual error message**
3. **Verify that QR code exists in your Java database**
4. **Test the Java endpoint directly (see section 5)**

Once we know what the backend is expecting vs. what you're sending, we can fix the issue!

