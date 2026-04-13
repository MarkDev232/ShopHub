<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => 'customer', // Default role
            'phone' => fake()->optional()->phoneNumber(),
            'remember_token' => Str::random(10),
            'address' => fake()->optional()->address(),
            'avatar' => fake()->optional()->imageUrl(100, 100, 'people'),
            'is_active' => true,
            'approved_at' => null, // Only for sellers
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user is an admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the user is a seller.
     */
    public function seller(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'seller',
            'email_verified_at' => now(),
            'is_active' => true,
            'approved_at' => now(), // Auto-approve for testing
        ]);
    }

    /**
     * Indicate that the user is a seller pending approval.
     */
    public function pendingSeller(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'seller',
            'email_verified_at' => now(),
            'is_active' => true,
            'approved_at' => null, // Pending approval
        ]);
    }

    /**
     * Indicate that the user is a customer.
     */
    public function customer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'customer',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the user is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the user has a specific role.
     */
    public function withRole(string $role): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => $role,
        ]);
    }

    /**
     * Configure the factory to create users with specific attributes.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (User $user) {
            // If seller, you might want to create a seller profile automatically
            if ($user->role === 'seller') {
                // You can create related seller model here if needed
                // \App\Models\Seller::factory()->create(['user_id' => $user->id]);
            }
        });
    }
}