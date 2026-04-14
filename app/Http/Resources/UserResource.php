<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'name' => $this->name,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'avatar' => $this->avatar,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),

            // ✅ FIXED
            'seller_profile' => $this->whenLoaded('sellerProfile', function () {
                return [
                    'id' => $this->sellerProfile->id,
                    'store_name' => $this->sellerProfile->store_name,
                    'store_description' => $this->sellerProfile->store_description,
                    'status' => $this->sellerProfile->status,
                    'is_approved' => $this->sellerProfile->is_approved,
                    'business_license' => $this->sellerProfile->business_license_url,
                    'bank_name' => $this->sellerProfile->bank_name,
                    'bank_account_name' => $this->sellerProfile->bank_account_name,
                    'bank_account_number'=> $this->sellerProfile->bank_account_number,
                ];
            }),
        ];
    }
}
