<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminServiceCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = ServiceCategory::withCount('listings')->orderBy('display_order')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:service_categories,slug',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'is_published' => 'nullable|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category = ServiceCategory::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service category created successfully.',
            'data' => $category,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $category = ServiceCategory::with('listings')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = ServiceCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:service_categories,slug,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'is_published' => 'nullable|boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service category updated successfully.',
            'data' => $category,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $category = ServiceCategory::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service category deleted successfully.',
        ]);
    }
}
