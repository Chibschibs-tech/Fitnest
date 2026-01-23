# Token Authentication Guide

## ✅ **What Was Implemented**

Your authentication now properly handles Laravel Sanctum tokens!

### **Login/Signup Flow**

1. ✅ User logs in or signs up
2. ✅ Laravel returns a token + user data
3. ✅ Token is stored in `localStorage`
4. ✅ User data is stored in React Context + `localStorage`
5. ✅ Token is automatically included in authenticated requests

### **Logout Flow**

1. ✅ Sends logout request to Laravel with token
2. ✅ Clears token from `localStorage`
3. ✅ Clears user data from Context and `localStorage`

---

## 🔑 **Token Storage**

### **Where is the token stored?**

```typescript
// After successful login/signup:
localStorage.setItem('authToken', 'your-token-here')

// Retrieved for API calls:
const token = localStorage.getItem('authToken')

// Cleared on logout:
localStorage.removeItem('authToken')
```

### **Why localStorage?**

- ✅ Persists across page refreshes
- ✅ Survives browser close/reopen
- ✅ Easy to access from anywhere in the app
- ⚠️ Make sure to use HTTPS in production for security

---

## 🔐 **Making Authenticated Requests**

### **Option 1: Use the API Client Helper** (Recommended)

I've created a helper utility at `lib/api-client.ts` that automatically includes the token:

```typescript
import { api } from '@/lib/api-client'

// GET request
const response = await api.get('/user/profile')
const userData = await response.json()

// POST request
const response = await api.post('/orders', {
  meal_plan_id: 1,
  delivery_date: '2026-01-15'
})
const order = await response.json()

// PUT request
const response = await api.put('/user/profile', {
  name: 'New Name'
})

// DELETE request
const response = await api.delete('/orders/123')
```

### **Option 2: Manual Fetch**

```typescript
const token = localStorage.getItem('authToken')

const response = await fetch('http://localhost:8000/api/protected-route', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
```

---

## 🧪 **Testing Token Authentication**

### **1. Login and Check Token**

```typescript
// After login, check in browser console:
console.log('Token:', localStorage.getItem('authToken'))
// Should output: "6973c9e5c2cab7bd8a06df33|os5R7f5Nc3wbD6l2C563hcTBaEiAhMte3QQBqnCi4d7497f1"
```

### **2. Verify Token in DevTools**

1. Open DevTools (F12)
2. Go to **Application** tab
3. Expand **Local Storage**
4. Click on `http://localhost:3000`
5. You should see:
   - `authToken`: Your Laravel Sanctum token
   - `user`: Your user data (JSON string)

### **3. Test Authenticated Request**

```typescript
import { api } from '@/lib/api-client'

// This will automatically include the Authorization header
const response = await api.get('/me')
const user = await response.json()
console.log('Current user:', user)
```

---

## 📋 **Your Current Laravel Response Format**

```json
{
  "token": "6973c9e5c2cab7bd8a06df33|os5R7f5Nc3wbD6l2C563hcTBaEiAhMte3QQBqnCi4d7497f1",
  "user": {
    "id": "019ba266-bb9e-7233-a6f5-c34b23d7d34c",
    "name": "Zohair Laaabane Tlemcani",
    "email": "zohair.laabane@outlook.com",
    "role": "admin",
    "created_at": "2026-01-09T10:56:40.350000Z",
    "updated_at": "2026-01-09T10:56:40.350000Z"
  }
}
```

### **Stored in Frontend:**

```typescript
// Token (localStorage)
"6973c9e5c2cab7bd8a06df33|os5R7f5Nc3wbD6l2C563hcTBaEiAhMte3QQBqnCi4d7497f1"

// User (Context + localStorage)
{
  "id": "019ba266-bb9e-7233-a6f5-c34b23d7d34c",
  "name": "Zohair Laaabane Tlemcani",
  "email": "zohair.laabane@outlook.com",
  "role": "admin"
}
```

---

## 🛡️ **Laravel Backend Requirements**

### **Protected Routes (api.php)**

```php
// Protected routes that require authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [UserController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    // ... other protected routes
});
```

### **Logout Controller**

```php
public function logout(Request $request)
{
    // Revoke the token that was used to authenticate the current request
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logged out successfully'
    ]);
}
```

### **Get Current User (Optional)**

```php
public function me(Request $request)
{
    return response()->json([
        'user' => $request->user()
    ]);
}
```

---

## 🔄 **Session Persistence**

### **How it works:**

1. **User logs in** → Token + user data stored in `localStorage`
2. **User closes browser** → Data persists in `localStorage`
3. **User returns** → `AuthProvider` reads from `localStorage` and restores session
4. **User logs out** → Everything cleared

### **AuthProvider checks on mount:**

```typescript
useEffect(() => {
  const storedUser = localStorage.getItem("user")
  if (storedUser) {
    setUser(JSON.parse(storedUser)) // Restore user
  }
  // Optionally: verify token with backend /me endpoint
}, [])
```

---

## 🔐 **Security Best Practices**

### **✅ Implemented:**

- Token stored in localStorage (simple, works well for SPAs)
- Token sent in Authorization header (not in URL)
- Token cleared on logout
- HTTPS should be used in production

### **⚠️ Consider for Production:**

1. **HttpOnly Cookies** (more secure than localStorage)
   - Protects against XSS attacks
   - Requires backend changes

2. **Token Expiration**
   - Set expiration time in Laravel Sanctum
   - Handle token refresh

3. **HTTPS Only**
   - Always use HTTPS in production
   - Never send tokens over HTTP

4. **CSRF Protection**
   - Laravel Sanctum handles this
   - Make sure CORS is configured correctly

---

## 📝 **Example: Making Authenticated Requests**

### **Get User Profile**

```typescript
import { api } from '@/lib/api-client'

async function getUserProfile() {
  try {
    const response = await api.get('/me')
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile')
    }
    
    const data = await response.json()
    console.log('User profile:', data.user)
    return data.user
  } catch (error) {
    console.error('Error:', error)
  }
}
```

### **Create Order**

```typescript
import { api } from '@/lib/api-client'

async function createOrder(orderData) {
  try {
    const response = await api.post('/orders', orderData)
    
    if (!response.ok) {
      throw new Error('Failed to create order')
    }
    
    const data = await response.json()
    console.log('Order created:', data)
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}

// Usage
createOrder({
  meal_plan_id: 1,
  delivery_date: '2026-01-15',
  meals: [
    { meal_id: 10, quantity: 2 },
    { meal_id: 15, quantity: 1 }
  ]
})
```

---

## ✅ **Current Implementation Summary**

### **What Happens Now:**

1. ✅ User logs in with email/password
2. ✅ Laravel returns token + user data
3. ✅ Frontend stores both in `localStorage`
4. ✅ User data available globally via `AuthContext`
5. ✅ Token automatically included in authenticated requests via `api` helper
6. ✅ Logout clears everything and revokes token on backend

### **Files Modified:**

- ✅ `components/auth-dialog.tsx` - Stores token and user data
- ✅ `components/navbar.tsx` - Sends token with logout request
- ✅ `components/auth-provider.tsx` - Includes role field in User type
- ✅ `lib/api-client.ts` - New helper for authenticated requests

---

**Your authentication is now fully functional with token management! 🎉**
