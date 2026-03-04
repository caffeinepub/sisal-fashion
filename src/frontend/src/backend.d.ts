import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CartItem {
    qty: bigint;
    product: Product;
}
export interface CategoryData {
    category: string;
    subcategories: Array<string>;
}
export interface Product {
    id: bigint;
    originalPrice?: bigint;
    subcategory: string;
    isOnSale: boolean;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export interface backendInterface {
    addToCart(productId: bigint, qty: bigint, sessionId: string): Promise<boolean>;
    clearCart(sessionId: string): Promise<void>;
    deploy(): Promise<void>;
    getBestDeals(): Promise<Array<Product>>;
    getCart(sessionId: string): Promise<Array<CartItem>>;
    getCategories(): Promise<Array<CategoryData>>;
    getProductById(id: bigint): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getProductsBySubcategory(category: string, subcategory: string): Promise<Array<Product>>;
    updateCartItem(sessionId: string, productId: bigint, qty: bigint): Promise<boolean>;
}
