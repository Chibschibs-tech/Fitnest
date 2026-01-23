# Laravel Backend Authentication Integration

## ✅ What Was Done

### 1. **Removed NextAuth**
- ❌ Removed `@auth/core` from package.json
- ❌ Removed `next-auth` from package.json
- ✅ Created custom auth provider without NextAuth

### 2. **Created Custom Auth System**
- ✅ Created `components/auth-provider.tsx` - Global auth state management
- ✅ Updated `components/providers.tsx` - Wraps app with AuthProvider
- ✅ Updated `components/navbar.tsx` - Uses global auth context
- ✅ Updated `components/auth-dialog.tsx` - Calls Laravel API endpoints

### 3. **Auth State Management**
- Uses React Context for global state
- Persists user in localStorage
- Automatic session restoration on page reload

---

## 🔧 Required Laravel Backend Endpoints

Your Laravel backend needs to implement these endpoints:

### 1. **Login Endpoint**

**Route:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "remember": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg"
  },
  "token": "your-auth-token-here"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Laravel Controller Example:**
```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, $request->remember)) {
            $user = Auth::user();
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar_url ?? null,
                ],
                'token' => $token,
            ]);
        }

        return response()->json([
            'success' => false,
            'error' => 'Invalid email or password'
        ], 401);
    }
}
```

---

### 2. **Signup Endpoint**

**Route:** `POST /api/auth/signup`

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": null
  },
  "token": "your-auth-token-here"
}
```

**Error Response (409 - Email exists):**
```json
{
  "success": false,
  "error": "Cet email est déjà utilisé"
}
```

**Laravel Controller Example:**
```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class SignupController extends Controller
{
    public function signup(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            Auth::login($user);
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar_url ?? null,
                ],
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                return response()->json([
                    'success' => false,
                    'error' => 'Cet email est déjà utilisé'
                ], 409);
            }

            return response()->json([
                'success' => false,
                'error' => 'Une erreur est survenue. Veuillez réessayer.'
            ], 500);
        }
    }
}
```

---

### 3. **Logout Endpoint**

**Route:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Laravel Controller Example:**
```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    public function logout(Request $request)
    {
        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}
```

---

### 4. **Get Current User (Optional but Recommended)**

**Route:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

**Laravel Controller Example:**
```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MeController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar_url ?? null,
            ]
        ]);
    }
}
```

---

## 🛣️ Laravel Routes Setup

Add these routes to your `routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\SignupController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\MeController;

Route::prefix('auth')->group(function () {
    // Public routes
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/signup', [SignupController::class, 'signup']);
    
    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [LogoutController::class, 'logout']);
        Route::get('/me', [MeController::class, 'me']);
    });
});
```

---

## 🔐 Laravel Sanctum Setup

### 1. **Install Sanctum** (if not already installed)

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 2. **Configure CORS**

In `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    // Add your production domain
],

'supports_credentials' => true,
```

### 3. **Add Sanctum Middleware**

In `app/Http/Kernel.php`:

```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

### 4. **Update User Model**

In `app/Models/User.php`:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
```

---

## 🧪 Testing the Integration

### 1. **Test Login**

```bash
curl -X POST http://your-laravel-app.test/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. **Test Signup**

```bash
curl -X POST http://your-laravel-app.test/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. **Test Logout**

```bash
curl -X POST http://your-laravel-app.test/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔄 Next.js API Proxy (Optional)

If you need to proxy requests from Next.js to Laravel, create these API routes in your Next.js app:

**File:** `app/api/auth/login/route.ts`

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  
  const response = await fetch(`${process.env.LARAVEL_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
```

**Environment Variable:**

Add to your `.env.local`:

```
LARAVEL_API_URL=http://your-laravel-app.test
```

---

## 📝 Summary

### ✅ Frontend (Next.js) - Done
- Clean, NextAuth-free authentication
- Global auth state with React Context
- localStorage persistence
- API-ready with proper error handling

### ⚙️ Backend (Laravel) - Required
- Implement the 4 endpoints above
- Setup Laravel Sanctum
- Configure CORS
- Return proper JSON responses

### 🎯 Flow
1. User submits login/signup form
2. Frontend calls Laravel API
3. Laravel validates and returns token + user data
4. Frontend stores user in context and localStorage
5. Token sent with all authenticated requests

---

**Ready to go! Just implement the Laravel endpoints and you're all set! 🚀**
