const cartItems = document.querySelector('.cart__items');
let totalPrice = 0;
const elementTotalPriceCart = document.querySelector('.total-price');
console.log(elementTotalPriceCart);

function saveTotalPriceLocalStorage(price) {
  if (cartItems.length === 0) {
    cartItems.innerHTML = '';
  }
  window.localStorage.setItem('totalPrice', price);
}

function somaPricesItemsCart(valor) {
  totalPrice += valor;
  const totalPriceFixed = parseFloat(totalPrice.toFixed(2));
  console.log(totalPriceFixed);
  elementTotalPriceCart.innerText = totalPriceFixed;
  saveTotalPriceLocalStorage(totalPriceFixed);
}

function subtraiPricesItemsCart(valor) {
  totalPrice -= valor;
  const totalPriceFixed2 = parseFloat(totalPrice.toFixed(2));
  elementTotalPriceCart.innerText = totalPriceFixed2;
  saveTotalPriceLocalStorage(totalPriceFixed2);
}

// SALVAR NO LOCAL STORAGE CART ITEMS :
function saveCartLocalStorage(cart) {
  window.localStorage.setItem('cart', cart.innerHTML);
}

// FUNCAO DO EVENTO DE REMOVER ITEM DO CART LI:
function cartItemClickListener(event) {
  const li = event.target.innerText;
  const paiDeLi = event.target.parentNode;
  event.target.remove();
  // subtraindo valores totais do cart:
  const index = li.indexOf('$');
  const stringPrice = li.substring(index + 1);
  subtraiPricesItemsCart(parseFloat(stringPrice));
  // ficar salvo no localStorage quando limpar eles tb:
  saveCartLocalStorage(paiDeLi);
}

// FUNCAO QUE CRIA ELEMENTO ITEM LI COMO FILHO DE LISTA OL:
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  cartItems.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  // somando os precos de items add no cart:
  console.log(salePrice);
  // somaPricesItemsCart(salePrice);
  somaPricesItemsCart(salePrice);
  // salva no localStorage as li add:
  saveCartLocalStorage(cartItems);
  return li;
}

// PEGANDO ID DO ITEM ClICADO
function getSkuFromProductItem(itemSection) {
  const skuItem = itemSection.querySelector('span.item__sku').innerText;
  return skuItem;
} 

// CLIQUE NO BUTTON- API DO ID È ADICIONANDO NO CARRINHO OL:
function getApiItemForCart(event) {
  fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(event.target.parentNode)}`)
    .then((result) => result.json())
  .then((object) => {
    const { id: sku, title: name, price: salePrice } = object;
    createCartItemElement({ sku, name, salePrice });
  })
  .catch((error) => console.log(`${error}: erroooooooo`));
}

// criaçao espeficica do button para receber evento click:
function createCustomButton(button, className, innerText) {
  const buttonAddCart = document.createElement(button);
  buttonAddCart.className = className;
  buttonAddCart.innerText = innerText;
  buttonAddCart.addEventListener('click', getApiItemForCart);
  return buttonAddCart;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
} 

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// CRIA ELEMENTOS HTML COM API INICIAL
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomButton('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// objeto atraves do meu request envio para criar novo elemento:
function myObjComputer(computer) {
  const { id: sku, title: name, thumbnail: image, price: salePrice } = computer;
  return { sku, name, image, salePrice };
}

// API INICIAL :
function getAPIInitial(url) {
  const loadingText = document.createElement('p');
  loadingText.className = 'loading';
  loadingText.innerText = 'loading...';
  document.querySelector('body').appendChild(loadingText);
  const elementItems = document.querySelector('.items');
  return fetch(url)
  .then((result) => result.json())
  .then((object) => object.results)
  .then((results) => results.forEach((computer) => {
    elementItems.appendChild(createProductItemElement(myObjComputer(computer)));
    loadingText.remove();
    }))
  .catch((error) => alert(`${error}: Houve um erro há requisiçao da API inicial !`));
}

// LIMPAR TUDO NO CARRINHO:
function buttonClearCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    const listCart = document.querySelectorAll('.cart__item');
    listCart.forEach((li) => {
      li.remove();
    });
    localStorage.removeItem('totalPrice');
    elementTotalPriceCart.innerText = '';
    // limpando também  no localStorage:
    localStorage.removeItem('cart');
  });
}

window.onload = () => {
  getAPIInitial('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  buttonClearCart();
  // Quando pag carregar ira colocar no carrinho o que foi salvo no storage
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  document.querySelector('.total-price').innerHTML = localStorage.getItem('totalPrice');
};