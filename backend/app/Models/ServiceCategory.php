<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServiceCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'display_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    public function listings(): HasMany
    {
        return $this->hasMany(ServiceListing::class, 'category_id')->orderBy('display_order');
    }

    public function enquiries(): HasMany
    {
        return $this->hasMany(Enquiry::class, 'service_category_id');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderBy('display_order');
    }
}
