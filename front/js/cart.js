//On récupère le panier
const panierRaw = localStorage.getItem("panier");

//On convertit le panier en tableau javascript
const panierClean = JSON.parse(panierRaw);
//console.log(panierClean);

//Fonction cherchant les données produits liées à l'ID
async function getOneProduct(articleId) {
  return fetch(`http://localhost:3000/api/products/${articleId}`)
    .then((res) => res.json())
    .catch((err) => console.log("Erreur: " + err));
}

//Je veux:
//-Sélectionner les sélecteurs dans le HTML*
//-Pour chaque sélecteur*
//-Ecouter un changement de quantité*
//-Récupérer la nouvelle valeur*
//-Récupérer l'Id et la couleur du produit avec dataset()
//-récupérer le panier
//-chercher l'objet correspondant dans le panier avec find()
//-affecter la nouvelle valeur
//-renvoyer le panier

//
//
//Fonction mettant à jour la quantité d'un produit dans le panier
function updateValue(e) {
  //On récupère la nouvelle valeur
  const newQuantity = e.target.value;

  //Si la nouvelle valeur est supérieure à 0, on met à jour la quantité
  if (e.target.value > 0) {
    //On sélectionne le noeud parent possédant "data-id" et "data-color"
    const produit = e.target.closest(".cart__item");
    //console.log(produit);

    //On récupère l'id et la couleur
    const idToUpdate = produit.dataset.id;
    const colorToUpdate = produit.dataset.color;

    //On récupère le panier et on le parse
    const panierToUpdate = JSON.parse(localStorage.getItem("panier"));
    //console.log(panierToUpdate);

    //On recherche dans le panier un élément ayant le même ID et la même couleur que l'objet sélectionné
    const recherche = panierToUpdate.find(
      (article) => article.id === idToUpdate && article.color === colorToUpdate
    );
    //console.log(recherche);

    //On crée un objet représentant la nouvelle valeur
    let newQuantityValue = {
      quantity: newQuantity,
    };

    //On fusionne les anciennes données du produit avec la nouvelle quantité
    nouveauProduit = Object.assign(recherche, newQuantityValue);
    //console.log(nouveauProduit);
    //console.log(panierToUpdate);

    //On supprime l'ancien panier au niveau du LocalStorage
    localStorage.removeItem("panier");

    //On envoie le nouveau panier dans le localStorage
    localStorage.setItem("panier", JSON.stringify(panierToUpdate));
    console.log(localStorage.getItem("panier"));
  }
}

//
//
//Fonction supprimant un article
function deleteItem(e) {
  //On sélectionne le noeud parent possédant "data-id" et "data-color"
  const produit = e.target.closest(".cart__item");
  console.log(produit);

  //On récupère l'id et la couleur
  const idToDelete = produit.dataset.id;
  const colorToDelete = produit.dataset.color;

  //On récupère le panier et on le parse
  const panierToUpdate = JSON.parse(localStorage.getItem("panier"));
  console.log(panierToUpdate);

  //On recherche dans le panier l'index d' l'élément ayant le même ID et la même couleur que l'objet sélectionné
  const indexToDelete = panierToUpdate.findIndex(
    (article) => article.id === idToDelete && article.color === colorToDelete
  );
  console.log('recherche index: ' + indexToDelete);

  //On supprime l'élément
  panierToUpdate.splice(indexToDelete, 1);
  console.log(panierToUpdate);

  //On supprime l'ancien panier au niveau du LocalStorage
  localStorage.removeItem("panier");

  //On envoie le nouveau panier dans le localStorage
  localStorage.setItem("panier", JSON.stringify(panierToUpdate));
  console.log(localStorage.getItem("panier"));

  //On sélectionne le conteneur des produits dans le DOM
  const $articlesContainer = document.getElementById("cart__items");

  //On supprime le produit dans le DOM
  $articlesContainer.removeChild(produit);
}

//
//
//Je crée une fonction insérant les donnée dans la page panier
function insertArticleInCart(article, articlePanier) {
  //Je sélectionne le conteneur des produits
  const $articlesContainer = document.getElementById("cart__items");

  //Création des éléments
  //
  //Création de l'article
  const $article = document.createElement("article");
  $article.classList.add("cart__item");
  $article.setAttribute("data-id", `${articlePanier.id}`);
  $article.setAttribute("data-color", `${articlePanier.color}`);

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
  $articleColor.textContent = articlePanier.color;

  //Prix
  const $articlePrice = document.createElement("p");
  $articlePrice.textContent = `${article.price} €`;

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
  $quantitySelector.setAttribute("class", "itemQuantity");
  $quantitySelector.setAttribute("name", "itemQuantity");
  $quantitySelector.setAttribute("min", "1");
  $quantitySelector.setAttribute("max", "100");
  $quantitySelector.setAttribute("value", `${articlePanier.quantity}`);

  //Ajout de la modification de la quantité
  $quantitySelector.addEventListener("change", updateValue);

  //
  //Création conteneur bouton "supprimer"
  const $deleteConteneur = document.createElement("div");
  $deleteConteneur.classList.add("cart__item__content__settings__delete");

  //Bouton
  const $deleteButton = document.createElement("p");
  $deleteButton.classList.add("deleteItem");
  $deleteButton.textContent = "Supprimer";

  //Ajout de la suppression de l'article
  $deleteButton.addEventListener("click", deleteItem);

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
//Fonction compilant la récupération des données du produit et leur insertion dans la page
async function main(articleInCart) {
  //console.log(articleInCart.id);

  const articleData = await getOneProduct(articleInCart.id);
  //console.log(articleData);

  insertArticleInCart(articleData, articleInCart);
}

//
//On crée une boucle pour récupérer les Id de chaque produit, leur couleur et leur quantité
//et les insérer dans la page
//
for (var articleInCart of panierClean) {
  //console.log(articleInCart);

  //console.log(articleInCart.id); //
  //console.log(articleInCart.color); //Retournent les bonnes valeurs
  //console.log(articleInCart.quantity); //

  main(articleInCart);
}

//
//Partie gérant le changement de quantité et la suppression de produit dans le panier
//
