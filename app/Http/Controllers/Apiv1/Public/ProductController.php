<?php

namespace App\Http\Controllers\Apiv1\Public;

use App\Models\Product;
use App\Models\Category;
use App\Http\Controllers\Controller;
use App\Http\Resources\Public\ProductResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        $query = Product::with(['category:id,name', 'images'])->withCount([
            'wishlists as is_wishlisted' => function ($q) use ($userId) {
                if ($userId) {
                    $q->where('user_id', $userId);
                } else {
                    $q->whereRaw('1 = 0'); 
                }
            }
        ]);

        // Request search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $categoryIds = explode(',', $request->category);

            // include children categories too
            $allCategoryIds = Category::whereIn('id', $categoryIds)
                ->orWhereIn('parent_id', $categoryIds)
                ->pluck('id')
                ->toArray();

            $query->whereIn('category_id', $allCategoryIds);
        }

        // Status filter - only active products for public
        $query->where('is_active', true);

        $products = $query->paginate(12); 

        // return response()->json([
        //     'data' =>  ProductResource::collection($products),
        //     'meta' => [
        //         'current_page'  => $products->currentPage(),
        //         'last_page'     => $products->lastPage(),
        //         'per_page'      => $products->perage(),
        //         'total'         => $products->total(),
        //     ],
        // ]);

        return ProductResource::collection($products);
    }
}
