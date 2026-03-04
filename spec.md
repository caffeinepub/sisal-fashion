# Sisal Fashion

## Current State
No previous working build. Starting fresh from the sisalfashion.com website.

## Requested Changes (Diff)

### Add
- Full mobile-first clone of sisalfashion.com
- Top marquee bar: scrolling "DRESS BETTER" text
- Header: Sisal Fashion logo (from sisalfashion.com/uploads/settings/logo_68d0f3fa88085.png), search bar, wishlist icon, cart icon, account icon
- Navigation bar: Home, Boys (Hoodie, Jogger, Sweat Shirt), Girls (Hoodie, Sweat Shirt), Mens (Hoodie, Jogger, Long Sleeve T-Shirt, Mens Polo, Sweat Shirt), Best Deals, Contact
- Mobile hamburger menu drawer with same category structure
- Hero slider / banner section
- Product grid with category filter tabs matching actual categories
- Product cards with image, name, price in BDT (৳), Add to Cart button
- Slide-out cart panel (offcanvas) matching original design: dark green header, item cards, quantity controls, subtotal, Secure Checkout button
- Product detail page/modal: full image, name, price, size/color selectors, Add to Cart
- Best Deals page
- Contact page
- Footer with store info and links
- Backend stores products with: id, name, category, subcategory, price (BDT), images, description, stock
- Seed data with real product categories: Boys/Girls/Mens Hoodies, Joggers, Sweat Shirts, Long Sleeve T-Shirts, Mens Polo

### Modify
- Nothing (fresh build)

### Remove
- Nothing (fresh build)

## Implementation Plan
1. Select no extra Caffeine components (none needed)
2. Generate Motoko backend: products CRUD with category/subcategory filtering, getProducts, getCategories, getProductById
3. Build frontend:
   - Color scheme: dark green #00512c as primary, white background
   - Top marquee bar
   - Sticky header with logo (hotlinked from sisalfashion.com), search, icons
   - Desktop nav with dropdown panels + mobile drawer
   - Home page: hero banner, featured products grid
   - Products page: sidebar or top filter by category, product grid
   - Offcanvas cart with green header matching original
   - Product detail modal
   - Best Deals page
   - Contact page with form
   - Footer
4. Prices displayed in BDT (৳)
5. Images for products: use placeholder images styled appropriately since we cannot mirror the original product images
