<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Models\EnquiryNote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminEnquiryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Enquiry::with(['category', 'destination', 'listing', 'assignee']);

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->filled('category_id')) {
            $query->where('service_category_id', $request->query('category_id'));
        }

        if ($request->filled('search')) {
            $search = '%' . $request->query('search') . '%';
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', $search)
                  ->orWhere('customer_name', 'like', $search)
                  ->orWhere('email', 'like', $search)
                  ->orWhere('phone', 'like', $search);
            });
        }

        $enquiries = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $enquiries,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $enquiry = Enquiry::with(['category', 'destination', 'listing', 'assignee', 'notes.user'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $enquiry,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $enquiry = Enquiry::findOrFail($id);

        $validated = $request->validate([
            'status' => 'sometimes|required|in:new,in_progress,responded,closed,spam',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $enquiry->update($validated);
        $enquiry->load(['category', 'destination', 'listing', 'assignee']);

        return response()->json([
            'success' => true,
            'message' => 'Enquiry status updated successfully.',
            'data' => $enquiry,
        ]);
    }

    public function addNote(Request $request, int $id): JsonResponse
    {
        $enquiry = Enquiry::findOrFail($id);

        $validated = $request->validate([
            'note' => 'required|string|max:2000',
        ]);

        $note = EnquiryNote::create([
            'enquiry_id' => $enquiry->id,
            'user_id' => $request->user()->id,
            'note' => $validated['note'],
        ]);

        $note->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Internal note added.',
            'data' => $note,
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $enquiry = Enquiry::findOrFail($id);
        $enquiry->delete(); // Soft deletes the enquiry

        return response()->json([
            'success' => true,
            'message' => 'Enquiry archived successfully.',
        ]);
    }
}
