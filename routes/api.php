<?php

use App\Http\Controllers\Apiv1\Admin\UserController as AdminUserController;
use App\Http\Controllers\Apiv1\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Apiv1\Seller\ProductController as SellerProductContoller;
use App\Http\Controllers\Apiv1\Public\ProductController as PublicProductController;
use App\Http\Controllers\Apiv1\WishlistController;
use App\Http\Controllers\ShopController;
use App\Http\Resources\UserLoginResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::post('/login', function (Request $request) {
    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    $user = Auth::user();


    $token = $user->createToken('api-token')->plainTextToken;

    return (new UserLoginResource($user))->additional([
        'token' => $token,
        'token_type' => 'Bearer',
        'message' => 'Login successful'
    ]);
});

Route::post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'message' => 'Logout successful'
    ]);
})->middleware('auth:sanctum');

Route::get('/products', [PublicProductController::class, 'index']);
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/product/{id}', [ShopController::class, 'getSingleProduct'])->name('shop.');
Route::get('/categories/all', [AdminCategoryController::class, 'withoutpagingtion'])->name('categories.all');
Route::get('/categories/child', [AdminCategoryController::class, 'getAllChildCategory'])->name('categories.child');

Route::middleware(['auth:sanctum', 'auth.debug','verified'])->group(function () {


    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
        Route::patch('/users/{user}/status', [AdminUserController::class, 'updateStatus'])->name('users.status');

        Route::get('/categories', [AdminCategoryController::class, 'index']);
        Route::get('/categories/{category}', [AdminCategoryController::class, 'show'])->name('categories.show');
        Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');

        Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');
    });
    Route::middleware(['role:seller'])->prefix('seller')->name('seller.')->group(function () {
        Route::get('/products', [SellerProductContoller::class, 'index']);
        Route::post('/products', [SellerProductContoller::class, 'store']);
        Route::get('/products/{product}', [SellerProductContoller::class, 'show']);
        Route::patch('/products/{product}', [SellerProductContoller::class, 'update']);
        Route::delete('/products/{product}', [SellerProductContoller::class, 'destroy']);
    });

    Route::middleware(['role:customer'])->prefix('customer')->name('customer.')->group(function () {
        Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);
        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::get('/wishlist/check/{product}', [WishlistController::class, 'check']);
    });
});
