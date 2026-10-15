<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Enquiry extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'reference',
        'customer_name',
        'email',
        'phone',
        'service_category_id',
        'listing_id',
        'destination_id',
        'message',
        'preferences',
        'status',
        'assigned_to',
    ];

    protected function casts(): array
    {
        return [
            'preferences' => 'array',
        ];
    }

    public static function generateReference(): string
    {
        $year = date('Y');
        $randomNumber = str_pad((string) random_int(1, 999999), 6, '0', STR_PAD_LEFT);
        return "WT-{$year}-{$randomNumber}";
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function listing(): BelongsTo
    {
        return $this->belongsTo(ServiceListing::class, 'listing_id');
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class, 'destination_id');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(EnquiryNote::class, 'enquiry_id')->orderBy('created_at', 'desc');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
