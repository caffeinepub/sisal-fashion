import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CartItem, CategoryData, Product } from "../backend.d";
import { useActor } from "./useActor";

// ── Session ID ──────────────────────────────────────────────────────────────

export function getSessionId(): string {
  let id = localStorage.getItem("sisal_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("sisal_session_id", id);
  }
  return id;
}

// ── Products ─────────────────────────────────────────────────────────────────

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (!category || category === "All") return actor.getProducts();
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductsBySubcategory(
  category: string,
  subcategory: string,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "subcategory", category, subcategory],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsBySubcategory(category, subcategory);
    },
    enabled: !!actor && !isFetching && !!category && !!subcategory,
  });
}

export function useCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<CategoryData[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBestDeals() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["best-deals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBestDeals();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Cart ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const { actor, isFetching } = useActor();
  const sessionId = getSessionId();
  return useQuery<CartItem[]>({
    queryKey: ["cart", sessionId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart(sessionId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  return useMutation({
    mutationFn: async ({
      productId,
      qty,
    }: { productId: bigint; qty: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.addToCart(productId, qty, sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  return useMutation({
    mutationFn: async ({
      productId,
      qty,
    }: { productId: bigint; qty: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateCartItem(sessionId, productId, qty);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.clearCart(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
