<?php

use App\Http\Controllers\Api\V1\Admin\AdminDestinationController;
use App\Http\Controllers\Api\V1\Admin\AdminEnquiryController;
use App\Http\Controllers\Api\V1\Admin\AdminListingController;
use App\Http\Controllers\Api\V1\Admin\AdminMediaController;
use App\Http\Controllers\Api\V1\Admin\AdminServiceCategoryController;
use App\Http\Controllers\Api\V1\Admin\AdminSettingController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EnquiryController;
use App\Http\Controllers\Api\V1\PublicController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ==========================================
    // Public Endpoints
    // ==========================================
    Route::get('/services', [PublicController::class, 'services']);
    Route::get('/services/{slug}', [PublicController::class, 'serviceBySlug']);
    Route::get('/destinations', [PublicController::class, 'destinations']);
    Route::get('/destinations/{slug}', [PublicController::class, 'destinationBySlug']);
    Route::get('/tours', [PublicController::class, 'tours']);
    Route::get('/tours/{slug}', [PublicController::class, 'tourBySlug']);
    Route::get('/cruises', [PublicController::class, 'cruises']);
    Route::get('/car-rentals', [PublicController::class, 'carRentals']);
    Route::get('/ferry-routes', [PublicController::class, 'ferryRoutes']);
    Route::get('/vacation-rentals', [PublicController::class, 'vacationRentals']);
    Route::get('/concierge-services', [PublicController::class, 'conciergeServices']);
    Route::get('/events', [PublicController::class, 'events']);
    Route::get('/settings/public', [PublicController::class, 'publicSettings']);

    // Customer enquiry submission (with rate limiting)
    Route::post('/enquiries', [EnquiryController::class, 'store'])->middleware('throttle:30,1');

    // ==========================================
    // Admin Authentication
    // ==========================================
    Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    // ==========================================
    // Protected Admin Routes
    // ==========================================
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/dashboard', [DashboardController::class, 'stats']);

        // Service Categories CRUD
        Route::get('/services', [AdminServiceCategoryController::class, 'index']);
        Route::post('/services', [AdminServiceCategoryController::class, 'store']);
        Route::get('/services/{id}', [AdminServiceCategoryController::class, 'show']);
        Route::put('/services/{id}', [AdminServiceCategoryController::class, 'update']);
        Route::delete('/services/{id}', [AdminServiceCategoryController::class, 'destroy']);

        // Destinations CRUD
        Route::get('/destinations', [AdminDestinationController::class, 'index']);
        Route::post('/destinations', [AdminDestinationController::class, 'store']);
        Route::get('/destinations/{id}', [AdminDestinationController::class, 'show']);
        Route::put('/destinations/{id}', [AdminDestinationController::class, 'update']);
        Route::delete('/destinations/{id}', [AdminDestinationController::class, 'destroy']);

        // Service Listings CRUD (Tours, Cruises, Rentals, Ferry, Concierge, Events)
        Route::get('/listings', [AdminListingController::class, 'index']);
        Route::post('/listings', [AdminListingController::class, 'store']);
        Route::get('/listings/{id}', [AdminListingController::class, 'show']);
        Route::put('/listings/{id}', [AdminListingController::class, 'update']);
        Route::delete('/listings/{id}', [AdminListingController::class, 'destroy']);

        // Customer Enquiries Management
        Route::get('/enquiries', [AdminEnquiryController::class, 'index']);
        Route::get('/enquiries/{id}', [AdminEnquiryController::class, 'show']);
        Route::patch('/enquiries/{id}', [AdminEnquiryController::class, 'update']);
        Route::post('/enquiries/{id}/notes', [AdminEnquiryController::class, 'addNote']);
        Route::delete('/enquiries/{id}', [AdminEnquiryController::class, 'destroy']);

        // Website Settings
        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::put('/settings', [AdminSettingController::class, 'update']);

        // Media Library
        Route::get('/media', [AdminMediaController::class, 'index']);
        Route::post('/media', [AdminMediaController::class, 'upload']);
        Route::delete('/media/{id}', [AdminMediaController::class, 'destroy']);

        // Users
        Route::get('/users', function () {
            return response()->json([
                'success' => true,
                'data' => User::select('id', 'name', 'email', 'role', 'is_active', 'created_at')->get(),
            ]);
        });
    });
});
