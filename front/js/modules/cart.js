//----------------------------Partie affichage et gestion du panier--------------------------//

/**
 * Cherche les données d'un produit par rapport à son ID
 * @param { String } articleId
 * @returns { Promise } Objet contenant les données de l'article
 */
export async function getOneProduct(articleId) {
  return fetch(`http://localhost:3000/api/products/${articleId}`)
    .then((res) => res.json())
    .catch((err) => console.log("Erreur: " + err));
}

/**
 * Insère un article dans la page à partir des données du panier
 * complétées par les données récupérées avec getOneProduct()
 * @param { Object } article
 * @param { Object } articleInCart
 */
export function insertArticleInCart(article, articleInCart) {
  const $articlesContainer = document.getElementById("cart__items");

  //Création des éléments
  const $article = document.createElement("article");
  $article.classList.add("cart__item");
  $article.setAttribute("data-id", `${articleInCart.id}`);
  $article.setAttribute("data-color", `${articleInCart.color}`);

  const $imageConteneur = document.createElement("div");
  $imageConteneur.classList.add("cart__item__img");

  const $articleImage = document.createElement("img");
  $articleImage.setAttribute("src", `${article.imageUrl}`);
  $articleImage.setAttribute("alt", `${article.altTxt}`);

  const $infosConteneur = document.createElement("div");
  $infosConteneur.classList.add("cart__item__content");

  const $descriptionConteneur = document.createElement("div");
  $descriptionConteneur.classList.add("cart__item__content__description");

  const $articleName = document.createElement("h2");
  $articleName.innerText = article.name;

  const $articleColor = document.createElement("p");
  $articleColor.textContent = articleInCart.color;

  const $articlePrice = document.createElement("p");
  $articlePrice.textContent = `${article.price} €`;

  const $settingsConteneur = document.createElement("div");
  $settingsConteneur.classList.add("cart__item__content__settings");

  const $quantityConteneur = document.createElement("div");
  $quantityConteneur.classList.add("cart__item__content__settings__quantity");
  const $quantityWord = document.createElement("p");
  $quantityWord.textContent = "Qté : ";
  const $quantitySelector = document.createElement("input");
  $quantitySelector.setAttribute("type", "number");
  $quantitySelector.setAttribute("class", "itemQuantity");
  $quantitySelector.setAttribute("name", "itemQuantity");
  $quantitySelector.setAttribute("min", "1");
  $quantitySelector.setAttribute("max", "100");
  $quantitySelector.setAttribute("value", `${articleInCart.quantity}`);
  //Ajout de la modification de la quantité
  $quantitySelector.addEventListener("change", updateQuantity);

  const $deleteConteneur = document.createElement("div");
  $deleteConteneur.classList.add("cart__item__content__settings__delete");
  const $deleteButton = document.createElement("p");
  $deleteButton.classList.add("deleteItem");
  $deleteButton.textContent = "Supprimer";
  //Ajout de la suppression de l'article
  $deleteButton.addEventListener("click", deleteItem);

  //Insertion des éléments
  $articlesContainer.appendChild($article);
  $article.appendChild($imageConteneur);
  $imageConteneur.appendChild($articleImage);
  $article.appendChild($infosConteneur);
  $infosConteneur.appendChild($descriptionConteneur);
  $descriptionConteneur.appendChild($articleName);
  $descriptionConteneur.appendChild($articleColor);
  $descriptionConteneur.appendChild($articlePrice);
  $infosConteneur.appendChild($settingsConteneur);
  $settingsConteneur.appendChild($quantityConteneur);
  $quantityConteneur.appendChild($quantityWord);
  $quantityConteneur.appendChild($quantitySelector);
  $settingsConteneur.appendChild($deleteConteneur);
  $deleteConteneur.appendChild($deleteButton);
}

/**
 * Met à jour la quantité d'un produit dans le panier
 * @param { Change } e
 */
export function updateQuantity(e) {
  const newQuantity = e.target.value;

  //Si la nouvelle valeur est comprise entre 1 et 100, on met à jour la quantité
  if (e.target.value > 0 && e.target.value < 101) {
    //On sélectionne le noeud parent possédant "data-id" et "data-color"
    const produit = e.target.closest(".cart__item");
    const idToUpdate = produit.dataset.id;
    const colorToUpdate = produit.dataset.color;

    const panierToUpdate = JSON.parse(localStorage.getItem("panier"));
    const recherche = panierToUpdate.find(
      (article) => article.id === idToUpdate && article.color === colorToUpdate
    );

    let newQuantityValue = {
      quantity: newQuantity,
    };
    Object.assign(recherche, newQuantityValue);

    localStorage.removeItem("panier");
    localStorage.setItem("panier", JSON.stringify(panierToUpdate));
  }

  //Exceptions
  if (e.target.value < 1) {
    alert("Veuillez choisir une quantité entre 1 et 100");
    e.target.value = 1;
    //On rappelle la fonction à l'intérieur d'elle-même pour que le nombre total d'articles
    //et le prix soient mis à jour
    updateQuantity(e);
  }
  if (e.target.value > 100) {
    alert("Vous ne pouvez pas commander plus de 100 articles de cette couleur");
    e.target.value = 100;
    updateQuantity(e);
  }

  calculatePrice();
  calculateItemsQuantity();
}

/**
 * Supprime un article du panier
 * @param { Click } e
 */
export function deleteItem(e) {
  //On sélectionne le noeud parent possédant "data-id" et "data-color"

  if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
    const produit = e.target.closest(".cart__item");
    const idToDelete = produit.dataset.id;
    const colorToDelete = produit.dataset.color;

    const panierToUpdate = JSON.parse(localStorage.getItem("panier"));

    const indexToDelete = panierToUpdate.findIndex(
      (article) => article.id === idToDelete && article.color === colorToDelete
    );

    //On supprime l'élément
    panierToUpdate.splice(indexToDelete, 1);

    localStorage.removeItem("panier");
    localStorage.setItem("panier", JSON.stringify(panierToUpdate));

    const $articlesContainer = document.getElementById("cart__items");
    $articlesContainer.removeChild(produit);

    calculatePrice();
    calculateItemsQuantity();
  }
}

/**
 * Compile getOneProduct() et insertArticleInCart()
 * @param { Object } articleInCart
 */
export async function main(articleInCart) {
  const articleData = await getOneProduct(articleInCart.id);
  insertArticleInCart(articleData, articleInCart);
}

/**
 * Calcule le prix total des articles du panier
 */
export async function calculatePrice() {
  const panier = JSON.parse(localStorage.getItem("panier"));
  let allArticlesPrice = 0;
  const $totalPrice = document.getElementById("totalPrice");

  //Pour chaque article dans le panier, on additionne sa valeur au total
  if (panier != null) {
    for (let item of panier) {
      const articleData = await getOneProduct(item.id);
      var articlePrice = articleData.price;
      var articleTotalPrice = articlePrice * item.quantity;
      allArticlesPrice += articleTotalPrice;
    }

    $totalPrice.innerText = allArticlesPrice;
  } else {
    $totalPrice.innerText = 0;
  }
}

/**
 * Calcule le nombre total d'articles dans le panier
 */
export function calculateItemsQuantity() {
  const panier = JSON.parse(localStorage.getItem("panier"));
  let allArticlesQuantity = 0;
  const $totalNumberOfArticles = document.getElementById("totalQuantity");

  if (panier != null) {
    for (let item of panier) {
      allArticlesQuantity += parseInt(item.quantity, 10);
    }

    $totalNumberOfArticles.innerText = allArticlesQuantity;
  }
  else {
    $totalNumberOfArticles.innerText = 0;
  }
}

//--------------------------------Gestion du formulaire--------------------------------//

/**
 * Vérifie la validité du nom
 * @param { String } name
 * @returns { Boolean }
 */
export function isNameValid(name) {
  return /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g.test(name);
}

/**
 * Vérifie la validité de l'adresse
 * @param { String } address
 * @returns { Boolean }
 */
export function isAddressValid(address) {
  return /(\d{1,}) [a-zA-Z0-9\s]+(\.)? [a-zA-Z]+(\,)?/g.test(address);
}

/**
 * Vérifie la validité de la ville
 * @param { String } city
 * @returns { Boolean }
 */
export function isCityValid(city) {
  return /([a-zA-Z'\s]){1,}/g.test(city);
}

/**
 * Vérifie la validité de l'email
 * @param { String } email
 * @returns { Boolean }
 */
export function isEmailValid(email) {
  return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
    email
  );
}

const $firstNameInput = document.getElementById("firstName");
const $lastNameInput = document.getElementById("lastName");
const $addressInput = document.getElementById("address");
const $cityInput = document.getElementById("city");
const $emailInput = document.getElementById("email");

/**
 * Crée un objet de contact à partir des données rentrées dans le formulaire
 * @returns { Object }
 */
export function createContact() {
  let contact = {
    firstName: $firstNameInput.value,
    lastName: $lastNameInput.value,
    address: $addressInput.value,
    city: $cityInput.value,
    email: $emailInput.value,
  };
  return contact;
}

/**
 * Crée le tableau de produits à envoyer à l'API
 * @returns { Array }
 */
export function putCartInAnArray() {
  const panier = JSON.parse(localStorage.getItem("panier"));
  const products = [];

  for (let item of panier) {
    products.push(item.id);
  }
  return products;
}

/**
 * Envoie les informations de contact et du panier à l'API
 * @param {Object } objet
 * @returns { Promise }
 */
export function postFormData(objet) {
  console.log(objet);
  return fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objet),
  })
    .then((res) => res.json())
    .then((res) => {
      localStorage.clear();
      //Redirection vers la page de confirmation
      location.href = `./confirmation.html?orderId=${res.orderId}`;
    })
    .catch((err) => console.log("Erreur: " + err));
}
