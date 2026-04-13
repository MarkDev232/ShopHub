export interface ImageItem {
    file: File;
    preview: string;
    isPrimary: boolean;
}

export interface Image {
    product_id: number;
    image_url: string;
    image_path: string;
    is_primary: boolean;
    sort_order: number;
}
