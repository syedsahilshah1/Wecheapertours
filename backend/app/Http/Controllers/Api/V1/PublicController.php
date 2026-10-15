<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\ServiceCategory;
use App\Models\ServiceListing;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    /**
     * List all published service categories.
     */
    public function services(): JsonResponse
    {
        $categories = ServiceCategory::published()
            ->withCount(['listings' => fn($q) => $q->where('status', 'published')])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Get single service category by slug with its published listings.
     */
    public function serviceBySlug(string $slug): JsonResponse
    {
        $category = ServiceCategory::where('slug', $slug)
            ->where('is_published', true)
            ->with(['listings' => fn($q) => $q->where('status', 'published')->with('destination')])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    /**
     * List all published destinations.
     */
    public function destinations(): JsonResponse
    {
        $destinations = Destination::published()
            ->withCount(['listings' => fn($q) => $q->where('status', 'published')])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $destinations,
        ]);
    }

    /**
     * Get single destination by slug with its listings.
     */
    public function destinationBySlug(string $slug): JsonResponse
    {
        $destination = Destination::where('slug', $slug)
            ->where('is_published', true)
            ->with(['listings' => fn($q) => $q->where('status', 'published')->with('category')])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $destination,
        ]);
    }

    /**
     * List published excursion tours, filterable by destination and search query.
     */
    public function tours(Request $request): JsonResponse
    {
        $query = ServiceListing::whereHas('category', fn($q) => $q->where('slug', 'excursions'))
            ->where('status', 'published')
            ->with(['destination', 'category']);

        if ($request->filled('destination')) {
            $destSlug = $request->query('destination');
            $query->whereHas('destination', fn($q) => $q->where('slug', $destSlug));
        }

        if ($request->filled('search')) {
            $search = '%' . $request->query('search') . '%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', $search)
                  ->orWhere('summary', 'like', $search)
                  ->orWhere('description', 'like', $search);
            });
        }

        $tours = $query->orderBy('display_order')->get();

        return response()->json([
            'success' => true,
            'data' => $tours,
        ]);
    }

    /**
     * Get tour or excursion detail by slug.
     */
    public function tourBySlug(string $slug): JsonResponse
    {
        $tour = ServiceListing::where('slug', $slug)
            ->where('status', 'published')
            ->with(['destination', 'category'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $tour,
        ]);
    }

    /**
     * List classic Nile cruises itineraries.
     */
    public function cruises(): JsonResponse
    {
        $cruises = ServiceListing::whereHas('category', fn($q) => $q->where('slug', 'nile-cruises'))
            ->where('status', 'published')
            ->with('destination')
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cruises,
        ]);
    }

    /**
     * List car rental listings and options.
     */
    public function carRentals(): JsonResponse
    {
        $carRentals = ServiceListing::whereHas('category', fn($q) => $q->where('slug', 'car-rentals'))
            ->where('status', 'published')
            ->with('destination')
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $carRentals,
        ]);
    }

    /**
     * List ferry crossing routes.
     */
    public function ferryRoutes(): JsonResponse
    {
        $routes = ServiceListing::whereHas('category', fn($q) => $q->where('slug', 'ferry-crossings'))
            ->where('status', 'published')
            ->with('destination')
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $routes,
        ]);
    }

    /**
     * List vacation rental accommodations.
     */
    public function vacationRentals(Request $request): JsonResponse
    {
        $query = ServiceListing::whereHas('category', fn($q) => $q->where('slug', 'vacation-rentals'))
            ->where('status', 'published')
            ->with('destination');

        if ($request->filled('destination')) {
            $destSlug = $request->query('destination');
            $query->whereHas('destination', fn($q) => $q->where('slug', $destSlug));
        }

        $rentals = $query->orderBy('display_order')->get();

        return response()->json([
            'success' => true,
            'data' => $rentals,
        ]);
    }

    /**
     * List personal concierge services.
     */
    public function conciergeServices(): JsonResponse
    {
        $services = ServiceListing::whereHas('category', fn($q) => $q->where('slug', 'concierge'))
            ->where('status', 'published')
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $services,
        ]);
    }

    /**
     * List event planning offerings.
     */
    public function events(): JsonResponse
    {
        $events = ServiceListing::whereHas('category', fn($q) => $q->where('slug', 'events'))
            ->where('status', 'published')
            ->orderBy('display_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $events,
        ]);
    }

    /**
     * Public company settings (WhatsApp number, phone, contact details, disclaimers).
     */
    public function publicSettings(): JsonResponse
    {
        $settings = WebsiteSetting::pluck('value', 'key')->all();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }
}
