<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EnquiryController extends Controller
{
    /**
     * Submit a customer enquiry.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'service_category_id' => 'nullable|exists:service_categories,id',
            'listing_id' => 'nullable|exists:service_listings,id',
            'destination_id' => 'nullable|exists:destinations,id',
            'message' => 'required|string|max:3000',
            'preferences' => 'nullable|array',
        ]);

        $reference = Enquiry::generateReference();

        $enquiry = Enquiry::create([
            'reference' => $reference,
            'customer_name' => $validated['customer_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'service_category_id' => $validated['service_category_id'] ?? null,
            'listing_id' => $validated['listing_id'] ?? null,
            'destination_id' => $validated['destination_id'] ?? null,
            'message' => $validated['message'],
            'preferences' => $validated['preferences'] ?? null,
            'status' => 'new',
        ]);

        // Attempt email notification or log safely without failing customer submission
        try {
            $companyEmail = WebsiteSetting::get('email', config('mail.from.address'));
            Log::info("Enquiry received [{$reference}] from {$enquiry->customer_name} ({$enquiry->email}). Notification logged for {$companyEmail}.");
        } catch (\Throwable $e) {
            Log::error("Failed to log or queue enquiry notification: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Enquiry submitted successfully. A travel coordinator will review your request and contact you promptly via WhatsApp or email.',
            'data' => [
                'reference' => $enquiry->reference,
                'id' => $enquiry->id,
            ],
        ], 201);
    }
}
