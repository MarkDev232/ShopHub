<?php

namespace App\Models;

use App\Models\Wishlist;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Auth;

#[Fillable([
    'seller_id',
    'category_id',
    'name',
    'slug',
    'description',
    'price',
    'compare_price',
    'stock_quantity',
    'sku',
    'weight',
    'is_active',
    'is_featured',
    'views_count',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;
    protected $appends = ['is_wishlisted'];
    /**
     * Cast attributes to proper types.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'price' => 'decimal:2',
            'compare_price' => 'decimal:2',
            'weight' => 'decimal:2',
        ];
    }

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }
    // Users who wishlisted this product
    public function wishlistedBy()
    {
        return $this->belongsToMany(User::class, 'wishlists');
    }

    // Computed attribute: is_wishlisted
    protected function isWishlisted(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!Auth::check()) {
                    return false;
                }

                return $this->wishlists()
                    ->where('user_id', Auth::id())
                    ->exists();
            }
        );
    }
    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }
}
