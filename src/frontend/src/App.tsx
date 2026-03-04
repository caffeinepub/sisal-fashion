import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  Heart,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { CartItem, CategoryData, Product } from "./backend.d";
import { useActor } from "./hooks/useActor";
import {
  useAddToCart,
  useBestDeals,
  useCart,
  useCategories,
  useProducts,
  useProductsByCategory,
  useUpdateCartItem,
} from "./hooks/useQueries";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: bigint): string {
  return `৳${Number(price).toLocaleString()}`;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Deploy hook ──────────────────────────────────────────────────────────────

function useDeployOnce() {
  const { actor, isFetching } = useActor();
  const deployedRef = useRef(false);
  useEffect(() => {
    if (actor && !isFetching && !deployedRef.current) {
      deployedRef.current = true;
      actor.deploy().catch(() => {});
    }
  }, [actor, isFetching]);
}

// ── Top Marquee Bar ──────────────────────────────────────────────────────────

const MARQUEE_ITEMS = Array.from({ length: 10 }, (_, i) => i);

function TopBar() {
  return (
    <div
      className="w-full overflow-hidden bg-[oklch(var(--green-dark))] py-2"
      style={{ height: "36px" }}
    >
      <div
        className="flex whitespace-nowrap marquee-track"
        style={{ width: "max-content" }}
      >
        {MARQUEE_ITEMS.map((i) => (
          <span
            key={`a-${i}`}
            className="text-white text-xs font-semibold tracking-[0.25em] uppercase mx-8"
          >
            DRESS BETTER
          </span>
        ))}
        {MARQUEE_ITEMS.map((i) => (
          <span
            key={`b-${i}`}
            className="text-white text-xs font-semibold tracking-[0.25em] uppercase mx-8"
          >
            DRESS BETTER
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
  onMenuOpen: () => void;
  onNavigate: (page: Page) => void;
}

function Header({
  cartCount,
  onCartOpen,
  onMenuOpen,
  onNavigate,
}: HeaderProps) {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onNavigate("products");
    }
  };

  return (
    <header className="bg-white shadow-xs border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 md:gap-6">
        {/* Mobile hamburger */}
        <button
          type="button"
          data-ocid="nav.button"
          onClick={onMenuOpen}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => onNavigate("home")}
          className="flex-shrink-0 bg-transparent border-0 p-0 cursor-pointer"
          aria-label="Go to home"
        >
          <img
            src="https://sisalfashion.com/uploads/settings/logo_68d0f3fa88085.png"
            alt="Sisal Fashion"
            width={140}
            height={55}
            className="h-10 md:h-14 w-auto object-contain"
          />
        </button>

        {/* Search - hidden on mobile */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 mx-4 lg:mx-8"
        >
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What are you looking for?"
              data-ocid="nav.search_input"
              className="w-full rounded-full border border-gray-200 bg-gray-50 pl-5 pr-12 py-2.5 text-sm focus:outline-none focus:border-[oklch(var(--green-dark))] focus:ring-2 focus:ring-[oklch(var(--green-dark)/0.15)] transition-all"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center bg-[oklch(var(--green-dark))] text-white rounded-r-full hover:bg-[oklch(var(--green-mid))] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2 ml-auto lg:ml-0">
          {/* Wishlist */}
          <button
            type="button"
            className="relative p-2 text-gray-600 hover:text-[oklch(var(--green-dark))] rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[oklch(var(--red-sale))] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </button>

          {/* Cart */}
          <button
            type="button"
            data-ocid="nav.button"
            onClick={onCartOpen}
            className="relative p-2 text-gray-600 hover:text-[oklch(var(--green-dark))] rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[oklch(var(--red-sale))] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account */}
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-[oklch(var(--green-dark))] rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What are you looking for?"
              data-ocid="nav.search_input"
              className="w-full rounded-full border border-gray-200 bg-gray-50 pl-4 pr-12 py-2 text-sm focus:outline-none focus:border-[oklch(var(--green-dark))] focus:ring-2 focus:ring-[oklch(var(--green-dark)/0.15)] transition-all"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center bg-[oklch(var(--green-dark))] text-white rounded-r-full"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}

// ── Main Nav ─────────────────────────────────────────────────────────────────

interface MainNavProps {
  categories: CategoryData[];
  activePage: Page;
  onNavigate: (page: Page, category?: string, subcategory?: string) => void;
}

function MainNav({ categories, activePage, onNavigate }: MainNavProps) {
  return (
    <nav className="hidden lg:block bg-[oklch(var(--green-dark))] shadow-nav">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex items-center justify-center gap-0">
          {/* Home */}
          <li>
            <button
              type="button"
              data-ocid="nav.link"
              onClick={() => onNavigate("home")}
              className={`px-5 py-3.5 text-sm font-semibold tracking-wide text-white hover:bg-[oklch(var(--green-mid))] transition-colors ${
                activePage === "home" ? "bg-[oklch(var(--green-mid))]" : ""
              }`}
            >
              Home
            </button>
          </li>

          {/* Category dropdowns */}
          {categories.map((cat) => (
            <li key={cat.category} className="nav-item-wrap relative">
              <button
                type="button"
                data-ocid="nav.link"
                onClick={() => onNavigate("products", cat.category)}
                className={`flex items-center gap-1 px-5 py-3.5 text-sm font-semibold tracking-wide text-white hover:bg-[oklch(var(--green-mid))] transition-colors ${
                  activePage === "products" ? "bg-transparent" : ""
                }`}
              >
                {capitalize(cat.category)}
                {cat.subcategories.length > 0 && (
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                )}
              </button>

              {cat.subcategories.length > 0 && (
                <div className="nav-dropdown">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      data-ocid="nav.link"
                      onClick={() => onNavigate("products", cat.category, sub)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[oklch(var(--green-dark))] transition-colors font-medium"
                    >
                      {capitalize(sub)}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}

          {/* Best Deals */}
          <li>
            <button
              type="button"
              data-ocid="nav.link"
              onClick={() => onNavigate("best-deals")}
              className={`px-5 py-3.5 text-sm font-semibold tracking-wide text-white hover:bg-[oklch(var(--green-mid))] transition-colors ${
                activePage === "best-deals"
                  ? "bg-[oklch(var(--green-mid))]"
                  : ""
              }`}
            >
              Best Deals
            </button>
          </li>

          {/* Contact */}
          <li>
            <button
              type="button"
              data-ocid="nav.link"
              onClick={() => onNavigate("contact")}
              className={`px-5 py-3.5 text-sm font-semibold tracking-wide text-white hover:bg-[oklch(var(--green-mid))] transition-colors ${
                activePage === "contact" ? "bg-[oklch(var(--green-mid))]" : ""
              }`}
            >
              Contact
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

// ── Mobile Drawer ─────────────────────────────────────────────────────────────

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryData[];
  onNavigate: (page: Page, category?: string, subcategory?: string) => void;
}

function MobileDrawer({
  open,
  onClose,
  categories,
  onNavigate,
}: MobileDrawerProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const navigate = (page: Page, category?: string, sub?: string) => {
    onNavigate(page, category, sub);
    onClose();
  };

  return (
    <>
      <div
        className={`mobile-overlay ${open ? "open" : ""}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-label="Close menu"
      />
      <aside className={`mobile-drawer ${open ? "open" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-[oklch(var(--green-dark))]">
          <span className="text-white font-bold text-base tracking-wide uppercase">
            Menu
          </span>
          <button
            type="button"
            data-ocid="nav.close_button"
            onClick={onClose}
            className="p-1.5 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-3">
          {/* Home */}
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => navigate("home")}
            className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-colors mb-1"
          >
            Home
          </button>

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2 mt-2">
            Categories
          </div>

          {/* Categories with accordion */}
          {categories.map((cat) => (
            <div key={cat.category} className="mb-1">
              <div className="flex items-center rounded-lg overflow-hidden">
                <button
                  type="button"
                  data-ocid="nav.link"
                  onClick={() =>
                    cat.subcategories.length === 0
                      ? navigate("products", cat.category)
                      : setOpenCategory(
                          openCategory === cat.category ? null : cat.category,
                        )
                  }
                  className="flex-1 text-left flex items-center justify-between px-3 py-3 hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-colors"
                >
                  <span>{capitalize(cat.category)}</span>
                  {cat.subcategories.length > 0 && (
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        openCategory === cat.category ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </button>
              </div>
              {cat.subcategories.length > 0 && (
                <div
                  className={`drawer-sublist pl-4 ${
                    openCategory === cat.category ? "open" : ""
                  }`}
                >
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      data-ocid="nav.link"
                      onClick={() => navigate("products", cat.category, sub)}
                      className="w-full text-left block px-3 py-2.5 text-sm text-gray-600 hover:text-[oklch(var(--green-dark))] hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {capitalize(sub)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-2 mt-3">
            Support
          </div>
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => navigate("best-deals")}
            className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-colors mb-1"
          >
            Best Deals
          </button>
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => navigate("contact")}
            className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-colors"
          >
            Contact Us
          </button>
        </nav>
      </aside>
    </>
  );
}

// ── Cart Panel ────────────────────────────────────────────────────────────────

interface CartPanelProps {
  open: boolean;
  onClose: () => void;
}

function CartPanel({ open, onClose }: CartPanelProps) {
  const { data: cartItems = [], isLoading } = useCart();
  const updateMutation = useUpdateCartItem();
  const queryClient = useQueryClient();

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.qty), 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * Number(item.qty),
    0,
  );

  const updateQty = async (item: CartItem, delta: number) => {
    const newQty = Number(item.qty) + delta;
    if (newQty <= 0) {
      await updateMutation.mutateAsync({
        productId: item.product.id,
        qty: BigInt(0),
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    } else {
      await updateMutation.mutateAsync({
        productId: item.product.id,
        qty: BigInt(newQty),
      });
    }
  };

  return (
    <>
      <div
        className={`cart-overlay ${open ? "open" : ""}`}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-label="Close cart"
      >
        <div
          className="cart-panel"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          aria-label="Shopping cart"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #00512c 0%, #0a7a44 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-white font-bold text-base">Your Cart</h2>
              <span className="bg-white text-[oklch(var(--green-dark))] text-xs font-bold px-2.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            </div>
            <button
              type="button"
              data-ocid="cart.close_button"
              onClick={onClose}
              className="w-8 h-8 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4" data-ocid="cart.list">
            {isLoading ? (
              <div data-ocid="cart.loading_state" className="space-y-3">
                {[1, 2, 3].map((k) => (
                  <div key={k} className="bg-white rounded-xl p-3 flex gap-3">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-7 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : cartItems.length === 0 ? (
              <div
                data-ocid="cart.empty_state"
                className="flex flex-col items-center justify-center h-64 text-gray-400"
              >
                <ShoppingCart className="w-14 h-14 mb-4 opacity-25" />
                <p className="font-semibold text-gray-500 text-base mb-1">
                  Your cart is empty
                </p>
                <p className="text-sm text-gray-400">
                  Add some items to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div
                    key={Number(item.product.id)}
                    data-ocid={`cart.item.${index + 1}`}
                    className="bg-white rounded-xl p-3 flex gap-3 shadow-sm border border-gray-100"
                  >
                    <img
                      src={
                        item.product.imageUrl ||
                        "/assets/generated/product-hoodie.dim_600x700.jpg"
                      }
                      alt={item.product.name}
                      className="w-[72px] h-[72px] object-cover rounded-lg border border-gray-100 flex-shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/assets/generated/product-hoodie.dim_600x700.jpg";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 leading-tight mb-1 line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="font-bold text-sm text-[oklch(var(--green-dark))] mb-2">
                        {formatPrice(
                          BigInt(Number(item.product.price) * Number(item.qty)),
                        )}
                      </p>
                      {/* Qty controls */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-full w-fit px-1 py-1">
                        <button
                          type="button"
                          data-ocid={`cart.toggle.${index + 1}`}
                          onClick={() => updateQty(item, -1)}
                          disabled={updateMutation.isPending}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[oklch(var(--green-dark))] hover:text-white transition-colors disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="min-w-[28px] text-center font-bold text-sm text-gray-900">
                          {Number(item.qty)}
                        </span>
                        <button
                          type="button"
                          data-ocid={`cart.toggle.${index + 1}`}
                          onClick={() => updateQty(item, 1)}
                          disabled={
                            updateMutation.isPending ||
                            Number(item.qty) >= Number(item.product.stock)
                          }
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[oklch(var(--green-dark))] hover:text-white transition-colors disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {/* Delete */}
                    <button
                      type="button"
                      data-ocid={`cart.delete_button.${index + 1}`}
                      onClick={() => updateQty(item, -Number(item.qty))}
                      className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors self-start"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 bg-white border-t border-gray-100 px-5 py-4">
            <div className="flex justify-between items-center mb-3 pb-3 border-b-2 border-dashed border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Subtotal
              </span>
              <span className="text-xl font-extrabold text-gray-900">
                {formatPrice(BigInt(Math.round(subtotal)))}
              </span>
            </div>
            <button
              type="button"
              disabled={cartItems.length === 0}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #00512c 0%, #0a7a44 100%)",
                boxShadow: "0 4px 15px rgba(0,81,44,0.3)",
              }}
              data-ocid="cart.primary_button"
            >
              🔒 Secure Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Product Card Skeleton ─────────────────────────────────────────────────────

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-card border border-gray-100">
      <Skeleton className="w-full aspect-[3/4]" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-9 w-full mt-2" />
      </div>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  index: number;
  onViewDetails: (product: Product) => void;
}

function ProductCard({ product, index, onViewDetails }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const addMutation = useAddToCart();

  const imgSrc = imgError
    ? "/assets/generated/product-hoodie.dim_600x700.jpg"
    : product.imageUrl || "/assets/generated/product-hoodie.dim_600x700.jpg";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addMutation.mutateAsync({ productId: product.id, qty: BigInt(1) });
      toast.success("Added to cart!");
    } catch {
      toast.error("Could not add to cart");
    }
  };

  return (
    <article
      data-ocid={`products.item.${index}`}
      className="product-card bg-white rounded-xl overflow-hidden shadow-card border border-gray-100 cursor-pointer"
      onClick={() => onViewDetails(product)}
      onKeyDown={(e) => e.key === "Enter" && onViewDetails(product)}
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-50">
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Sale badge */}
        {product.isOnSale && (
          <div className="absolute top-2 left-2">
            <span className="badge-sale">SALE</span>
          </div>
        )}
        {/* Out of stock */}
        {Number(product.stock) === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 font-medium mb-1">
          {capitalize(product.subcategory)}
        </p>
        <h3 className="font-semibold text-sm text-gray-900 leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.isOnSale && product.originalPrice ? (
            <>
              <span className="font-bold text-sm text-[oklch(var(--red-sale))]">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </>
          ) : (
            <span className="font-bold text-sm text-[oklch(var(--green-dark))]">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {/* Add to cart */}
        <button
          type="button"
          data-ocid="products.card.button"
          onClick={handleAddToCart}
          disabled={Number(product.stock) === 0 || addMutation.isPending}
          className="w-full py-2 text-xs font-bold tracking-wide uppercase text-white rounded-lg transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #00512c 0%, #0a7a44 100%)",
          }}
        >
          {Number(product.stock) === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

// ── Product Detail Modal ──────────────────────────────────────────────────────

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

function ProductModal({ product, onClose }: ProductModalProps) {
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const addMutation = useAddToCart();

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset state when product changes
  useEffect(() => {
    setQty(1);
    setImgError(false);
  }, [product]);

  const imgSrc =
    imgError || !product?.imageUrl
      ? "/assets/generated/product-hoodie.dim_600x700.jpg"
      : product.imageUrl;

  if (!product) return null;

  const inStock = Number(product.stock) > 0;

  const handleAddToCart = async () => {
    try {
      await addMutation.mutateAsync({
        productId: product.id,
        qty: BigInt(qty),
      });
      toast.success("Added to cart!");
      onClose();
    } catch {
      toast.error("Could not add to cart");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 ${
        product ? "" : "pointer-events-none"
      }`}
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      aria-label="Close product modal"
    >
      <div
        data-ocid="product.modal"
        className="bg-white w-full sm:max-w-3xl sm:rounded-2xl overflow-hidden shadow-modal flex flex-col sm:flex-row max-h-[95vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        aria-label={product?.name ?? "Product details"}
      >
        {/* Image */}
        <div className="relative sm:w-2/5 aspect-square sm:aspect-auto bg-gray-50 flex-shrink-0">
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          {product.isOnSale && (
            <div className="absolute top-3 left-3">
              <span className="badge-sale text-sm px-3 py-1">SALE</span>
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex gap-2 flex-wrap">
              <span className="inline-block bg-[oklch(var(--green-bg))] text-[oklch(var(--green-dark))] text-xs font-semibold px-3 py-1 rounded-full">
                {capitalize(product.category)}
              </span>
              {product.subcategory && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {capitalize(product.subcategory)}
                </span>
              )}
            </div>
            <button
              type="button"
              data-ocid="product.modal.close_button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {product.name}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            {product.description}
          </p>

          <div className="border-t border-gray-100 pt-4 mb-4">
            {/* Price */}
            <div className="mb-3">
              <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider block mb-1">
                Price
              </span>
              {product.isOnSale && product.originalPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-[oklch(var(--red-sale))]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-extrabold text-[oklch(var(--green-dark))]">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-2 h-2 rounded-full ${
                  inStock ? "bg-green-500" : "bg-red-400"
                }`}
              />
              <span className="text-sm text-gray-500">
                {inStock
                  ? `In Stock (${Number(product.stock)} available)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Qty */}
            {inStock && (
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-gray-700">Qty:</span>
                <div className="flex items-center bg-gray-100 rounded-full px-1 py-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[oklch(var(--green-dark))] hover:text-white transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="min-w-[32px] text-center font-bold text-sm">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQty((q) => Math.min(Number(product.stock), q + 1))
                    }
                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[oklch(var(--green-dark))] hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock || addMutation.isPending}
            className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{
              background: "linear-gradient(135deg, #00512c 0%, #0a7a44 100%)",
              boxShadow: "0 4px 15px rgba(0,81,44,0.3)",
            }}
            data-ocid="product.modal.primary_button"
          >
            {!inStock
              ? "Out of Stock"
              : addMutation.isPending
                ? "Adding..."
                : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Hero (Home) ───────────────────────────────────────────────────────────────

interface HeroProps {
  onShopNow: () => void;
}

function Hero({ onShopNow }: HeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #00512c 0%, #0a7a44 50%, #00512c 100%)",
        minHeight: "420px",
      }}
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <p className="text-white/70 text-sm font-semibold tracking-[0.3em] uppercase mb-4">
            New Collection 2025
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            DRESS BETTER
          </h1>
          <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
            Explore the latest fashion for boys, girls &amp; men. Quality
            clothing crafted for everyday style.
          </p>
          <button
            type="button"
            data-ocid="hero.primary_button"
            onClick={onShopNow}
            className="inline-flex items-center gap-2 bg-white text-[oklch(var(--green-dark))] font-bold text-sm px-8 py-3.5 rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Shop Now
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Image placeholder - brand pattern */}
        <div className="flex-shrink-0 lg:w-80 xl:w-96">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
            <img
              src="/assets/generated/hero-fashion.dim_600x600.jpg"
              alt="Sisal Fashion Collection"
              className="w-full h-full object-cover"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                const parent = el.parentElement;
                if (parent) {
                  parent.style.background = "rgba(255,255,255,0.1)";
                  parent.innerHTML = `<div class="flex items-center justify-center h-full text-white/50 text-6xl">👗</div>`;
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Featured Products ─────────────────────────────────────────────────────────

interface FeaturedProductsProps {
  onViewDetails: (product: Product) => void;
  onNavigate: (page: Page) => void;
}

function FeaturedProducts({
  onViewDetails,
  onNavigate,
}: FeaturedProductsProps) {
  const { data: products = [], isLoading } = useProducts();
  const featured = products.slice(0, 6);

  return (
    <section className="bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Featured Products
          </h2>
          <button
            type="button"
            data-ocid="products.link"
            onClick={() => onNavigate("products")}
            className="text-sm font-semibold text-[oklch(var(--green-dark))] hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div
            data-ocid="products.loading_state"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
          >
            {Array.from({ length: 6 }, (_, i) => i).map((i) => (
              <ProductCardSkeleton key={`feat-skel-${i}`} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div
            data-ocid="products.empty_state"
            className="text-center py-16 text-gray-400"
          >
            <p className="font-semibold">No products yet. Check back soon!</p>
          </div>
        ) : (
          <div
            data-ocid="products.list"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
          >
            {featured.map((product, i) => (
              <ProductCard
                key={Number(product.id)}
                product={product}
                index={i + 1}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Products Page ─────────────────────────────────────────────────────────────

interface ProductsPageProps {
  initialCategory?: string;
  initialSubcategory?: string;
  onViewDetails: (product: Product) => void;
}

function ProductsPage({
  initialCategory,
  initialSubcategory,
  onViewDetails,
}: ProductsPageProps) {
  const { data: categories = [] } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory || "All",
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string>(
    initialSubcategory || "",
  );

  // Update when props change
  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
    if (initialSubcategory) setActiveSubcategory(initialSubcategory);
  }, [initialCategory, initialSubcategory]);

  const { data: products = [], isLoading } = useProductsByCategory(
    activeCategory === "All" ? "" : activeCategory,
  );

  // Further filter by subcategory client-side
  const displayed =
    activeSubcategory && activeSubcategory !== ""
      ? products.filter(
          (p) =>
            p.subcategory.toLowerCase() === activeSubcategory.toLowerCase(),
        )
      : products;

  const activeCatData = categories.find(
    (c) => c.category.toLowerCase() === activeCategory.toLowerCase(),
  );

  return (
    <section className="bg-[oklch(var(--green-bg))] min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">
          {activeCategory === "All"
            ? "All Products"
            : capitalize(activeCategory)}
        </h1>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-4" data-ocid="products.tab">
          {["All", ...categories.map((c) => c.category)].map((cat) => (
            <button
              key={cat}
              type="button"
              data-ocid="products.tab"
              onClick={() => {
                setActiveCategory(cat);
                setActiveSubcategory("");
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-[oklch(var(--green-dark))] text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat === "All" ? "All" : capitalize(cat)}
            </button>
          ))}
        </div>

        {/* Subcategory pills */}
        {activeCatData && activeCatData.subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              type="button"
              onClick={() => setActiveSubcategory("")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeSubcategory === ""
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All
            </button>
            {activeCatData.subcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setActiveSubcategory(sub)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeSubcategory === sub
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {capitalize(sub)}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div
            data-ocid="products.loading_state"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {Array.from({ length: 8 }, (_, i) => i).map((i) => (
              <ProductCardSkeleton key={`prod-skel-${i}`} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div
            data-ocid="products.empty_state"
            className="text-center py-20 text-gray-400"
          >
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-25" />
            <p className="font-semibold text-gray-500 text-lg">
              No products found
            </p>
            <p className="text-sm mt-1">
              {activeCategory === "All"
                ? "Check back soon!"
                : `No products in ${capitalize(activeCategory)} ${
                    activeSubcategory
                      ? `/ ${capitalize(activeSubcategory)}`
                      : ""
                  }`}
            </p>
          </div>
        ) : (
          <div
            data-ocid="products.list"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {displayed.map((product, i) => (
              <ProductCard
                key={Number(product.id)}
                product={product}
                index={i + 1}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Best Deals Page ───────────────────────────────────────────────────────────

interface BestDealsPageProps {
  onViewDetails: (product: Product) => void;
}

function BestDealsPage({ onViewDetails }: BestDealsPageProps) {
  const { data: products = [], isLoading } = useBestDeals();

  return (
    <section className="bg-[oklch(var(--green-bg))] min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Banner */}
        <div
          className="rounded-2xl p-8 mb-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #00512c 0%, #0a7a44 100%)",
          }}
        >
          <div className="relative z-10">
            <p className="text-white/70 text-xs font-bold tracking-widest uppercase mb-2">
              Limited Time Offers
            </p>
            <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-2">
              🔥 Best Deals
            </h1>
            <p className="text-white/80 text-sm md:text-base">
              Exclusive discounts on selected items. Shop while stocks last!
            </p>
          </div>
          {/* Decorative */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] opacity-10 pointer-events-none select-none">
            %
          </div>
        </div>

        {isLoading ? (
          <div
            data-ocid="deals.loading_state"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {Array.from({ length: 8 }, (_, i) => i).map((i) => (
              <ProductCardSkeleton key={`deals-skel-${i}`} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div
            data-ocid="deals.empty_state"
            className="text-center py-20 text-gray-400"
          >
            <p className="text-5xl mb-4">🏷️</p>
            <p className="font-semibold text-gray-500 text-lg">
              No deals right now
            </p>
            <p className="text-sm mt-1">Check back soon for special offers!</p>
          </div>
        ) : (
          <div
            data-ocid="deals.list"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {products.map((product, i) => (
              <ProductCard
                key={Number(product.id)}
                product={product}
                index={i + 1}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Contact Page ──────────────────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="bg-[oklch(var(--green-bg))] min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          {/* Header */}
          <div
            className="px-8 py-8"
            style={{
              background: "linear-gradient(135deg, #00512c 0%, #0a7a44 100%)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-white text-2xl font-extrabold">Contact Us</h1>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Have a question or feedback? Send us a message and we'll get back
              to you as soon as possible.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Full Name *
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="contact.input"
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:border-[oklch(var(--green-dark))] focus:ring-2 focus:ring-[oklch(var(--green-dark)/0.15)] transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Email Address *
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                data-ocid="contact.input"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:border-[oklch(var(--green-dark))] focus:ring-2 focus:ring-[oklch(var(--green-dark)/0.15)] transition-all"
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Message *
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                data-ocid="contact.textarea"
                placeholder="Write your message here..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:border-[oklch(var(--green-dark))] focus:ring-2 focus:ring-[oklch(var(--green-dark)/0.15)] transition-all resize-none"
              />
            </div>

            {submitted && (
              <div
                data-ocid="contact.success_state"
                className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm font-semibold"
              >
                ✅ Message sent successfully!
              </div>
            )}

            <button
              type="submit"
              data-ocid="contact.submit_button"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #00512c 0%, #0a7a44 100%)",
                boxShadow: "0 4px 15px rgba(0,81,44,0.3)",
              }}
            >
              Send Message
            </button>
          </form>

          {/* Info */}
          <div className="px-8 pb-8 pt-2 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-[oklch(var(--green-dark))] font-semibold">
                  📧
                </span>
                <span>info@sisalfashion.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[oklch(var(--green-dark))] font-semibold">
                  🌐
                </span>
                <a
                  href="https://sisalfashion.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[oklch(var(--green-dark))] transition-colors"
                >
                  sisalfashion.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

interface FooterProps {
  onNavigate: (page: Page) => void;
}

function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer
      className="text-white py-12 px-4"
      style={{
        background: "linear-gradient(135deg, #00512c 0%, #0a7a44 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <img
              src="https://sisalfashion.com/uploads/settings/logo_68d0f3fa88085.png"
              alt="Sisal Fashion"
              width={120}
              height={48}
              className="h-10 w-auto object-contain mb-4 brightness-200"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <h3 className="text-xl font-extrabold mb-2">Sisal Fashion</h3>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              <em>Dress Better</em> — Your destination for quality fashion for
              boys, girls &amp; men. Affordable style delivered to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", page: "home" as Page },
                { label: "Products", page: "products" as Page },
                { label: "Best Deals", page: "best-deals" as Page },
                { label: "Contact", page: "contact" as Page },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    data-ocid="footer.link"
                    onClick={() => onNavigate(item.page)}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>📧 info@sisalfashion.com</li>
              <li>🌐 sisalfashion.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {year} Sisal Fashion. All rights reserved.</p>
          <p>
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Page Types ────────────────────────────────────────────────────────────────

type Page = "home" | "products" | "best-deals" | "contact";

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  useDeployOnce();

  const [page, setPage] = useState<Page>("home");
  const [pageCategory, setPageCategory] = useState<string>("");
  const [pageSubcategory, setPageSubcategory] = useState<string>("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: categories = [] } = useCategories();
  const { data: cartItems = [] } = useCart();

  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.qty), 0);

  const navigate = (p: Page, category?: string, subcategory?: string) => {
    setPage(p);
    setPageCategory(category || "");
    setPageSubcategory(subcategory || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const productsRef = useRef<HTMLDivElement>(null);

  const handleShopNow = () => {
    setPage("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopBar />
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onMenuOpen={() => setMenuOpen(true)}
        onNavigate={navigate}
      />
      <MainNav
        categories={categories}
        activePage={page}
        onNavigate={navigate}
      />
      <MobileDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        categories={categories}
        onNavigate={navigate}
      />

      <main className="flex-1" ref={productsRef}>
        {page === "home" && (
          <>
            <Hero onShopNow={handleShopNow} />
            <FeaturedProducts
              onViewDetails={setSelectedProduct}
              onNavigate={navigate}
            />
          </>
        )}
        {page === "products" && (
          <ProductsPage
            initialCategory={pageCategory}
            initialSubcategory={pageSubcategory}
            onViewDetails={setSelectedProduct}
          />
        )}
        {page === "best-deals" && (
          <BestDealsPage onViewDetails={setSelectedProduct} />
        )}
        {page === "contact" && <ContactPage />}
      </main>

      <Footer onNavigate={navigate} />

      {/* Cart */}
      <CartPanel open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Product modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}
