<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'destination_id',
        'title',
        'slug',
        'summary',
        'description',
        'duration',
        'price_amount',
        'price_currency',
        'status',
        'display_order',
        'featured',
        'highlights',
        'inclusions',
        'exclusions',
        'itinerary',
        'images',
        'main_image',
        'rental_type',
        'capacity',
        'bedrooms',
        'amenities',
        'seo_title',
        'seo_description',
    ];

    protected function casts(): array
    {
        return [
            'price_amount' => 'decimal:2',
            'display_order' => 'integer',
            'featured' => 'boolean',
            'highlights' => 'array',
            'inclusions' => 'array',
            'exclusions' => 'array',
            'itinerary' => 'array',
            'images' => 'array',
            'amenities' => 'array',
            'capacity' => 'integer',
            'bedrooms' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id');
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class, 'destination_id');
    }

    public function enquiries(): HasMany
    {
        return $this->hasMany(Enquiry::class, 'listing_id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')->orderBy('display_order');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true)->where('status', 'published');
    }
}
