<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminDestinationController extends Controller
{
    public function index(): JsonResponse
    {
        $destinations = Destination::withCount('listings')->orderBy('display_order')->get();

        return response()->json([
            'success' => true,
            'data' => $destinations,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:destinations,slug',
            'summary' => 'nullable|string',
            'description' => 'nullable|string',
            'main_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'is_published' => 'nullable|boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $destination = Destination::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Destination created successfully.',
            'data' => $destination,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $destination = Destination::with('listings')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $destination,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $destination = Destination::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:destinations,slug,' . $id,
            'summary' => 'nullable|string',
            'description' => 'nullable|string',
            'main_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'is_published' => 'nullable|boolean',
        ]);

        $destination->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Destination updated successfully.',
            'data' => $destination,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $destination = Destination::findOrFail($id);
        $destination->delete();

        return response()->json([
            'success' => true,
            'message' => 'Destination deleted successfully.',
        ]);
    }
}
