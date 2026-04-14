<?php

namespace App\Http\Controllers\Apiv1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->where('role', '!=', 'admin')
            ->with('sellerProfile'); // ✅ IMPORTANT

        // ✅ Filter seller status
        if ($request->filled('seller_status')) {
            $query->whereHas('sellerProfile', function ($q) use ($request) {
                $q->where('status', $request->seller_status);
            });
        }

        // 🔍 Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // 🎭 Role filter
        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // ✅ Active filter
        if ($request->filled('is_active') && $request->is_active !== 'all') {
            $isActive = $request->is_active === 'true' || $request->is_active === true ? 1 : 0;
            $query->where('is_active', $isActive);
        }

        $users = $query->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Users retrieved successfully',
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'from' => $users->firstItem(),
                'to' => $users->lastItem(),
            ],
            'links' => [
                'first' => $users->url(1),
                'last' => $users->url($users->lastPage()),
                'prev' => $users->previousPageUrl(),
                'next' => $users->nextPageUrl(),
            ]
        ], 200);
    }

    public function getUserById(string $id)
    {
        $user = User::with('sellerProfile')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ], 200);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => 'required|in:admin,user,moderator',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => new UserResource($user)
        ]);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    public function updateStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        // Convert is_active to status field
        $user->update(['status' => $validated['is_active']]);

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully',
            'data' => new UserResource($user)
        ]);
    }

    public function approve(User $user)
    {
        $profile = $user->sellerProfile;

        $profile->approve();

        return response()->json([
            'success' => true,
            'message' => 'Seller approved'
        ]);
    }

    public function reject(Request $request, User $user)
    {
        $profile = $user->sellerProfile;

        $profile->reject($request->admin_notes);

        return response()->json([
            'success' => true,
            'message' => 'Seller rejected'
        ]);
    }
}
