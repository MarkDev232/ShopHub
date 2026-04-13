<?php

namespace App\Http\Controllers;

use App\Http\Resources\Seller\ProductResource;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        // Get query params
        $search = $request->query('search');
        $categoryIds = $request->query('category');
        $categoryIds = $categoryIds ? explode(',', $categoryIds) : [];

        // Base query
        $query = Product::query()->where('is_active', true);

        // Search
        $query->when($search, function ($q) use ($search) {
            $q->where(function ($sub) use ($search) {
                $sub->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        });

        if (!empty($categoryIds)) {
            // Get all selected + their children
            $allCategoryIds = Category::whereIn('id', $categoryIds)
                ->orWhereIn('parent_id', $categoryIds)
                ->pluck('id')
                ->toArray();

            $query->whereIn('category_id', $allCategoryIds);
        }





        // Pagination
        $products = $query->with('images', 'category')->paginate(12)->withQueryString();

        // Get categories for sidebar
        $categories = Category::where('is_active', true)
            ->get();

        return response()->json([
            'success' => true,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function getSingleProduct(string $id)
    {
        $product = Product::with('category', 'seller', 'images')
            ->findOrFail($id); 

        return response()->json([
            'success' => true, 
            'data' => new ProductResource($product), 
        ]);
    }
}
