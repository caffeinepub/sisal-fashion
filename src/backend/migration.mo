import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";

module {
  // Old product type from the previous version.
  type OldProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    category : Text;
    available : Bool;
  };

  // Old actor data with products map only.
  type OldActor = {
    products : Map.Map<Nat, OldProduct>;
  };

  // New product type with additional fields.
  type NewProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
    subcategory : Text;
    imageUrl : Text;
    stock : Nat;
    isOnSale : Bool;
    originalPrice : ?Nat;
  };

  // Cart item type for new actor.
  type CartItem = {
    product : NewProduct;
    qty : Nat;
  };

  // New actor state containing products and carts.
  type NewActor = {
    products : Map.Map<Nat, NewProduct>;
    carts : Map.Map<Text, List.List<CartItem>>;
    nextProductId : Nat;
  };

  /// Migration function from old to new actor.
  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Nat, OldProduct, NewProduct>(
      func(_, oldProduct) {
        {
          id = oldProduct.id;
          name = oldProduct.name;
          description = oldProduct.description;
          price = oldProduct.price;
          category = oldProduct.category;
          subcategory = "unknown";
          imageUrl = oldProduct.imageUrl;
          stock = if (oldProduct.available) { 10 } else { 0 };
          isOnSale = false;
          originalPrice = null;
        };
      }
    );

    let newCarts = Map.empty<Text, List.List<CartItem>>();
    { products = newProducts; carts = newCarts; nextProductId = 9 };
  };
};
