<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminMediaController extends Controller
{
    public function index(): JsonResponse
    {
        $media = Media::latest()->paginate(24);

        return response()->json([
            'success' => true,
            'data' => $media,
        ]);
    }

    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|file|image|mimes:jpeg,png,webp,jpg|max:10240', // 10MB max
            'alt_text' => 'nullable|string|max:255',
        ]);

        $file = $request->file('image');
        $extension = $file->getClientOriginalExtension();
        $safeName = Str::random(24) . '.' . strtolower($extension);

        $path = $file->storeAs('uploads/media', $safeName, 'public');

        $media = Media::create([
            'uploaded_by' => $request->user()?->id,
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size_bytes' => $file->getSize(),
            'alt_text' => $request->input('alt_text', pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Image uploaded successfully.',
            'data' => [
                'id' => $media->id,
                'path' => $media->path,
                'url' => url(Storage::url($path)),
                'original_name' => $media->original_name,
                'alt_text' => $media->alt_text,
            ],
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $media = Media::findOrFail($id);

        if (Storage::disk('public')->exists($media->path)) {
            Storage::disk('public')->delete($media->path);
        }

        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Media file deleted successfully.',
        ]);
    }
}
