<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Events\ChatMessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Customer: Start or resume conversation
     */
    public function start(Request $request)
    {
        $validated = $request->validate([
            'visitor_name' => 'nullable|string|max:100',
            'visitor_email' => 'nullable|email|max:150',
            'visitor_phone' => 'nullable|string|max:50',
            'initial_message' => 'nullable|string',
        ]);

        $visitorName = $validated['visitor_name'] ?? 'Website Guest';
        $visitorEmail = $validated['visitor_email'] ?? null;

        $conversation = null;
        if ($visitorEmail) {
            $conversation = ChatConversation::where('visitor_email', $visitorEmail)
                ->where('status', 'active')
                ->latest()
                ->first();
        }

        if (!$conversation) {
            $conversation = ChatConversation::create([
                'visitor_name' => $visitorName,
                'visitor_email' => $visitorEmail,
                'visitor_phone' => $validated['visitor_phone'] ?? null,
                'status' => 'active',
                'last_message' => 'Started conversation',
                'last_message_at' => now(),
            ]);

            // Welcome greeting from WeCheaperTours
            $welcome = ChatMessage::create([
                'conversation_id' => $conversation->id,
                'sender_type' => 'admin',
                'sender_name' => 'WeCheaperTours Support',
                'message' => "Welcome to WeCheaperTours, {$visitorName}! How can our travel experts assist you with Egypt tours, Nile cruises, or rentals today?",
            ]);

            event(new ChatMessageSent($welcome));
        }

        // If user passed an initial message
        if (!empty($validated['initial_message'])) {
            $msg = ChatMessage::create([
                'conversation_id' => $conversation->id,
                'sender_type' => 'customer',
                'sender_name' => $visitorName,
                'message' => $validated['initial_message'],
            ]);

            $conversation->update([
                'last_message' => $validated['initial_message'],
                'last_message_at' => now(),
                'unread_count' => $conversation->unread_count + 1,
            ]);

            event(new ChatMessageSent($msg));
        }

        $conversation->load('messages');

        return response()->json([
            'success' => true,
            'data' => $conversation,
        ]);
    }

    /**
     * Get messages for conversation
     */
    public function getMessages($id)
    {
        $conversation = ChatConversation::with('messages')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $conversation->messages,
        ]);
    }

    /**
     * Customer: Send message
     */
    public function sendMessage(Request $request, $id)
    {
        $conversation = ChatConversation::findOrFail($id);

        $validated = $request->validate([
            'message' => 'required|string',
            'sender_name' => 'nullable|string|max:100',
        ]);

        $message = ChatMessage::create([
            'conversation_id' => $conversation->id,
            'sender_type' => 'customer',
            'sender_name' => $validated['sender_name'] ?? $conversation->visitor_name ?? 'Customer',
            'message' => $validated['message'],
        ]);

        $conversation->update([
            'last_message' => $validated['message'],
            'last_message_at' => now(),
            'unread_count' => $conversation->unread_count + 1,
        ]);

        event(new ChatMessageSent($message));

        return response()->json([
            'success' => true,
            'data' => $message,
        ]);
    }

    /**
     * Admin/Manager: List all conversations
     */
    public function adminGetConversations(Request $request)
    {
        $query = ChatConversation::with('messages')->latest('last_message_at');

        if ($request->has('status') && in_array($request->status, ['active', 'closed'])) {
            $query->where('status', $request->status);
        }

        $conversations = $query->paginate(30);

        return response()->json([
            'success' => true,
            'data' => $conversations->items(),
            'total' => $conversations->total(),
        ]);
    }

    /**
     * Admin/Manager: Reply to conversation
     */
    public function adminReply(Request $request, $id)
    {
        $conversation = ChatConversation::findOrFail($id);

        $validated = $request->validate([
            'message' => 'required|string',
            'sender_type' => 'nullable|in:admin,manager',
            'sender_name' => 'nullable|string|max:100',
        ]);

        $senderType = $validated['sender_type'] ?? 'manager';
        $senderName = $validated['sender_name'] ?? ($senderType === 'admin' ? 'Administrator' : 'Operations Manager');

        $message = ChatMessage::create([
            'conversation_id' => $conversation->id,
            'sender_type' => $senderType,
            'sender_name' => $senderName,
            'message' => $validated['message'],
        ]);

        $conversation->update([
            'last_message' => $validated['message'],
            'last_message_at' => now(),
            'unread_count' => 0,
        ]);

        event(new ChatMessageSent($message));

        return response()->json([
            'success' => true,
            'data' => $message,
        ]);
    }

    /**
     * Admin/Manager: Close conversation
     */
    public function adminClose($id)
    {
        $conversation = ChatConversation::findOrFail($id);
        $conversation->update(['status' => 'closed']);

        return response()->json([
            'success' => true,
            'message' => 'Conversation closed',
        ]);
    }
}
