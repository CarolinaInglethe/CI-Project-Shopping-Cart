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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  // coloque seu código aqui
} */

/* function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

// objeto atraves do meu request envio para criar novo elemento:
function myObjComputer(computer) {
  const { id: sku, title: name, thumbnail: image, price: salePrice } = computer;
  return { sku, name, image, salePrice };
}

// fazendo o request e adicionando na pag produtos da API :
function getAPI(url) {
  const elementItems = document.querySelector('.items');
  return fetch(url)
  .then((result) => result.json())
  .then((object) => object.results)
  .then((results) => results.forEach((computer) => {
    elementItems.appendChild(createProductItemElement(myObjComputer(computer)));
    }));
}

function clickAddCart(itemAtual) {
  console.log('yeeeh');
  const idItemAtual = itemAtual.firstElementChild.innerText;
  const urlIdAtt = `https://api.mercadolibre.com/items/$${idItemAtual}`;
  return fetch(urlIdAtt)
  .then((result) => result.json())
  .then((obj) => console.log(obj))
  .catch((err) => console.log(`${err}: erroooo`));
}

function addCartEvent() {
  const buttonAddCart = document.querySelectorAll('.item__add');
  const elemtItemApi = document.querySelectorAll('.item');
  for (let index = 0; index < buttonAddCart.length; index += 1) {
    buttonAddCart[index].addEventListener('click', clickAddCart(elemtItemApi[index]));
  }
}

window.onload = () => {
  getAPI('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  addCartEvent();
};
