<?php

namespace App\Http\Controllers\Apiv1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Http\Resources\Admin\CategoryResource;

class CategoryController extends Controller
{


    /**
     * GET /api/v1/admin/categories
     * List categories (paginated)
     */
    public function index(Request $request)
    {
        $query = Category::query();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('is_active') && $request->is_active !== 'all') {
            $isActive = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if (!is_null($isActive)) {
                $query->where('is_active', $isActive);
            }
        }


        $categories = $query
            ->orderByRaw('COALESCE(parent_id, id), parent_id IS NOT NULL, id')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => $categories->isEmpty()
                ? 'No categories found. Try to add some categories first.'
                : 'Categories retrieved successfully',
            'data' => CategoryResource::collection($categories->items()),
            'meta' => [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ],
        ], 200);
    }
    public function withoutpagingtion()
    {
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Categories retrieved successfully',
            'data' => CategoryResource::collection($categories),
        ], 200);
    }

    public function getAllChildCategory()
    {
        $categories = Category::whereNotNull('parent_id')->get();
        return response()->json([
            'success' => true,
            'message' => 'Child categories retrieved successfully',
            'data' => CategoryResource::collection($categories),
        ], 200);
    }

    /**
     * POST /api/v1/admin/categories
     * Create category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'boolean',
        ]);



        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    }

    /**
     * GET /api/v1/admin/categories/{id}
     */
    public function show(string $id)
    {
        $category = Category::with(['parent', 'children'])
            ->find($id);
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    /**
     * PUT /api/v1/admin/categories/{id}
     */
    public function update(Request $request, string $id)
    {
        $category = Category::find($id);

        $beforeUpdate = clone $category;

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|unique:categories,slug,' . $id,
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
        ]);



        // Handle image update
        if ($request->hasFile('image')) {
            // delete old image
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        // Update slug if name changed and slug not provided
        if (isset($validated['name']) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'before_update' => $beforeUpdate,
            'data' => $category,
        ]);
    }

    /**
     * DELETE /api/v1/admin/categories/{id}
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);

        $beforeDeleted = $category;

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',

            ], 404);
        }

        // Delete image if exists
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
            'deleted_category' => $beforeDeleted,
        ]);
    }
}
