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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} 

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

function addCartEvent() {
  const itemsSection = document.querySelectorAll('.item');
  console.log(itemsSection);
  itemsSection.forEach((item) => {
    console.log(item);
    item.lastElementChild.addEventListener('click', async () => {
      console.log('ola');
    });
  });
}

window.onload = () => {
  getAPI('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  addCartEvent();
};
