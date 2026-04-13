<?php

namespace App\Http\Controllers\Apiv1\Seller;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Resources\Seller\ProductResource;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
{
    $userId = Auth::id();

    $query = Product::with(['category:id,name', 'seller:id,name,email', 'images'])
        ->where('seller_id', $userId)

        // 🔍 Search (clean when() version)
        ->when($request->search, function ($q, $search) {
            $q->where(function ($sub) use ($search) {
                $sub->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        })

        // ✅ Status filter (clean when() version)
        ->when(
            $request->filled('is_active') && $request->is_active !== 'all',
            function ($q) use ($request) {
                $isActive = filter_var(
                    $request->is_active,
                    FILTER_VALIDATE_BOOLEAN,
                    FILTER_NULL_ON_FAILURE
                );

                if (!is_null($isActive)) {
                    $q->where('is_active', $isActive);
                }
            }
        );

    $products = $query->paginate(10);

    return response()->json([
        'success' => true,
        'message' => $products->isEmpty()
            ? 'No products found.'
            : 'Products retrieved successfully.',
        'data' => ProductResource::collection($products),
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => 'nullable|string|max:100|unique:products,sku',
            'weight' => 'nullable|numeric',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'category_id' => 'required|exists:categories,id',
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:10240',
        ]);



        $validatedData['slug'] = $validatedData['slug']
            ? Str::slug($validatedData['slug'])
            : Str::slug($validatedData['name']);
        $request->validate([]);
        $product = Product::create([
            'seller_id' => Auth::id(),
            ...$validatedData,
        ]);

        // ✅ HANDLE IMAGE UPLOAD
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_primary' => $index === 0, // first image = primary
                    'sort_order' => $index,
                ]);
            }
        }


        return response()->json([
            'success' => true,
            'message' => 'Product created successfully.',
            'data' => new ProductResource($product->load('images'),),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with('category')
            ->where('seller_id', Auth::id())
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Product retrieved successfully.',
            'data' => new ProductResource($product),
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::where('seller_id', Auth::id())->findOrFail($id);

        $beforUpdate = clone $product;

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($product->id)],
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'compare_price' => 'nullable|numeric|min:0|gt:price',
            'stock_quantity' => 'required|integer|min:0',
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('products', 'sku')->ignore($product->id)],
            'weight' => 'nullable|numeric',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'category_id' => 'required|exists:categories,id',
        ]);

        $product->update($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully.',
            'before_update' => new ProductResource($beforUpdate),
            'data' => new ProductResource($product),
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::where('seller_id', Auth::id())->findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.',
        ]);
    }
}
