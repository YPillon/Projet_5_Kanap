//----------------------------Partie affichage et gestion du panier--------------------------//

//
//
//Fonction cherchant les données produits liées à l'ID
export async function getOneProduct(articleId) {
    return fetch(`http://localhost:3000/api/products/${articleId}`)
      .then((res) => res.json())
      .catch((err) => console.log("Erreur: " + err));
  }
  
  //
  //
  //Fonction insérant les données dans la page panier
  export function insertArticleInCart(article, articlePanier) {
    //On sélectionne le conteneur des produits
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
  //Fonction mettant à jour la quantité d'un produit dans le panier
  export function updateValue(e) {
    //On récupère la nouvelle valeur
    const newQuantity = e.target.value;
  
    //Si la nouvelle valeur est comprise entre 1 et 100, on met à jour la quantité
    if (e.target.value > 0 && e.target.value < 101) {
      //On sélectionne le noeud parent possédant "data-id" et "data-color"
      const produit = e.target.closest(".cart__item");
  
      //On récupère l'id et la couleur
      const idToUpdate = produit.dataset.id;
      const colorToUpdate = produit.dataset.color;
  
      //On récupère le panier et on le parse
      const panierToUpdate = JSON.parse(localStorage.getItem("panier"));
  
      //On recherche dans le panier un élément ayant le même ID et la même couleur que l'objet sélectionné
      const recherche = panierToUpdate.find(
        (article) => article.id === idToUpdate && article.color === colorToUpdate
      );
  
      //On crée un objet représentant la nouvelle valeur
      let newQuantityValue = {
        quantity: newQuantity,
      };
  
      //On fusionne les anciennes données du produit avec la nouvelle quantité
      let nouveauProduit = Object.assign(recherche, newQuantityValue);
  
      //On supprime l'ancien panier au niveau du LocalStorage
      localStorage.removeItem("panier");
  
      //On envoie le nouveau panier dans le localStorage
      localStorage.setItem("panier", JSON.stringify(panierToUpdate));
      console.log(localStorage.getItem("panier"));
    }
    //
    //Exceptions
    //
    //Si la quantité choisie est inférieure à 1
    if (e.target.value < 1) {
      //On affiche le message suivant
      alert("Veuillez choisir une quantité entre 1 et 100");
      //On ramène la valeur à 1
      e.target.value = 1;
      //On rappelle la fonction à l'intérieur d'elle-même pour que le nombre total d'article
      //et le prix soient mis à jour
      updateValue(e);
    }
    //Si la quantité choisie est supérieure à 100
    if (e.target.value > 100) {
      //On affiche le message suivant
      alert("Vous ne pouvez pas commander plus de 100 articles de cette couleur");
      //On ramène la valeur à 100
      e.target.value = 100;
      //On rappelle la fonction à l'intérieur d'elle-même pour que le nombre total d'article
      //et le prix soient mis à jour
      updateValue(e);
    }
  
    //On recalcule le prix total
    calculatePrice();
  
    //On recalcule la quantité totale
    calculateItemsQuantity();
  }
  
  //
  //
  //Fonction supprimant un article
  export function deleteItem(e) {
    //On sélectionne le noeud parent possédant "data-id" et "data-color"
    const produit = e.target.closest(".cart__item");
    //console.log(produit);
  
    //On récupère l'id et la couleur
    const idToDelete = produit.dataset.id;
    const colorToDelete = produit.dataset.color;
  
    //On récupère le panier et on le parse
    const panierToUpdate = JSON.parse(localStorage.getItem("panier"));
    //console.log(panierToUpdate);
  
    //On recherche dans le panier l'index d' l'élément ayant le même ID et la même couleur que l'objet sélectionné
    const indexToDelete = panierToUpdate.findIndex(
      (article) => article.id === idToDelete && article.color === colorToDelete
    );
    //console.log("recherche index: " + indexToDelete);
  
    //On supprime l'élément
    panierToUpdate.splice(indexToDelete, 1);
    //console.log(panierToUpdate);
  
    //On supprime l'ancien panier au niveau du LocalStorage
    localStorage.removeItem("panier");
  
    //On envoie le nouveau panier dans le localStorage
    localStorage.setItem("panier", JSON.stringify(panierToUpdate));
    //console.log(localStorage.getItem("panier"));
  
    //On sélectionne le conteneur des produits dans le DOM
    const $articlesContainer = document.getElementById("cart__items");
  
    //On supprime le produit dans le DOM
    $articlesContainer.removeChild(produit);
  
    //On recalcule le prix total
    calculatePrice();
  
    //On recalcule la quantité totale
    calculateItemsQuantity();
  }
  
  //
  //
  //Fonction compilant la récupération des données du produit et leur insertion dans la page
  export async function main(articleInCart) {
    //console.log(articleInCart.id);
  
    const articleData = await getOneProduct(articleInCart.id);
    //console.log(articleData);
  
    insertArticleInCart(articleData, articleInCart);
  }

  //
//
//Fonction calculant le prix total à afficher
export async function calculatePrice() {
    //On récupère le panier et on le parse
    const panier = JSON.parse(localStorage.getItem("panier"));
  
    //On initialise la variable qui comptabilisera tous les prix
    let allArticlesPrice = 0;
  
    //On parcoure le panier
    for (let item of panier) {
      //On récupère les données de l'article via l'API
      const articleData = await getOneProduct(item.id);
  
      //On récupère le prix de l'article
      var articlePrice = articleData.price;
  
      //On multiplie le prix de l'article par sa quantité
      var articleTotalPrice = articlePrice * item.quantity;
  
      //On additionne la valeur au prix total de tous les articles
      allArticlesPrice += articleTotalPrice;
    }
    //On sélectionne l'élément correspondant au prix total dans le DOM et on y affecte la valeur
    const $totalPrice = document.getElementById("totalPrice");
    $totalPrice.innerText = allArticlesPrice;
  }
  
  //
  //
  //Fonction calculant la quantité totale d'articles à afficher
  export function calculateItemsQuantity() {
    //On récupère le panier et on le parse
    const panier = JSON.parse(localStorage.getItem("panier"));
  
    //On initialise la variable qui comptabilisera le nombre total d'articles
    let allArticlesQuantity = 0;
  
    for (let item of panier) {
      allArticlesQuantity += parseInt(item.quantity, 10);
    }
    //On sélectionne l'élément correspondant au nombre total d'articles dans le DOM
    const $totalNumberOfArticles = document.getElementById("totalQuantity");
    $totalNumberOfArticles.innerText = allArticlesQuantity;
  }

  //--------------------------------Gestion du formulaire--------------------------------//

  //
//Fonction testant la validité du prénom et du nom
export function isNameValid(name) {
    return /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g.test(name);
  }

  //
//Fonction testant la validité de l'adresse
export function isAddressValid(address) {
    return /(\d{1,}) [a-zA-Z0-9\s]+(\.)? [a-zA-Z]+(\,)?/g.test(address);
  }

  //
//Fonction testant la validité de la ville
export function isCityValid(city) {
    return /([a-zA-Z'\s]){1,}/g.test(city);
  }

  //
//Fonction vérifiant la validité de l'email
export function isEmailValid(email) {
    return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
      email
    );
  }

import { $firstNameInput, $lastNameInput, $addressInput,$cityInput, $emailInput } from "../cart.js";

//
//
//Gestion lors de l'envoi du formulaire
//
//Fonction créant un objet "contact"
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
  
  //
  //
  //Fonction créant le tableau de produits à envoyer
  export function putCartInAnArray() {
    //On récupère le panier et on le parse
    const panier = JSON.parse(localStorage.getItem("panier"));
  
    //On crée notre tableau de produits, vide
    const products = [];
  
    //On crée une boucle récupérant chaque ID et le mettant dans le tableau
    for (let item of panier) {
      products.push(item.id);
    }
    return products;
  }
  
  //
  //
  //Fonction envoyant les données à l'API
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
        //On redirige vers la page de confirmation en insérant le numéro de commande dans l'url
        //de la page
        location.href = `./confirmation.html?orderId=${res.orderId}`;
      })
      .catch((err) => console.log("Erreur: " + err));
  }