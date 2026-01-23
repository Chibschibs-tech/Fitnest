# Environment Variables Setup

## 🔧 Setting Up Your .env.local File

### 1. **Create or Update `.env.local`**

In the root of your project, create or update your `.env.local` file with the following:

```env
# Laravel API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. **Common API URLs**

Choose the appropriate URL based on your setup:

#### **Local Laravel Development (default)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### **Laravel Valet (macOS)**
```env
NEXT_PUBLIC_API_URL=http://your-project.test
```

#### **Laravel Homestead/Vagrant**
```env
NEXT_PUBLIC_API_URL=http://192.168.56.56
```

#### **Docker/Laradock**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

#### **Production/Staging**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 📋 API Endpoints Structure

With the base URL configured, your app will call:

| Action | Endpoint | Full URL Example |
|--------|----------|------------------|
| Login | `${API_URL}/login` | `http://localhost:8000/login` |
| Signup | `${API_URL}/signup` | `http://localhost:8000/signup` |
| Logout | `${API_URL}/logout` | `http://localhost:8000/logout` |
| Get User | `${API_URL}/me` | `http://localhost:8000/me` |

---

## 🚀 How It Works

### **In the Code**

```typescript
// The code automatically uses the environment variable
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const response = await fetch(`${apiUrl}/login`, {
  method: 'POST',
  // ...
})
```

### **Fallback Behavior**

If `NEXT_PUBLIC_API_URL` is not set, the app will default to:
```
http://localhost:8000
```

---

## ✅ Testing Your Setup

### **1. Verify Environment Variable**

Add this to any component to check:

```typescript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
```

### **2. Test API Connection**

```bash
# Start your Next.js app
npm run dev

# In another terminal, check if Laravel is running
curl http://localhost:8000/api/health
```

### **3. Check Browser Console**

Open browser DevTools → Network tab → Try to login

You should see requests going to: `http://localhost:8000/login`

---

## 🔐 Important Notes

### **NEXT_PUBLIC_ Prefix**

- ✅ **Required** for client-side access in Next.js
- The `NEXT_PUBLIC_` prefix makes the variable available in the browser
- Without it, `process.env.API_URL` would be `undefined` in client components

### **Restart Required**

After changing `.env.local`, you **must restart** your Next.js dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### **Security**

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Use different values for development vs production
- For production, set environment variables in your hosting platform (Vercel, Netlify, etc.)

---

## 📝 Example .env.local File

Create this file in your project root:

```env
# ========================================
# Fitnest Frontend Environment Variables
# ========================================

# Laravel API Base URL (REQUIRED)
# Local development:
NEXT_PUBLIC_API_URL=http://localhost:8000

# Production (uncomment and update when deploying):
# NEXT_PUBLIC_API_URL=https://api.fitnest.ma

# ========================================
# Other Variables (if needed)
# ========================================

# NEXT_PUBLIC_SITE_URL=http://localhost:3000
# NEXT_PUBLIC_ENVIRONMENT=development
```

---

## 🛠️ Laravel CORS Configuration

Make sure your Laravel backend allows requests from your Next.js frontend:

**File:** `config/cors.php`

```php
'paths' => ['*'],

'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Add your production domain
    'https://fitnest.ma',
],

'supports_credentials' => true,
```

---

## 🔄 Changing the API URL

### **Development to Production**

When deploying, update your environment variables:

**Local (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Production (Vercel/Netlify):**
```env
NEXT_PUBLIC_API_URL=https://api.fitnest.ma
```

### **Vercel Deployment**

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://api.yourdomain.com`
   - Environment: Production

### **Netlify Deployment**

1. Go to Site settings → Build & deploy → Environment
2. Add variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://api.yourdomain.com`

---

## 🧪 Testing Checklist

- [ ] Created `.env.local` file in project root
- [ ] Added `NEXT_PUBLIC_API_URL` with correct Laravel URL
- [ ] Restarted Next.js dev server
- [ ] Checked browser console for API URL
- [ ] Tested login/signup functionality
- [ ] Verified requests in Network tab go to correct URL
- [ ] Confirmed Laravel CORS is configured
- [ ] Laravel backend is running and accessible

---

## 🆘 Troubleshooting

### **API requests going to wrong URL**

✅ Check: Is `NEXT_PUBLIC_API_URL` set correctly?
✅ Check: Did you restart the dev server?
✅ Check: Is the prefix `NEXT_PUBLIC_` (not just `API_URL`)?

### **CORS errors**

✅ Check: Laravel CORS configuration allows your frontend URL
✅ Check: `supports_credentials` is set to `true`
✅ Check: Laravel is running and accessible

### **Environment variable is undefined**

✅ Check: Does the variable name start with `NEXT_PUBLIC_`?
✅ Check: Did you restart the Next.js server after adding the variable?
✅ Check: Is `.env.local` in the project root (not in a subdirectory)?

---

**All set! Your app will now use the API URL from your environment variables! 🎉**
