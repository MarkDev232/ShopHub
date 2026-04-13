<?php
// routes/web.php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Customer\Orderscontroller;
use App\Http\Controllers\Apiv1\Admin\UserController;
use Inertia\Inertia;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/shop', 'shop/ShopListing')->name('shop');
// Route::innertia('/cart','shop/cart')->name('cart');

// Main dashboard redirect route
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function (Illuminate\Http\Request $request) {
        $user = $request->user();

        switch ($user->role) {
            case 'admin':
                return redirect()->route('admin.dashboard');
            case 'seller':
                return redirect()->route('seller.dashboard');
            case 'customer':
                return redirect()->route('customer.dashboard');
            default:
                return redirect()->route('home');
        }
    })->name('dashboard');
});


// Authenticated and verified routes with role-specific dashboards
Route::middleware(['auth', 'verified'])->group(function () {
    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::inertia('/dashboard', 'admin/dashboard')->name('dashboard');
        Route::inertia('/users', 'admin/User/Users')->name('users');
        Route::inertia('/categories', 'admin/Category/Categories')->name('categories');
        Route::inertia('/add-category', 'admin/Category/AddCategory')->name('add-category');
        Route::get('/categories/{id}/edit', function ($id) {
            return Inertia::render('admin/Category/EditCategory', [
                'categoryId' => $id
            ]);
        })->name('edit-category');
        Route::inertia('/products', 'admin/Products')->name('products');
        Route::inertia('/settings', 'admin/Report')->name('report');
        Route::inertia('/coupon', 'admin/Coupon')->name('coupon');
    });

    // Seller routes
    Route::middleware(['role:seller'])->prefix('seller')->name('seller.')->group(function () {
        Route::inertia('/dashboard', 'seller/dashboard')->name('dashboard');
        Route::inertia('/products', 'seller/Product/Products')->name('products');
        Route::inertia('/add-product', 'seller/Product/AddProduct')->name('add-product');
        Route::inertia('/orders', 'seller/orders')->name('orders');
    });

    // Customer routes
    Route::middleware(['role:customer'])->prefix('customer')->name('customer.')->group(function () {
        Route::inertia('/dashboard', 'customer/dashboard')->name('dashboard');
        Route::inertia('/orders', 'customer/orders')->name('orders');
    });
});

require __DIR__ . '/settings.php';
