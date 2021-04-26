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

class ProductItem{
    constructor(productArg){
        this.product = productArg;
    }

    renderProduct(){
        const productLi = document.createElement("li");
        productLi.className = "product-item";
        productLi.innerHTML = `
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
              return productLi;
    }
}

//everything related to productList goes in it
class ProductList {
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
    constructor(){};

    //method for rendering products
    render() {
        const renderHook = document.getElementById("app");
        const productList = document.createElement("ul");
        productList.className = "product-list";

        for (const product of this.products) {
            const productItem = new ProductItem(product);
            const productEl = productItem.renderProduct();
            productList.appendChild(productEl);
        }
        renderHook.append(productList);
      }
}

//object instantiation
const productList = new ProductList();
productList.render();
