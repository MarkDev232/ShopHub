<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // 🔹 Root Categories
        $electronics = Category::create([
            'name' => 'Electronics',
            'slug' => Str::slug('Electronics'),
            'description' => 'Electronic devices and gadgets',
            'parent_id' => null,
            'is_active' => true,
        ]);

        $fashion = Category::create([
            'name' => 'Fashion',
            'slug' => Str::slug('Fashion'),
            'description' => 'Clothing and accessories',
            'parent_id' => null,
            'is_active' => true,
        ]);

        $home = Category::create([
            'name' => 'Home & Living',
            'slug' => Str::slug('Home & Living'),
            'description' => 'Home essentials and furniture',
            'parent_id' => null,
            'is_active' => true,
        ]);

        // 🔹 Child Categories (Electronics)
        Category::create([
            'name' => 'Mobile Phones',
            'slug' => Str::slug('Mobile Phones'),
            'description' => 'Smartphones and accessories',
            'parent_id' => $electronics->id,
            'is_active' => true,
        ]);

        Category::create([
            'name' => 'Laptops',
            'slug' => Str::slug('Laptops'),
            'description' => 'Personal and gaming laptops',
            'parent_id' => $electronics->id,
            'is_active' => true,
        ]);

        // 🔹 Child Categories (Fashion)
        Category::create([
            'name' => 'Men Clothing',
            'slug' => Str::slug('Men Clothing'),
            'description' => 'Men apparel',
            'parent_id' => $fashion->id,
            'is_active' => true,
        ]);

        Category::create([
            'name' => 'Women Clothing',
            'slug' => Str::slug('Women Clothing'),
            'description' => 'Women apparel',
            'parent_id' => $fashion->id,
            'is_active' => true,
        ]);

        // 🔹 Child Categories (Home)
        Category::create([
            'name' => 'Furniture',
            'slug' => Str::slug('Furniture'),
            'description' => 'Tables, chairs, and more',
            'parent_id' => $home->id,
            'is_active' => true,
        ]);

        Category::create([
            'name' => 'Kitchen',
            'slug' => Str::slug('Kitchen'),
            'description' => 'Kitchen tools and appliances',
            'parent_id' => $home->id,
            'is_active' => true,
        ]);
    }
}