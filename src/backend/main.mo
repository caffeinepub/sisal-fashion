import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";



actor {
  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat; // price in BDT
    category : Text; // boys, girls, mens
    subcategory : Text; // hoodie, jogger, etc.
    imageUrl : Text;
    stock : Nat;
    isOnSale : Bool;
    originalPrice : ?Nat; // for sale items
  };

  public type CategoryData = {
    category : Text;
    subcategories : [Text];
  };

  public type CartItem = {
    product : Product;
    qty : Nat;
  };

  var nextProductId = 9;
  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Text, List.List<CartItem>>();

  func createInitialProducts() : [Product] {
    [
      {
        id = 1;
        name = "Boys Blue Hoodie";
        description = "Warm fleece hoodie for boys. Perfect for winter.";
        price = 850;
        category = "boys";
        subcategory = "hoodie";
        imageUrl = "https://images.pexels.com/photos/2562994/pexels-photo-2562994.jpeg";
        stock = 30;
        isOnSale = true;
        originalPrice = ?999;
      },
      {
        id = 2;
        name = "Boys Black Jogger";
        description = "Comfortable jogger pants. Stretchable and durable.";
        price = 750;
        category = "boys";
        subcategory = "jogger";
        imageUrl = "https://images.pexels.com/photos/2440041/pexels-photo-2440041.jpeg";
        stock = 40;
        isOnSale = false;
        originalPrice = null;
      },
      {
        id = 3;
        name = "Boys Red Sweat Shirt";
        description = "Cozy red sweatshirt for boys. Soft cotton blend.";
        price = 950;
        category = "boys";
        subcategory = "sweat-shirt";
        imageUrl = "https://images.pexels.com/photos/2562993/pexels-photo-2562993.jpeg";
        stock = 25;
        isOnSale = true;
        originalPrice = ?1200;
      },
      {
        id = 4;
        name = "Girls Pink Hoodie";
        description = "Stylish pink hoodie for girls. Perfect for all seasons.";
        price = 950;
        category = "girls";
        subcategory = "hoodie";
        imageUrl = "https://images.pexels.com/photos/247295/pexels-photo-247295.jpeg";
        stock = 32;
        isOnSale = false;
        originalPrice = null;
      },
      {
        id = 5;
        name = "Girls Blue Sweat Shirt";
        description = "Trendy blue sweatshirt for girls. Soft and comfy.";
        price = 899;
        category = "girls";
        subcategory = "sweat-shirt";
        imageUrl = "https://images.pexels.com/photos/210006/pexels-photo-210006.jpeg";
        stock = 19;
        isOnSale = true;
        originalPrice = ?1050;
      },
      {
        id = 6;
        name = "Mens Olive Hoodie";
        description = "Fashionable olive green hoodie. Premium quality fabric.";
        price = 1450;
        category = "mens";
        subcategory = "hoodie";
        imageUrl = "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg";
        stock = 20;
        isOnSale = false;
        originalPrice = null;
      },
      {
        id = 7;
        name = "Mens Grey Jogger";
        description = "Comfortable grey jogger. Elastic waist and cuffs.";
        price = 1100;
        category = "mens";
        subcategory = "jogger";
        imageUrl = "https://images.pexels.com/photos/2561484/pexels-photo-2561484.jpeg";
        stock = 17;
        isOnSale = false;
        originalPrice = null;
      },
      {
        id = 8;
        name = "Mens Long Sleeve Polo";
        description = "Classic long sleeve polo t-shirt. Available in multiple colors.";
        price = 1100;
        category = "mens";
        subcategory = "long-sleeve-t-shirt";
        imageUrl = "https://images.pexels.com/photos/264059/pexels-photo-264059.jpeg";
        stock = 15;
        isOnSale = false;
        originalPrice = null;
      },
      {
        id = 9;
        name = "Mens Royal Blue Polo";
        description = "Premium royal blue polo t-shirt. Perfect for casual or formal wear.";
        price = 1800;
        category = "mens";
        subcategory = "mens-polo";
        imageUrl = "https://images.pexels.com/photos/51678/pexels-photo-51678.jpeg";
        stock = 12;
        isOnSale = true;
        originalPrice = ?2100;
      },
      {
        id = 10;
        name = "Mens Black Sweat Shirt";
        description = "Classic black sweatshirt. Soft inside lining.";
        price = 1350;
        category = "mens";
        subcategory = "sweat-shirt";
        imageUrl = "https://images.pexels.com/photos/795635/pexels-photo-795635.jpeg";
        stock = 30;
        isOnSale = true;
        originalPrice = ?1600;
      },
    ];
  };

  public shared ({ caller }) func deploy() : async () {
    nextProductId := 9;
    products.clear();
    for (product in createInitialProducts().values()) {
      products.add(product.id, product);
    };
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        Text.equal(product.category, category);
      }
    );
  };

  public query ({ caller }) func getProductsBySubcategory(category : Text, subcategory : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        Text.equal(product.category, category) and Text.equal(product.subcategory, subcategory)
      }
    );
  };

  public query ({ caller }) func getProductById(id : Nat) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getCategories() : async [CategoryData] {
    let categoryMap = Map.empty<Text, List.List<Text>>();

    for (product in products.values()) {
      let existingSubcategories = switch (categoryMap.get(product.category)) {
        case (null) { List.empty<Text>() };
        case (?subs) { subs };
      };

      let shouldAdd = not existingSubcategories.any(func(sub) { sub == product.subcategory });
      if (shouldAdd) {
        existingSubcategories.add(product.subcategory);
      };

      categoryMap.add(product.category, existingSubcategories);
    };

    let resultList = List.empty<CategoryData>();
    for ((cat, subs) in categoryMap.entries()) {
      resultList.add(
        {
          category = cat;
          subcategories = subs.toArray();
        }
      );
    };

    resultList.toArray();
  };

  public query ({ caller }) func getBestDeals() : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.isOnSale;
      }
    );
  };

  public shared ({ caller }) func addToCart(productId : Nat, qty : Nat, sessionId : Text) : async Bool {
    switch (products.get(productId)) {
      case (null) { false };
      case (?product) {
        let currentCart = switch (carts.get(sessionId)) {
          case (null) { List.empty<CartItem>() };
          case (?cart) { cart };
        };

        switch (currentCart.findIndex(func(item) { item.product.id == productId })) {
          case (null) {
            let newItem : CartItem = {
              product;
              qty;
            };
            currentCart.add(newItem);
          };
          case (?index) {
            let itemsArray = currentCart.toArray();
            let updatedItems = Array.tabulate(
              itemsArray.size(),
              func(i) {
                if (i == index) { { product = itemsArray[i].product; qty } } else { itemsArray[i] };
              }
            );
            currentCart.clear();
            for (item in updatedItems.values()) { currentCart.add(item) };
          };
        };
        carts.add(sessionId, currentCart);
        true;
      };
    };
  };

  public query ({ caller }) func getCart(sessionId : Text) : async [CartItem] {
    switch (carts.get(sessionId)) {
      case (null) { [] };
      case (?cart) { cart.toArray() };
    };
  };

  public shared ({ caller }) func updateCartItem(sessionId : Text, productId : Nat, qty : Nat) : async Bool {
    if (qty == 0) {
      let currentCart = switch (carts.get(sessionId)) {
        case (null) { List.empty<CartItem>() };
        case (?cart) { cart };
      };

      let filteredCart = List.empty<CartItem>();
      for (item in currentCart.values()) {
        if (item.product.id != productId) {
          filteredCart.add(item);
        };
      };
      carts.add(sessionId, filteredCart);
      true;
    } else {
      switch (products.get(productId)) {
        case (null) { false };
        case (?product) {
          let currentCart = switch (carts.get(sessionId)) {
            case (null) { List.empty<CartItem>() };
            case (?cart) { cart };
          };

          switch (currentCart.findIndex(func(item) { item.product.id == productId })) {
            case (null) {
              let newItem : CartItem = {
                product;
                qty;
              };
              currentCart.add(newItem);
            };
            case (?index) {
              let itemsArray = currentCart.toArray();
              let updatedItems = Array.tabulate(
                itemsArray.size(),
                func(i) {
                  if (i == index) { { product = itemsArray[i].product; qty } } else { itemsArray[i] };
                }
              );
              currentCart.clear();
              for (item in updatedItems.values()) { currentCart.add(item) };
            };
          };
          carts.add(sessionId, currentCart);
          true;
        };
      };
    };
  };

  public shared ({ caller }) func clearCart(sessionId : Text) : async () {
    carts.remove(sessionId);
  };
};
