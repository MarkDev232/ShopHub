<?php

namespace App\Actions\Fortify;

use Illuminate\Http\UploadedFile;
use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Models\SellerProfile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'phone' => ['nullable', 'string', 'max:20'],
            'role' => ['required', 'string', 'in:customer,seller'],
            'business_license' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ])->validate();

        return DB::transaction(function () use ($input) {

            // 1. Create User
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => Hash::make($input['password']),
                'phone' => $input['phone'] ?? null,
                'role' => $input['role'], 
            ]);

            // 2. If seller → create seller profile
            if ($input['role'] === 'seller') {

                $sellerProfile = SellerProfile::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'store_name' => $input['store_name'] ?? null,
                        'store_description' => $input['store_description'] ?? null,
                        'bank_name' => $input['bank_name'] ?? null,
                        'bank_account_name' => $input['bank_account_name'] ?? null,
                        'bank_account_number' => $input['bank_account_number'] ?? null,
                        'status' => 'pending',
                        'is_approved' => false,
                    ]
                );


                if (!empty($input['business_license']) && $input['business_license'] instanceof UploadedFile) {
                    $path = $input['business_license']->store('seller-documents', 'public');

                    $sellerProfile->update([
                        'business_license' => $path,
                    ]);
                }
            }

            return $user;
        });
    }
}
