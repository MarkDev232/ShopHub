<?php

namespace App\Http\Resources\Seller;

use App\Http\Resources\Admin\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'compare_price' => $this->compare_price,
            'stock_quantity' => $this->stock_quantity,
            'sku' => $this->sku,
            'weight' => $this->weight,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'views_count' => $this->views_count,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'seller' => [
                'id' => $this->seller->id,
                'name' => $this->seller->name,
                'email' => $this->seller->email,
            ],
            'images' => $this->images->map(fn($img) => [
                'id' => $img->id,
                'image_path' => $img->image_path,
                'image_url' => $img->image_url,
                'is_primary' => $img->is_primary,
            ]),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
