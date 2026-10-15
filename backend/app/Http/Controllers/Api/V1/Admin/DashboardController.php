<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Enquiry;
use App\Models\ServiceCategory;
use App\Models\ServiceListing;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Return comprehensive summary KPI metrics and recent enquiries.
     */
    public function stats(): JsonResponse
    {
        $totalEnquiries = Enquiry::count();
        $newEnquiries = Enquiry::where('status', 'new')->count();
        $inProgressEnquiries = Enquiry::where('status', 'in_progress')->count();
        $resolvedEnquiries = Enquiry::whereIn('status', ['responded', 'closed'])->count();

        $publishedServices = ServiceCategory::where('is_published', true)->count();
        $publishedDestinations = Destination::where('is_published', true)->count();
        $publishedListings = ServiceListing::where('status', 'published')->count();

        $recentEnquiries = Enquiry::with(['category', 'destination', 'listing'])
            ->latest()
            ->take(8)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_enquiries' => $totalEnquiries,
                'new_enquiries' => $newEnquiries,
                'in_progress_enquiries' => $inProgressEnquiries,
                'resolved_enquiries' => $resolvedEnquiries,
                'published_services' => $publishedServices,
                'published_destinations' => $publishedDestinations,
                'published_listings' => $publishedListings,
                'recent_enquiries' => $recentEnquiries,
            ],
        ]);
    }
}
