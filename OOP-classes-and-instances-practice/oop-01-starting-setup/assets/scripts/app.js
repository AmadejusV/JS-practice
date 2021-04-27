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



class ElementAttribute{
  constructor(attrName, attrValue){
    this.name = attrName;
    this.value = attrValue;
  }
}

// a class for inheritance practice
class Component {
  constructor(renderHookId){
    this.hook=renderHookId;
  }

  createElement(tag, cssClasses, attributes){
    const rootElement = document.createElement(tag);
    if(cssClasses){
      rootElement.className = cssClasses;
    }
    if(attributes && attributes.length > 0){
      for(const attribute of attributes){
        rootElement.setAttribute(attribute.name, attribute.value);
      }
    }
    document.getElementById(this.hook).append(rootElement);
    return rootElement;
  }
}



class ProductItem extends Component{
    constructor(productObj, renderHookId){
      super(renderHookId)
        this.product = productObj;
    }

    addToCart(){
      App.addProductToCart(this.product);
    }

    renderProduct(){
        const productItem = this.createElement("li", "product-item");
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
              const addToCartButton = productItem.querySelector('button');
              //binding 'this' to ProductItem object 'this'
              addToCartButton.addEventListener('click', this.addToCart.bind(this));
    }
}




class ShoppingCart extends Component{
  shoppingList=[];

  set cartItems(value){
    this.shoppingList = value;
    this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2> `;
  }

  get totalAmount(){
    const sum = this.shoppingList.reduce((prevValue, currentItem)=>{return prevValue+currentItem.price}, 0);
    return sum;
  }

  constructor(renderHookId){
    //super method calls the constructor of the parent class, passes it's argument to parent constructor parameters as argument
    super(renderHookId);
  }
  
  addProduct(productObj){
    const updatedItems = [...this.shoppingList];
    updatedItems.push(productObj);
    this.cartItems=updatedItems;
  }

  renderCart(){
    const cartElement = this.createElement('section', 'cart');
    cartElement.innerHTML=`
      <h2>Total: \$${this.totalAmount}</h2>
      <button>Order now!</button>
    `;
    this.totalOutput = cartElement.querySelector('h2');
  }
}

//everything related to productList goes in it
class ProductList extends Component {
    products = [
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

    //fields are magically added during object initiation via constructor, description unnecessary
    constructor(renderHookId){
      super(renderHookId);
    };

    //method for rendering products
    renderProductList() {
        this.createElement("ul", "product-list", [new ElementAttribute("id", "prod-list")]);

        for (const product of this.products) {
            const productItem = new ProductItem(product, "prod-list");
            productItem.renderProduct();
        }
      }
}


class Shop{
  renderShop(){
    //setting shoppingCart as property of Shop, passing it a hookId (to find an element to which to append it)
    this.shoppingCart = new ShoppingCart('app');
    this.shoppingCart.renderCart();
    const productList = new ProductList('app');
    productList.renderProductList();
  }
}



class App {
  static cart;

  static init(){
    const shop = new Shop();
    shop.renderShop();
    //setting App cart property as reference to shop.shoppingCart to have a global cart available for adding products
    this.cart = shop.shoppingCart;
  }

  //static methods can only be called on a class, not an object
  static addProductToCart(product){
    this.cart.addProduct(product);
  }
}

App.init();