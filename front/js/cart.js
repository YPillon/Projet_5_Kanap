//On récupère le panier
const panierRaw = localStorage.getItem("panier");

//On convertit le panier en tableau javascript
const panierClean = JSON.parse(panierRaw);
console.log(panierClean);

//Fonction cherchant les données produits liées à l'ID
async function getOneProduct(articleId) {
  return fetch(`http://localhost:3000/api/products/${articleId}`)
    .then((res) => res.json())
    .catch((err) => console.log("Erreur: " + err));
}

//
//Je crée une fonction insérant les donnée dans la page panier
function insertArticleInCart(article) {
  console.log(articleInCart.id);

  //Je sélectionne le conteneur des produits
  const $articlesContainer = document.getElementById("cart__items");

  //Création des éléments
  //
  //Création de l'article
  const $article = document.createElement("article");
  $article.classList.add("cart__item");
  $article.setAttribute("data-id", `${articleInCart.id}`);
  $article.setAttribute("data-color", `${articleInCart.color}`);

  //Création du conteneur de l'image
  const $imageConteneur = document.createElement("div");
  $imageConteneur.classList.add("cart__item__img");

  //Création de l'image
  const $articleImage = document.createElement("img");
  $articleImage.setAttribute("src", `${article.imageUrl}`);
  $articleImage.setAttribute("alt", `${article.altTxt}`);

  //Création du conteneur des infos produit
  const $infosConteneur = document.createElement("div");
  $infosConteneur.classList.add("cart__item__content");

  //Création du conteneur description
  const $descriptionConteneur = document.createElement("div");
  $descriptionConteneur.classList.add("cart__item__content__description");

  //Création du nom du produit
  const $articleName = document.createElement("h2");
  $articleName.innerText = article.name;

  //Couleur
  const $articleColor = document.createElement("p");
  $articleColor.textContent = articleInCart.color;

  //Prix
  const $articlePrice = document.createElement("p");
  $articlePrice.textContent = article.price;

  //Création du conteneur "settings"
  const $settingsConteneur = document.createElement("div");
  $settingsConteneur.classList.add("cart__item__content__settings");

  //
  //Création du formulaire de quantité
  const $quantityConteneur = document.createElement("div");
  $quantityConteneur.classList.add("cart__item__content__settings__quantity");

  //Paragraphe
  const $quantityWord = document.createElement("p");
  $quantityWord.textContent = "Qté : ";

  //Sélecteur
  const $quantitySelector = document.createElement("input");
  $quantitySelector.setAttribute("type", "number");
  $quantitySelector.setAttribute("name", "itemQuantity");
  $quantitySelector.setAttribute("min", "1");
  $quantitySelector.setAttribute("max", "100");
  $quantitySelector.setAttribute("value", `${articleInCart.quantity}`);
  $quantitySelector.classList.add("itemQuantity");

  //
  //Création conteneur bouton "supprimer"
  const $deleteConteneur = document.createElement("div");
  $deleteConteneur.classList.add("cart__item__content__settings__delete");

  //Bouton
  const $deleteButton = document.createElement("p");
  $deleteButton.classList.add("deleteItem");
  $deleteButton.textContent = "Supprimer";

  //
  //Insertion des éléments
  $articlesContainer.appendChild($article);
  //
  $article.appendChild($imageConteneur);
  $imageConteneur.appendChild($articleImage);
  //
  $article.appendChild($infosConteneur);
  $infosConteneur.appendChild($descriptionConteneur);
  $descriptionConteneur.appendChild($articleName);
  $descriptionConteneur.appendChild($articleColor);
  $descriptionConteneur.appendChild($articlePrice);
  //
  $infosConteneur.appendChild($settingsConteneur);
  $settingsConteneur.appendChild($quantityConteneur);
  $quantityConteneur.appendChild($quantityWord);
  $quantityConteneur.appendChild($quantitySelector);
  //
  $settingsConteneur.appendChild($deleteConteneur);
  $deleteConteneur.appendChild($deleteButton);
}

//
//

//
//Fonction compilant la récupération des données du prduit et son insertion dans la page
async function main() {
  const articleData = await getOneProduct(articleInCart.id);
  console.log(articleData);

  insertArticleInCart(articleData);
}

//
//On crée une boucle pour récupérer les Id de chaque produit, leur couleur et leur quantité
//et les insérer dans la page
//
for (var articleInCart of panierClean) {
  main();
}
