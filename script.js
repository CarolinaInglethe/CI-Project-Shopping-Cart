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

// PEGANDO ID DO ITEM ClICADO
function getSkuFromProductItem(itemSection) {
  const skuItem = itemSection.querySelector('span.item__sku').innerText;
  return skuItem;
} 

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const carItems = document.querySelector('.car__items');
  carItems.appendChild(li);
  // li.addEventListener('click', cartItemClickListener());
}

/* function cartItemClickListener() {
 
} */

// PEGANDO API DO ID E ADICIONANDO NO CARRINHO.
function getApiItemForCart(event) {
  const endpointId = `https://api.mercadolibre.com/items/${getSkuFromProductItem(event)}`;
  return fetch(endpointId)
  .then((result) => result.json())
  .then((object) => {
    console.log(object);
    const { id: sku, title: name, price: salePrice } = object;
    createCartItemElement({ sku, name, salePrice });
  })
  .catch((error) => console.log(`${error}: erroooooooo`));
}

// CRIA ELEMENTOS HTML COM API INICIAL
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAddCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  // colocando click no button (requesito 2):
  buttonAddCart.addEventListener('click', getApiItemForCart(section));
  section.appendChild(buttonAddCart);
  return section;
}

// objeto atraves do meu request envio para criar novo elemento:
function myObjComputer(computer) {
  const { id: sku, title: name, thumbnail: image, price: salePrice } = computer;
  return { sku, name, image, salePrice };
}

// API INICIAL :
function getAPIInitial(url) {
  const elementItems = document.querySelector('.items');
  return fetch(url)
  .then((result) => result.json())
  .then((object) => object.results)
  .then((results) => results.forEach((computer) => {
    elementItems.appendChild(createProductItemElement(myObjComputer(computer)));
    }));
}

window.onload = () => {
  getAPIInitial('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
};
