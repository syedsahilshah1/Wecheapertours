<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminListingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ServiceListing::with(['category', 'destination']);

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->query('category_id'));
        }

        if ($request->filled('category_slug')) {
            $slug = $request->query('category_slug');
            $query->whereHas('category', fn($q) => $q->where('slug', $slug));
        }

        if ($request->filled('destination_id')) {
            $query->where('destination_id', $request->query('destination_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('search')) {
            $search = '%' . $request->query('search') . '%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', $search)
                  ->orWhere('summary', 'like', $search);
            });
        }

        $listings = $query->orderBy('display_order')->get();

        return response()->json([
            'success' => true,
            'data' => $listings,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:service_categories,id',
            'destination_id' => 'nullable|exists:destinations,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:service_listings,slug',
            'summary' => 'nullable|string',
            'description' => 'nullable|string',
            'duration' => 'nullable|string|max:255',
            'price_amount' => 'nullable|numeric|min:0',
            'price_currency' => 'nullable|string|max:10',
            'status' => 'nullable|in:published,draft',
            'display_order' => 'nullable|integer',
            'featured' => 'nullable|boolean',
            'highlights' => 'nullable|array',
            'inclusions' => 'nullable|array',
            'exclusions' => 'nullable|array',
            'itinerary' => 'nullable|array',
            'images' => 'nullable|array',
            'main_image' => 'nullable|string',
            'rental_type' => 'nullable|string|max:50',
            'capacity' => 'nullable|integer',
            'bedrooms' => 'nullable|integer',
            'amenities' => 'nullable|array',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
            // Ensure unique slug
            $originalSlug = $validated['slug'];
            $count = 1;
            while (ServiceListing::where('slug', $validated['slug'])->exists()) {
                $validated['slug'] = "{$originalSlug}-{$count}";
                $count++;
            }
        }

        $listing = ServiceListing::create($validated);
        $listing->load(['category', 'destination']);

        return response()->json([
            'success' => true,
            'message' => 'Listing created successfully.',
            'data' => $listing,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $listing = ServiceListing::with(['category', 'destination'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $listing,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $listing = ServiceListing::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:service_categories,id',
            'destination_id' => 'nullable|exists:destinations,id',
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:service_listings,slug,' . $id,
            'summary' => 'nullable|string',
            'description' => 'nullable|string',
            'duration' => 'nullable|string|max:255',
            'price_amount' => 'nullable|numeric|min:0',
            'price_currency' => 'nullable|string|max:10',
            'status' => 'nullable|in:published,draft',
            'display_order' => 'nullable|integer',
            'featured' => 'nullable|boolean',
            'highlights' => 'nullable|array',
            'inclusions' => 'nullable|array',
            'exclusions' => 'nullable|array',
            'itinerary' => 'nullable|array',
            'images' => 'nullable|array',
            'main_image' => 'nullable|string',
            'rental_type' => 'nullable|string|max:50',
            'capacity' => 'nullable|integer',
            'bedrooms' => 'nullable|integer',
            'amenities' => 'nullable|array',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        $listing->update($validated);
        $listing->load(['category', 'destination']);

        return response()->json([
            'success' => true,
            'message' => 'Listing updated successfully.',
            'data' => $listing,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $listing = ServiceListing::findOrFail($id);
        $listing->delete();

        return response()->json([
            'success' => true,
            'message' => 'Listing deleted successfully.',
        ]);
    }
}
