//class is a blueprint for an object
class Product {
  //   title = "DEFAULT";
  //   imageUrl;
  //   description;
  //   price;

  constructor(titleArg, imageArg, descriptionArg, priceArg) {
    this.title = titleArg;
    this.imageUrl = imageArg;
    this.description = descriptionArg;
    this.price = priceArg;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

// a class for inheritance practice
class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hook = renderHookId;

    if (shouldRender) {
      this.render();
    }
  }
  render() {}

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes && attributes.length > 0) {
      for (const attribute of attributes) {
        rootElement.setAttribute(attribute.name, attribute.value);
      }
    }
    document.getElementById(this.hook).append(rootElement);
    return rootElement;
  }
}


class ShoppingCart extends Component {
  shoppingList = [];

  set cartItems(value) {
    this.shoppingList = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(
      2
    )}</h2> `;
  }

  get totalAmount() {
    if(!this.shoppingList){
      return 0;
    }
    const sum = this.shoppingList.reduce((prevValue, currentItem) => 
      prevValue + currentItem.price
    , 0);
    return sum;
  }

  constructor(renderHookId) {
    //super method calls the constructor of the parent class, passes it's argument to parent constructor parameters as argument
    super(renderHookId, false); //adding false for the 3 approach to not call render

    //approach 3 adding method as a property
    this.orderProducts=()=>{
      console.log("Ordering products...");
      console.log(this.shoppingList);
    }
    this.render();
    // this.render();    will use overriding to call it from the component class
  }

  addProduct(productObj) {
    const updatedItems = [...this.shoppingList];
    updatedItems.push(productObj);
    this.cartItems = updatedItems;
  }

  //approach 1-2
  // orderProducts(){
  //   console.log("Ordering products...");
  //   console.log(this.shoppingList);
  // }

  render() {
    const cartElement = this.createRootElement("section", "cart");
    cartElement.innerHTML = `
      <h2>Total: \$${this.totalAmount}</h2>
      <button>Order now!</button>
    `;
    const orderButton = cartElement.querySelector("button");
    //approach 1
    // orderButton.addEventListener("click", this.orderProducts.bind(this));
    //approach 2
    // orderButton.addEventListener("click", ()=>this.orderProducts());
    //approach 3
    orderButton.addEventListener("click", this.orderProducts);
    this.totalOutput = cartElement.querySelector("h2");
  }
}


class ProductItem extends Component {
  constructor(productObj, renderHookId) {
    //not allowing to render until product is set
    super(renderHookId, false);
    //setting product
    this.product = productObj;
    this.render();
    // this.render();   will use overriding to call it from the component class
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const productItem = this.createRootElement("li", "product-item");
    productItem.innerHTML = `
                  <div>
                      <img src="${this.product.imageUrl}" alt="${this.product.title}">
                      <div class="product-item__content">
                          <h2>${this.product.title}</h2>
                          <h3> \$${this.product.price} </h3>
                          <p>${this.product.description}</p>
                          <button>Add to cart</button>
                      </div>
                  </div>
              `;
    const addToCartButton = productItem.querySelector("button");
    //binding 'this' to ProductItem object 'this'
    addToCartButton.addEventListener("click", this.addToCart.bind(this));
  }
}



//everything related to productList goes in it
class ProductList extends Component {
  //hash (#) sets products property as private
  #products = [];

  //fields are magically added during object initiation via constructor, description unnecessary
  constructor(renderHookId) {
    super(renderHookId, false);
    this.render();
    this.fetchProducts();
    // this.render();
  }

  fetchProducts() {
    this.#products = [
      // a new object initiation
      new Product(
        "A pillow",
        "https://cdn.shopify.com/s/files/1/2509/4402/products/11-2019_S4A_Supreme_Pillow1_Standard_PDP_Retouched_300dpi_RGB_2x3_M.jpg?v=1573835697",
        "A soft pillow",
        19.99
      ),
      new Product(
        "A carpet",
        "https://darpanfurnishings.com/administrator/uploads/carpets.jpg",
        "A carpet you might like",
        89.99
      ),
    ];
    //render products after they are fetched
    this.renderProducts();
  }

  renderProducts() {
    for (const product of this.#products) {
      //giving it an object to be used for new li element creation and an 'id' to select an element to which to append it
      new ProductItem(product, "prod-list");
    }
  }

  //method for rendering products
  render() {
    this.createRootElement("ul", "product-list", [
      new ElementAttribute("id", "prod-list"),
    ]);
    //render products only if it's not empty
    if (this.#products && this.#products.length > 0) {
      this.renderProducts();
    }
  }
}

class Shop extends Component {
  constructor() {
    super();
    // this.renderShop(); will use overriding to call it from the component class
  }

  render() {
    //setting shoppingCart as property of Shop, passing it a hookId (to find an element to which to append it)
    this.shoppingCart = new ShoppingCart("app");
    new ProductList("app");
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    //setting App cart property as reference to shop.shoppingCart to have a global cart available for adding products
    this.cart = shop.shoppingCart;
  }

  //static methods can only be called on a class, not an object
  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

App.init();
