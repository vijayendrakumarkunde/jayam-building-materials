export type MeasurementUnit = "Ton" | "Truck" | "Bag" | "Piece" | "Cubic Feet (CFT)";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCount: number;
  featured?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  productType: string;
  description: string;
  price: number;
  unit: MeasurementUnit;
  minOrderQuantity: number;
  inStock: boolean;
  stockQuantity: number;
  images: string[];
  isFeatured?: boolean;
  isBestseller?: boolean;
  specifications: Record<string, string>;
  gradeOrType?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
