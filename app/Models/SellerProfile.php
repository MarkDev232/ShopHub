<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SellerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'store_name',
        'store_description',
        'store_logo',
        'business_license',
        'bank_account_name',
        'bank_account_number',
        'bank_name',
        'status',
        'is_approved',
        'admin_notes',
        'approved_at',
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
    ];

    /**
     * Relationship: Seller belongs to a user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if seller is approved
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved' && $this->is_approved;
    }

    /**
     * Check if seller is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if seller is rejected
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Approve seller helper
     */
    public function approve(?string $adminNotes = null): void
    {
        $this->update([
            'status' => 'approved',
            'is_approved' => true,
            'approved_at' => now(),
            'admin_notes' => $adminNotes,
        ]);
    }

    /**
     * Reject seller helper
     */
    public function reject(?string $adminNotes = null): void
    {
        $this->update([
            'status' => 'rejected',
            'is_approved' => false,
            'admin_notes' => $adminNotes,
        ]);
    }

    /**
     * Get store logo URL
     */
    public function getStoreLogoUrlAttribute(): ?string
    {
        return $this->store_logo
            ? asset('storage/' . $this->store_logo)
            : null;
    }

    /**
     * Get business license URL
     */
    public function getBusinessLicenseUrlAttribute(): ?string
    {
        return $this->business_license
            ? asset('storage/' . $this->business_license)
            : null;
    }
}