import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User,
  X,
  Youtube,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

// ── Hero Carousel ─────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    src: "https://sisalfashion.com/uploads/banners/1768455643_5PjFxEK2_Untitled design(12).jpg",
    alt: "Winter Collection Banner",
  },
  {
    src: "https://sisalfashion.com/uploads/banners/1768455669_AAkflPlp_Untitled design(13).jpg",
    alt: "Winter Collection for Children",
  },
  {
    src: "https://sisalfashion.com/uploads/banners/1768455692_sqeUTVO5_Untitled design(14).jpg",
    alt: "Winter Collection for Men",
  },
];

interface HeroCarouselProps {
  onShopNow: () => void;
}

function HeroCarousel({ onShopNow }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = HERO_SLIDES.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-100"
      style={{ height: "clamp(260px, 55vw, 600px)" }}
    >
      {/* Slides */}
      {HERO_SLIDES.map((slide, i) => (
        <button
          key={slide.src}
          type="button"
          data-ocid="hero.primary_button"
          onClick={onShopNow}
          className="absolute inset-0 w-full h-full border-0 p-0 cursor-pointer"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.7s ease-in-out",
            zIndex: i === current ? 1 : 0,
          }}
          aria-label={slide.alt}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
        </button>
      ))}

      {/* Prev arrow */}
      <button
        type="button"
        data-ocid="hero.secondary_button"
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Next arrow */}
      <button
        type="button"
        data-ocid="hero.secondary_button"
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrent(i);
            }}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// ── Categories Section ────────────────────────────────────────────────────────

const STATIC_CATEGORIES = [
  {
    label: "BOYS",
    key: "Boys",
    image:
      "https://sisalfashion.com/uploads/categories/1762867636_691339b4736ef.jpeg",
  },
  {
    label: "GIRLS",
    key: "Girls",
    image:
      "https://sisalfashion.com/uploads/categories/1762867547_6913395bde723.jpeg",
  },
  {
    label: "MENS",
    key: "Mens",
    image:
      "https://sisalfashion.com/uploads/categories/1762867424_691338e062971.jpeg",
  },
  {
    label: "INFANT",
    key: "Infant",
    image: "/assets/uploads/1772703362453-1.png",
  },
];

// ── Static Product & Category Data ───────────────────────────────────────────

const STATIC_CATEGORY_DATA: CategoryData[] = [
  { category: "Boys", subcategories: ["Hoodie", "Jogger", "Sweat Shirt"] },
  { category: "Girls", subcategories: ["Hoodie", "Sweat Shirt"] },
  {
    category: "Mens",
    subcategories: [
      "Hoodie",
      "Jogger",
      "Long Sleeve T-Shirt",
      "Mens Polo",
      "Sweat Shirt",
    ],
  },
  { category: "Infant", subcategories: ["Girls"] },
];

const STATIC_PRODUCTS: Product[] = [
  // Boys > Hoodie (9 products)
  {
    id: 1001n,
    name: "W5-BH: 01",
    description: "95% Poly 5% Elastane Popcorn Design, 280 GSM",
    price: 455n,
    originalPrice: 650n,
    category: "Boys",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762855837_69130b9d59743.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1002n,
    name: "W5-BH: 02",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 420n,
    originalPrice: 600n,
    category: "Boys",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762855772_69130b5ca6d8e.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1003n,
    name: "W5-BH: 03",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 490n,
    originalPrice: 700n,
    category: "Boys",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856539_69130e5b2981e.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1004n,
    name: "W5-BH: 04",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 420n,
    originalPrice: 600n,
    category: "Boys",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856502_69130e3630630.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1005n,
    name: "W5-BH: 05",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 455n,
    originalPrice: 650n,
    category: "Boys",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856472_69130e1861c53.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1006n,
    name: "W5-BH: 06",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 455n,
    originalPrice: 650n,
    category: "Boys",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856066_69130c824e6f4.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1007n,
    name: "W5-BH: 07",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 455n,
    originalPrice: 650n,
    category: "Boys",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762855974_69130c26f11b4.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1008n,
    name: "W5-BH: 08",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 455n,
    originalPrice: 650n,
    category: "Boys",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762855882_69130bca7ba9e.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1009n,
    name: "W5-BH: 09",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 490n,
    originalPrice: 700n,
    category: "Boys",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1763185980_6918153cb3d56.jpg",
    isOnSale: true,
    stock: 50n,
  },
  // Boys > Jogger (6 products)
  {
    id: 1101n,
    name: "W5-BJ: 01",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 385n,
    originalPrice: 550n,
    category: "Boys",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762865337_691330b99081c.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1102n,
    name: "W5-BJ: 02",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 385n,
    originalPrice: 550n,
    category: "Boys",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762865196_6913302c196ad.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1103n,
    name: "W5-BJ: 03",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 315n,
    originalPrice: 450n,
    category: "Boys",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762865074_69132fb29d1a8.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1104n,
    name: "W5-BJ: 04",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 350n,
    originalPrice: 500n,
    category: "Boys",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762864906_69132f0ab5203.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1105n,
    name: "W5-BJ: 05",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 385n,
    originalPrice: 550n,
    category: "Boys",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762864634_69132dfabe78d.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1106n,
    name: "W5-BJ: 06",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 385n,
    originalPrice: 550n,
    category: "Boys",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762864386_69132d0201d6e.jpg",
    isOnSale: true,
    stock: 50n,
  },
  // Boys > Sweat Shirt (8 products)
  {
    id: 1201n,
    name: "W5-BST: 01",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 315n,
    originalPrice: 450n,
    category: "Boys",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762861921_6913236148d01.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1202n,
    name: "W5-BST: 02",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 315n,
    originalPrice: 450n,
    category: "Boys",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762859587_69131a43c8fa8.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1203n,
    name: "W5-BST: 03",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 315n,
    originalPrice: 450n,
    category: "Boys",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762859198_691318be699d1.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1204n,
    name: "W5-BST: 04",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 455n,
    originalPrice: 650n,
    category: "Boys",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762858087_6913146775b6f.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1205n,
    name: "W5-BST: 05",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 350n,
    originalPrice: 500n,
    category: "Boys",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762857540_691312448d5e9.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1206n,
    name: "W5-BST: 06",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 385n,
    originalPrice: 550n,
    category: "Boys",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762857141_691310b541e98.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1207n,
    name: "W5-BST: 07",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 350n,
    originalPrice: 500n,
    category: "Boys",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856819_69130f7313e6a.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 1208n,
    name: "W5-BST: 08",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 350n,
    originalPrice: 500n,
    category: "Boys",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1763634281_691eec69b5edb.jpg",
    isOnSale: true,
    stock: 50n,
  },
  // Girls > Hoodie (9 products)
  {
    id: 2001n,
    name: "W5-GH: 01",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 420n,
    originalPrice: 600n,
    category: "Girls",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762855803_69130b7b6c429.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2002n,
    name: "W5-GH: 02",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 455n,
    originalPrice: 650n,
    category: "Girls",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762862062_691323ee4926a.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2003n,
    name: "W5-GH: 03",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 455n,
    originalPrice: 650n,
    category: "Girls",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762862284_691324cc13d3d.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2004n,
    name: "W5-GH: 04",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 385n,
    originalPrice: 550n,
    category: "Girls",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762862497_691325a15e9bb.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2005n,
    name: "W5-GH: 05",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 455n,
    originalPrice: 650n,
    category: "Girls",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762862708_6913267434f03.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2006n,
    name: "W5-GH: 06",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 455n,
    originalPrice: 650n,
    category: "Girls",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762862901_6913273522dee.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2007n,
    name: "W5-GH: 07",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 420n,
    originalPrice: 600n,
    category: "Girls",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762863100_691327fc3ba68.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2008n,
    name: "W5-GH: 08",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 455n,
    originalPrice: 650n,
    category: "Girls",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762863362_691329028debc.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2009n,
    name: "W5-GH: 09",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 455n,
    originalPrice: 650n,
    category: "Girls",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762863621_69132a0579276.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  // Girls > Sweat Shirt (9 products)
  {
    id: 2101n,
    name: "W5-GST: 01",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 315n,
    originalPrice: 450n,
    category: "Girls",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762864412_69132d1ceedec.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2102n,
    name: "W5-GST: 02",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 315n,
    originalPrice: 450n,
    category: "Girls",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762864652_69132e0cf0d23.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2103n,
    name: "W5-GST: 03",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 315n,
    originalPrice: 450n,
    category: "Girls",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762864828_69132ebc4a3ff.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2104n,
    name: "W5-GST: 04",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 406n,
    originalPrice: 580n,
    category: "Girls",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762865036_69132f8c9aea7.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2105n,
    name: "W5-GST: 05",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 350n,
    originalPrice: 500n,
    category: "Girls",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762865236_69133054e2eab.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2106n,
    name: "W5-GST: 06",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 350n,
    originalPrice: 500n,
    category: "Girls",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762865408_69133100cc4aa.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2107n,
    name: "W5-GST: 07",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 350n,
    originalPrice: 500n,
    category: "Girls",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762865601_691331c1a1297.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2108n,
    name: "W5-GST: 08",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 420n,
    originalPrice: 600n,
    category: "Girls",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762865787_6913327b10bed.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 2109n,
    name: "W5-GST: 09",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 420n,
    originalPrice: 600n,
    category: "Girls",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762865965_6913332d11c7a.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  // Mens > Hoodie (21 products)
  {
    id: 3001n,
    name: "W5-MH: 01",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 893n,
    originalPrice: 1275n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762855734_69130b363efd4.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3002n,
    name: "W5-MH: 02",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 753n,
    originalPrice: 1075n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856333_69130d8d222c6.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3003n,
    name: "W5-MH: 03",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 753n,
    originalPrice: 1075n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762855920_69130bf02d742.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3004n,
    name: "W5-MH: 04",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 753n,
    originalPrice: 1075n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762855947_69130c0b68133.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3005n,
    name: "W5-MH: 05",
    description: "Polyester Design Fabric",
    price: 735n,
    originalPrice: 1050n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856003_69130c4302d32.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3006n,
    name: "W5-MH: 06",
    description: "Polyester Design Fabric",
    price: 770n,
    originalPrice: 1100n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856025_69130c5902129.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3007n,
    name: "W5-MH: 07",
    description: "80% cotton 20% polyester 290 GSM QUILTED Fleece",
    price: 875n,
    originalPrice: 1250n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856104_69130ca838902.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3009n,
    name: "W5-MH: 09",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 735n,
    originalPrice: 1050n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856170_69130ceab451a.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3010n,
    name: "W5-MH: 10",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 753n,
    originalPrice: 1075n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856197_69130d0516185.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3011n,
    name: "W5-MH: 11",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 735n,
    originalPrice: 1050n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856222_69130d1ebda47.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3012n,
    name: "W5-MH: 12",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 770n,
    originalPrice: 1100n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856260_69130d446e41d.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3013n,
    name: "W5-MH: 13",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 735n,
    originalPrice: 1050n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856296_69130d6826dc1.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3014n,
    name: "W5-MH: 14",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 858n,
    originalPrice: 1225n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762855667_69130af300dd8.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3015n,
    name: "W5-MH: 15",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 560n,
    originalPrice: 800n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762857465_691311f979f37.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3016n,
    name: "W5-MH: 16",
    description: "Polyester Design Fabric",
    price: 805n,
    originalPrice: 1150n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856398_69130dce2ce66.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3017n,
    name: "W5-MH: 17",
    description: "Polyester Design Fabric",
    price: 805n,
    originalPrice: 1150n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856365_69130dad5a51b.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3018n,
    name: "W5-MH: 18",
    description: "Polyester Design Fabric",
    price: 805n,
    originalPrice: 1150n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762855710_69130b1e3d97f.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3019n,
    name: "W5-MH: 19",
    description: "Polyester Design Fabric",
    price: 875n,
    originalPrice: 1250n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856442_69130dfa1f039.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3020n,
    name: "W5-MH: 20",
    description: "Polyester Design Fabric",
    price: 805n,
    originalPrice: 1150n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856583_69130e87e74ec.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3021n,
    name: "W5-MH: 21",
    description: "Polyester Design Fabric",
    price: 875n,
    originalPrice: 1250n,
    category: "Mens",
    subcategory: "Hoodie",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762857211_691310fb95adf.jpg",
    isOnSale: true,
    stock: 50n,
  },
  // Mens > Jogger (7 products)
  {
    id: 3101n,
    name: "W5-MJ: 15",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 665n,
    originalPrice: 950n,
    category: "Mens",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762858817_691317412d83d.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3102n,
    name: "W5-MJ: 16",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 665n,
    originalPrice: 950n,
    category: "Mens",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762859853_69131b4d0a8f1.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3103n,
    name: "W5-MJ: 17",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 665n,
    originalPrice: 950n,
    category: "Mens",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762860771_69131ee32e061.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3104n,
    name: "W5-MJ: 18",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 665n,
    originalPrice: 950n,
    category: "Mens",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762860943_69131f8f81249.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3105n,
    name: "W5-MJ: 19",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 665n,
    originalPrice: 950n,
    category: "Mens",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762861103_6913202f1df76.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3106n,
    name: "W5-MJ: 20",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 665n,
    originalPrice: 950n,
    category: "Mens",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762861257_691320c927f4f.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3107n,
    name: "W5-MJ: 21",
    description: "60% cotton 40% polyester French Terry, 280 GSM",
    price: 665n,
    originalPrice: 950n,
    category: "Mens",
    subcategory: "Jogger",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762861419_6913216b46384.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  // Mens > Long Sleeve T-Shirt (5 products)
  {
    id: 3201n,
    name: "W5-MSL: 01",
    description: "100% Cotton wafale, 200 GSM",
    price: 315n,
    originalPrice: 450n,
    category: "Mens",
    subcategory: "Long Sleeve T-Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762866408_691334e879bf1.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3202n,
    name: "W5-MSL: 02",
    description: "100% Cotton wafale, 200 GSM",
    price: 315n,
    originalPrice: 450n,
    category: "Mens",
    subcategory: "Long Sleeve T-Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762866589_6913359d7bf5e.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3203n,
    name: "W5-MSL: 03",
    description: "95% cotton 5% spandex 200 GSM",
    price: 315n,
    originalPrice: 450n,
    category: "Mens",
    subcategory: "Long Sleeve T-Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762866795_6913366b7ed9b.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3204n,
    name: "W5-MSL: 04",
    description: "95% cotton 5% spandex 200 GSM",
    price: 315n,
    originalPrice: 450n,
    category: "Mens",
    subcategory: "Long Sleeve T-Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762866999_69133737decf9.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3205n,
    name: "W5-MSL: 05",
    description: "95% cotton 5% spandex 200 GSM",
    price: 315n,
    originalPrice: 450n,
    category: "Mens",
    subcategory: "Long Sleeve T-Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762867154_691337d2eb9f7.jpg",
    isOnSale: true,
    stock: 50n,
  },
  // Mens > Sweat Shirt (4 products)
  {
    id: 3301n,
    name: "W5-MST: 01",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 805n,
    originalPrice: 1150n,
    category: "Mens",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856757_69130f35c8117.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3302n,
    name: "W5-MST: 02",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 805n,
    originalPrice: 1150n,
    category: "Mens",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856928_69130fe09a58a.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3303n,
    name: "W5-MST: 03",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 770n,
    originalPrice: 1100n,
    category: "Mens",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762856958_69130ffea0806.jpg",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 3304n,
    name: "W5-MST: 04",
    description: "60% cotton 40% polyester 280 GSM Brushed Fleece",
    price: 665n,
    originalPrice: 950n,
    category: "Mens",
    subcategory: "Sweat Shirt",
    imageUrl:
      "https://sisalfashion.com/uploads/products/1762857795_6913134356ba7.jpeg",
    isOnSale: true,
    stock: 50n,
  },
  // Infant Girls > Clothing (6 products)
  {
    id: 4001n,
    name: "Tropic Panda Adventure Set",
    description:
      'A vibrant teal blue outfit featuring a dress and matching capri leggings. The dress showcases a dynamic print of colorful tropical flowers, leaves, and pandas playing. The leggings include the same floral motif and a "FUN TIMES" graphic near the ankle.',
    price: 250n,
    originalPrice: 350n,
    category: "Infant",
    subcategory: "Girls",
    imageUrl: "/assets/uploads/IMG_20260305_151624-3.png",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 4002n,
    name: "Fluttering Butterfly Dream Dress",
    description:
      "A charming pink empire-waist dress adorned with a print of colorful monarch and swallowtail butterflies. The dress features short sleeves and a flared skirt.",
    price: 275n,
    originalPrice: 400n,
    category: "Infant",
    subcategory: "Girls",
    imageUrl: "/assets/uploads/IMG_20260305_151700-2.png",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 4003n,
    name: "Happy Days Splatter Tee and Shorts",
    description:
      'A cheerful and casual two-piece set in bright yellow. The short-sleeve top features a colorful watercolor paint splatter design with "HAPPY DAYS!" in bold white text. The matching shorts have a coordinating color-block pattern.',
    price: 300n,
    originalPrice: 430n,
    category: "Infant",
    subcategory: "Girls",
    imageUrl: "/assets/uploads/IMG_20260305_151721-1.png",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 4004n,
    name: "Panda Playtime Pajama Set",
    description:
      "A cozy green pajama set featuring an all-over repeating print of adorable pandas playing in bamboo. The set includes a short-sleeve top and matching long leggings.",
    price: 315n,
    originalPrice: 450n,
    category: "Infant",
    subcategory: "Girls",
    imageUrl: "/assets/uploads/IMG_20260305_151740-6.png",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 4005n,
    name: "Abstract Geo-Chic Tunic and Leggings",
    description:
      "A modern two-piece set with a striking abstract geometric pattern. The blue short-sleeve tunic dress features overlapping triangles and shapes in orange, purple, and red. Paired with solid blue leggings that include a small print detail near the cuff.",
    price: 330n,
    originalPrice: 470n,
    category: "Infant",
    subcategory: "Girls",
    imageUrl: "/assets/uploads/IMG_20260305_151812-5.png",
    isOnSale: true,
    stock: 50n,
  },
  {
    id: 4006n,
    name: "Cosmic Adventure Awaits Set",
    description:
      'A whimsical purple two-piece set with a space theme. The short-sleeve top features various space-related graphics like rockets, planets, and stars. It also has "ADVENTURE AWAITS" text at the bottom, which is repeated on the matching purple leggings.',
    price: 350n,
    originalPrice: 500n,
    category: "Infant",
    subcategory: "Girls",
    imageUrl: "/assets/uploads/IMG_20260305_151838-4.png",
    isOnSale: true,
    stock: 50n,
  },
];

interface CategoriesSectionProps {
  onNavigate: (page: Page, category?: string) => void;
}

function CategoriesSection({ onNavigate }: CategoriesSectionProps) {
  return (
    <section className="bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Categories
          </h2>
          <button
            type="button"
            data-ocid="categories.link"
            onClick={() => onNavigate("products")}
            className="text-sm font-semibold text-[oklch(var(--green-dark))] hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATIC_CATEGORIES.map((cat, i) => (
            <button
              key={cat.key}
              type="button"
              data-ocid={`categories.item.${i + 1}`}
              onClick={() => onNavigate("products", cat.key)}
              className="group rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-white text-left"
            >
              <div className="aspect-square overflow-hidden bg-gray-100 relative">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-4xl">
                    👶
                  </div>
                )}
              </div>
              <div className="p-3 text-center">
                <span className="text-sm font-bold text-gray-800 tracking-wide uppercase">
                  {cat.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── New Arrivals Section ──────────────────────────────────────────────────────

interface ProductGridSectionProps {
  title: string;
  products: Product[];
  isLoading: boolean;
  onViewDetails: (product: Product) => void;
  onNavigate: (page: Page) => void;
  scopeId: string;
}

function ProductGridSection({
  title,
  products,
  isLoading,
  onViewDetails,
  onNavigate,
  scopeId,
}: ProductGridSectionProps) {
  return (
    <section className="bg-white py-8 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            data-ocid={`${scopeId}.link`}
            onClick={() => onNavigate("products")}
            className="text-sm font-semibold text-[oklch(var(--green-dark))] hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div
            data-ocid={`${scopeId}.loading_state`}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {Array.from({ length: 8 }, (_, i) => i).map((i) => (
              <ProductCardSkeleton key={`${scopeId}-skel-${i}`} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div
            data-ocid={`${scopeId}.empty_state`}
            className="text-center py-12 text-gray-400"
          >
            <p className="font-semibold">No products yet. Check back soon!</p>
          </div>
        ) : (
          <div
            data-ocid={`${scopeId}.list`}
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

// ── Promo Banners data ────────────────────────────────────────────────────────

const PROMO_BANNERS = [
  {
    src: "https://sisalfashion.com/uploads/banners/1763183072_98rCMJNa_sisal banner 13 nov_.jpg",
    alt: "Sisal Fashion Promo Banner 1",
  },
  {
    src: "https://sisalfashion.com/uploads/banners/1763270338_yMNAxQLA_sisal bannner 15 nov_.jpg",
    alt: "Sisal Fashion Promo Banner 2",
  },
  {
    src: "https://sisalfashion.com/uploads/banners/1763270431_VAClRbZr_sisal 15 nov. banner 2.jpg",
    alt: "Sisal Fashion Promo Banner 3",
  },
];

// ── Collections Section (YouTube Video) ──────────────────────────────────────

interface CollectionsSectionProps {
  onNavigate: (page: Page) => void;
}

function CollectionsSection({ onNavigate }: CollectionsSectionProps) {
  return (
    <section className="bg-white py-8 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Collections
          </h2>
          <button
            type="button"
            data-ocid="collections.link"
            onClick={() => onNavigate("products")}
            className="text-sm font-semibold text-[oklch(var(--green-dark))] hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div
          className="relative w-full rounded-xl overflow-hidden shadow-sm"
          style={{ paddingBottom: "56.25%" }}
        >
          <iframe
            src="https://www.youtube.com/embed/uikq_pUbayk"
            title="Sisal Fashion Collections"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </section>
  );
}

// ── Big Deals Section ─────────────────────────────────────────────────────────

interface BigDealsSectionProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
  onNavigate: (page: Page) => void;
}

function BigDealsSection({
  products,
  onViewDetails,
  onNavigate,
}: BigDealsSectionProps) {
  return (
    <section className="bg-[oklch(var(--green-bg))] py-8 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Big Deals
            </h2>
          </div>
          <button
            type="button"
            data-ocid="deals.link"
            onClick={() => onNavigate("best-deals")}
            className="text-sm font-semibold text-[oklch(var(--green-dark))] hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {products.length === 0 ? (
          <div
            data-ocid="deals.empty_state"
            className="text-center py-10 text-gray-400"
          >
            <p className="font-semibold">
              No deals right now. Check back soon!
            </p>
          </div>
        ) : (
          <div
            data-ocid="deals.list"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
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

// ── Bottom Banners ────────────────────────────────────────────────────────────

interface BottomBannersProps {
  onNavigate: (page: Page) => void;
}

function BottomBanners({ onNavigate }: BottomBannersProps) {
  return (
    <section className="bg-white py-8 px-4 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PROMO_BANNERS.map((banner, i) => (
            <button
              key={banner.src}
              type="button"
              data-ocid={`promo.item.${i + 1}`}
              onClick={() => onNavigate("products")}
              className="block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border-0 p-0 cursor-pointer"
            >
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <img
                  src={banner.src}
                  alt={banner.alt}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </button>
          ))}
        </div>
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
  const categories = STATIC_CATEGORY_DATA;
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

  const products = useMemo(() => {
    if (!activeCategory || activeCategory === "All") return STATIC_PRODUCTS;
    return STATIC_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === activeCategory.toLowerCase(),
    );
  }, [activeCategory]);
  const isLoading = false;

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
  const products = STATIC_PRODUCTS.filter((p) => p.isOnSale);
  const isLoading = false;

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
      className="text-white pt-12 pb-6 px-4"
      style={{
        background: "linear-gradient(135deg, #00512c 0%, #0a7a44 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Column 1 — Brand */}
          <div>
            <img
              src="https://sisalfashion.com/uploads/settings/logo_68d0f3fa88085.png"
              alt="Sisal Fashion"
              width={140}
              height={55}
              className="h-12 w-auto object-contain mb-4 brightness-200"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              Your trusted partner for fashion and styles
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/sisalfashion"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.link"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.instagram.com/sisalfashion/"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.link"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@Sisalfashion"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.link"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 text-white" />
              </a>
              <a
                href="https://wa.me/8801312-809597"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="footer.link"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  data-ocid="footer.link"
                  onClick={() => onNavigate("products")}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  data-ocid="footer.link"
                  className="text-sm text-white/70 hover:text-white transition-colors cursor-default"
                >
                  Visual Stories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  data-ocid="footer.link"
                  className="text-sm text-white/70 hover:text-white transition-colors cursor-default"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 — Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  type="button"
                  data-ocid="footer.link"
                  onClick={() => onNavigate("contact")}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  data-ocid="footer.link"
                  className="text-sm text-white/70 hover:text-white transition-colors cursor-default"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  data-ocid="footer.link"
                  className="text-sm text-white/70 hover:text-white transition-colors cursor-default"
                >
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4 — Contact Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
              Contact Info
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-60" />
                <span>admin@sisalfashion.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 opacity-60" />
                <span className="leading-relaxed">
                  Head Office &amp; Factory: Purbahati, Natunpara, Hemayetpur,
                  Savar Dhaka-1340
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
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

// ── Home Content ──────────────────────────────────────────────────────────────

interface HomeContentProps {
  onShopNow: () => void;
  onViewDetails: (product: Product) => void;
  onNavigate: (page: Page, category?: string) => void;
}

function HomeContent({
  onShopNow,
  onViewDetails,
  onNavigate,
}: HomeContentProps) {
  const allProducts = STATIC_PRODUCTS;

  // New Arrivals: 2 from each of Boys, Girls, Mens, Infant = up to 8 mixed products
  const newArrivals = [
    ...allProducts.filter((p) => p.category === "Boys").slice(0, 2),
    ...allProducts.filter((p) => p.category === "Girls").slice(0, 2),
    ...allProducts.filter((p) => p.category === "Mens").slice(0, 2),
    ...allProducts.filter((p) => p.category === "Infant").slice(0, 2),
  ];

  // Top Selling: 2 from each category from a different offset
  const topSelling = [
    ...allProducts.filter((p) => p.category === "Boys").slice(2, 4),
    ...allProducts.filter((p) => p.category === "Girls").slice(2, 4),
    ...allProducts.filter((p) => p.category === "Mens").slice(2, 4),
    ...allProducts.filter((p) => p.category === "Infant").slice(2, 4),
  ];

  // Big Deals: 2 from each category (on sale products at different offsets)
  const bigDeals = [
    ...allProducts
      .filter((p) => p.category === "Boys" && p.isOnSale)
      .slice(4, 6),
    ...allProducts
      .filter((p) => p.category === "Girls" && p.isOnSale)
      .slice(4, 6),
    ...allProducts
      .filter((p) => p.category === "Mens" && p.isOnSale)
      .slice(4, 6),
    ...allProducts
      .filter((p) => p.category === "Infant" && p.isOnSale)
      .slice(0, 2),
  ];

  return (
    <>
      <HeroCarousel onShopNow={onShopNow} />
      <CategoriesSection onNavigate={onNavigate} />
      <ProductGridSection
        title="New Arrivals"
        products={newArrivals}
        isLoading={false}
        onViewDetails={onViewDetails}
        onNavigate={onNavigate}
        scopeId="new-arrivals"
      />
      <ProductGridSection
        title="Top Selling Products"
        products={topSelling}
        isLoading={false}
        onViewDetails={onViewDetails}
        onNavigate={onNavigate}
        scopeId="top-selling"
      />
      <CollectionsSection onNavigate={onNavigate} />
      <BigDealsSection
        products={bigDeals}
        onViewDetails={onViewDetails}
        onNavigate={onNavigate}
      />
      <BottomBanners onNavigate={onNavigate} />
    </>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  useDeployOnce();

  const [page, setPage] = useState<Page>("home");
  const [pageCategory, setPageCategory] = useState<string>("");
  const [pageSubcategory, setPageSubcategory] = useState<string>("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = STATIC_CATEGORY_DATA;
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
          <HomeContent
            onShopNow={handleShopNow}
            onViewDetails={setSelectedProduct}
            onNavigate={navigate}
          />
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
