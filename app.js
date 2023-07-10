const cartBtn=document.querySelector('.cart-btn');
const closeCartBtn=document.querySelector('.close-cart');
const clearCartBtn=document.querySelector('.clear-cart');
const cartDOM=document.querySelector('.cart');
const cartOverlay=document.querySelector(".cart-overlay");
const cartItems=document.querySelector('.cart-items');
const cartTotal=document.querySelector('.cart-total');
const cartContent=document.querySelector('.cart-content');
const productsDOM=document.querySelector('.products-centre');



let cart=[];
let buttonDOM=[];
// getting the products
class Products{
   async getProducts(){
    try{
      let result= await  fetch('product.json');
      let products= await result.json();
      products=products.products;
      let fproducts=products.map(item=>{
        const {id,title,price}=item
        // console.log(item.id);
        const img=item.images[0];
        return {id,title,price,img};
      })
    //   console.log(nproducts);
      return fproducts;
    }
    catch(err){
        console.log(err);
    }
    }

}
// display products
class UI{
  displayProducts(data){
    let result ="";
  data.forEach(product=>{
      result+=`
      <div class="product">
 <div class="img-container">
    <img src="${product.img}" alt="" class="product-img">
    <button class="bag-btn" data-id="${product.id}">
        <i class="fas fa-shopping-cart"></i>
        add to bag
    </button>
 </div>
 <h3>${product.title}</h3>
 <h4>${product.price}$</h4>
</div>
      `
    })
    productsDOM.innerHTML=result;
  }

getBagButtons(){
  const btn=[...document.querySelectorAll(".bag-btn")];
  // const btn=document.querySelectorAll(".bag-btn");
  buttonDOM=btn;
  let xcart=localStorage.getItem("cart");
  // cart.forEach(e=>console.log(e));
  console.log(xcart)
  btn.forEach((button)=>{
    // console.log(button.dataset.id)
    let id=button.dataset.id;
    let inCart=cart.find((item)=>item.id ==id);
    if(inCart){
      button.innerText="In cart";
      button.disabled=true;

    }
    
      button.addEventListener("click",(event)=>{
        // console.log(event.target);
        event.target.innerText="In cart";
      event.target.disabled=true;
        // console.log(event.target);
        let cartItem={...Storage.getData(id),amount:1};
        console.log( cartItem);
        cart=[...cart,cartItem]
        // console.log(cart);
        Storage.saveCart(cart);
        this.setCartValues(cart);
        // display cart item
        this.addCartItem(cartItem);
        // showcart
        this.showCart();
      })
    

  });
}
  // console.log(btn);
  setCartValues(cart){
    let tempTotal=0;
    let itemTotal=0;
    cart.map(item=>{
      tempTotal+=(item.price*item.amount);
      itemTotal+=item.amount;
    });
cartTotal.innerText=tempTotal;
cartItems.innerText=itemTotal;
  }
  addCartItem(cartItem){
    const div=document.createElement('div');
    div.classList.add('cart-item')
    const result=`
    <img src="${cartItem.img}" alt="">
    <div>
        <h4>${cartItem.title}</h4>
        <h5>$${cartItem.price}</h5>
        <span class="remove-item" data-id="${cartItem.id}">remove</span>
    </div>
    <div>
        <i class="fas fa-chevron-up"></i>
        <p class="item-amount">${cartItem.amount}</p>
        <i class="fas fa-chevron-down"></i>
    </div>
    `
    div.innerHTML=result;
    cartContent.appendChild(div);
    // console.log(cartContent);
  }
  showCart(){
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart")
  }
  setupApp(){
cart=Storage.getCart();
this.setCartValues(cart);
this.populateCart(cart);
cartBtn.addEventListener("click",this.showCart);
closeCartBtn.addEventListener("click",this.hideCart);
}
  populateCart(cart){
cart.forEach(item=>{
  this.addCartItem(item);
})
  }
  hideCart(){
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart")
  }
  cartLogic(){
    clearCartBtn.addEventListener('click',()=>{
      console.log(this);
      this.clearCart();
    });

cartContent.addEventListener('click',(event)=>{
  // console.log(event.target);
  if(event.target.classList.contains('remove-item')){
let removeItemId=event.target.dataset.id;
this.removeItem(removeItemId,0);
console.log(event.target.parentElement.parentElement);
cartContent.removeChild(event.target.parentElement.parentElement)

  }
})


  }
  clearCart(){
    let cartItem=cart.map(item=>item.id);
    cartItem.forEach((id,ind)=>this.removeItem(id,1));
  }
  removeItem(id,ind){
    cart=cart.filter(item=>item.id!=id);
    this.setCartValues(cart);
    // this.addCartItem(cart);
    Storage.saveCart(cart);
    let button=this.getSingleButton(id);
    // console.log(button);
button.disabled=false;

button.innerHTML=`<i class="fas fa-shopping-cart"></i>
add to bag`;
if(ind===1){
while(cartContent.children.length>0){
  cartContent.removeChild(cartContent.children[0]);
}
}
this.hideCart();

  }
  getSingleButton(id){
    // console.log(id);
    return buttonDOM.find(button=>button.dataset.id == id);
  }



}
// local storage
class Storage{
  static saveProducts(data){
    localStorage.setItem("data",JSON.stringify(data));
  }
  static getData(id){
    let data=JSON.parse(localStorage.getItem('data'));
    // console.log(id);
  data=  data.find(item => item.id == id);
  
    // console.log(newdata)
    return data;

   
  }
  static saveCart(cart){
    localStorage.setItem('cart',JSON.stringify(cart));
  }
  static getCart(){
    if( localStorage.getItem("cart")){
      return JSON.parse(localStorage.getItem("cart"))}
      else return [];
  }

}


document.addEventListener("DOMContentLoaded",()=>{
    const ui=new UI();
    const products=new Products();
    ui.setupApp();
    // get all products
    products.getProducts().then((data)=>{
        // console.log(data);
        ui.displayProducts(data);
        Storage.saveProducts(data);
    }).then(()=>{
      ui.getBagButtons();
      ui.cartLogic();

})
})



