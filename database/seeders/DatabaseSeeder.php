<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+1234567890',
            'address' => '123 Admin Street, Admin City',
            'avatar' => 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create Seller User (Approved)
        User::factory()->create([
            'name' => 'Seller User',
            'email' => 'seller@example.com',
            'password' => Hash::make('password'),
            'role' => 'seller',
            'phone' => '+1234567891',
            'address' => '456 Seller Avenue, Seller City',
            'avatar' => 'https://ui-avatars.com/api/?name=Seller+User&background=10b981&color=fff',
            'is_active' => true,
            'approved_at' => now(),
            'email_verified_at' => now(),
        ]);

        // Create Pending Seller User
        User::factory()->create([
            'name' => 'Pending Seller',
            'email' => 'pendingseller@example.com',
            'password' => Hash::make('password'),
            'role' => 'seller',
            'phone' => '+1234567893',
            'address' => '789 Pending Street',
            'is_active' => true,
            'approved_at' => null, // Not approved yet
            'email_verified_at' => now(),
        ]);

        // Create Customer User
        User::factory()->create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1234567892',
            'address' => '789 Customer Road, Customer City',
            'avatar' => 'https://ui-avatars.com/api/?name=Customer+User&background=ef4444&color=fff',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create additional random users using factory states
        // Create 5 additional customers
        User::factory(5)->customer()->create();
        
        // Create 3 additional sellers (auto-approved)
        User::factory(3)->seller()->create();
        
        // Create 2 additional admins
        User::factory(2)->admin()->create();
        
        // Create 1 pending seller
        User::factory()->pendingSeller()->create();
        
        // Create 1 inactive user
        User::factory()->inactive()->create([
            'name' => 'Inactive User',
            'email' => 'inactive@example.com',
        ]);

        // Output information
        $this->command->info('Database seeded successfully!');
        $this->command->newLine();
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['Admin', 'admin@example.com', 'password'],
                ['Seller', 'seller@example.com', 'password'],
                ['Customer', 'customer@example.com', 'password'],
                ['Pending Seller', 'pendingseller@example.com', 'password'],
            ]
        );

        $this->call(CategorySeeder::class);
    }
}