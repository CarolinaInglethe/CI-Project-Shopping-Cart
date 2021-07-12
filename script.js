// SALVAR NO LOCAL STORAGE CART ITEMS :
function saveCartLocalStorage(cart) {
  window.localStorage.setItem('cart', cart.innerHTML);
}

// FUNCAO DO EVENTO DE REMOVER ITEM DO CART:
function cartItemClickListener(event) {
  const paiDeLi = event.target.parentNode;
  event.target.remove();
  // ficar salvo no localStorage quando limpar eles tb:
  saveCartLocalStorage(paiDeLi);
} 

// FUNCAO QUE CRIA ELEMENTO ITEM LI COMO FILHO DE LISTA OL:
function createCartItemElement({ sku, name, salePrice }) {
  const cartItems = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  cartItems.appendChild(li);
  /* meu erro nos eventListenner era chamar a funcao como 
  parametro direto assim  : cartItemClickListener() / em vez de 
  só o nome, isso fazia que mesmo quando não clicasse adicionasse tudo */
  li.addEventListener('click', cartItemClickListener);
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
  // colocando click no button (requesito 2):
 /* buttonAddCart.addEventListener('click', getApiItemForCart(section));
  section.appendChild(buttonAddCart);
  return section; */
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
    // limpando também  no localStorage: 
    localStorage.removeItem('cart');
  });
}

window.onload = () => {
  getAPIInitial('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  buttonClearCart();
  // Quando pag carregar ira colocar no carrinho o que foi salvo no storage
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
};