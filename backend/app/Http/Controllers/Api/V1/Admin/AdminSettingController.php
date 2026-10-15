<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = WebsiteSetting::pluck('value', 'key')->all();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            WebsiteSetting::set($key, $value);
        }

        $all = WebsiteSetting::pluck('value', 'key')->all();

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully.',
            'data' => $all,
        ]);
    }
}
