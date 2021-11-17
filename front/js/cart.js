//On récupère le panier
const panierRaw = localStorage.getItem("panier");

//On convertit le panier en tableau javascript
const panierClean = JSON.parse(panierRaw);
//console.log(panierClean);

//
//
//Fonction cherchant les données produits liées à l'ID
async function getOneProduct(articleId) {
  return fetch(`http://localhost:3000/api/products/${articleId}`)
    .then((res) => res.json())
    .catch((err) => console.log("Erreur: " + err));
}

//
//
//Fonction mettant à jour la quantité d'un produit dans le panier
function updateValue(e) {
  //On récupère la nouvelle valeur
  const newQuantity = e.target.value;

  //Si la nouvelle valeur est comprise entre 1 et 100, on met à jour la quantité
  if (e.target.value > 0 && e.target.value < 101) {
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
  //Exceptions
  //
  //Si la quantité choisie est inférieure à 1
  if (e.target.value < 1) {
    //On affiche le message suivant
    alert("Veuillez choisir une quantité entre 1 et 100");
    //On ramène la valeur à 1
    e.target.value = 1;
    //On rappelle la fonction à l'intérieur d'elle-même
    updateValue(e);
  }
  //Si la quantité choisie est supérieure à 100
  if (e.target.value > 100) {
    //On affiche le message suivant
    alert("Veuillez choisir une quantité entre 1 et 100");
    //On ramène la valeur à 1
    e.target.value = 100;
    //On rappelle la fonction à l'intérieur d'elle-même
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
function deleteItem(e) {
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
//Je crée une fonction insérant les données dans la page panier
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
  main(articleInCart);
}

//
//
//Fonction calculant le prix total à afficher
async function calculatePrice() {
  //On récupère le panier et on le parse
  const panier = JSON.parse(localStorage.getItem("panier"));
  //console.log(panier);

  //On initialise la variable qui comptabilisera tous les prix
  let allArticlesPrice = 0;

  //On parcoure le panier
  for (let item of panier) {
    //On récupère les données de l'article via l'API
    const articleData = await getOneProduct(item.id);
    //console.log(articleData);

    //On récupère le prix de l'article
    var articlePrice = articleData.price;

    //On multiplie le prix de l'article par sa quantité
    var articleTotalPrice = articlePrice * item.quantity;
    //console.log(item.quantity);
    //console.log(articleTotalPrice);

    //On additionne la valeur au prix total de tous les articles
    allArticlesPrice += articleTotalPrice;
    //console.log(allArticlesPrice);
  }
  //On sélectionne l'élément correspondant au prix total dans le DOM et on y affecte la valeur
  const $totalPrice = document.getElementById("totalPrice");
  $totalPrice.innerText = allArticlesPrice;
}

//
//
//Fonction calculant la quantité totale d'articles à afficher
function calculateItemsQuantity() {
  //On récupère le panier et on le parse
  const panier = JSON.parse(localStorage.getItem("panier"));
  //console.log(panier);

  //On initialise la variable qui comptabilisera le nombre total d'articles
  let allArticlesQuantity = 0;

  for (let item of panier) {
    allArticlesQuantity += parseInt(item.quantity, 10);
    //console.log(allArticlesQuantity);
  }
  //On sélectionne l'élément correspondant au nombre total d'articles dans le DOM
  const $totalNumberOfArticles = document.getElementById("totalQuantity");
  $totalNumberOfArticles.innerText = allArticlesQuantity;
}

calculatePrice();
calculateItemsQuantity();

//--------------------------------Gestion du formulaire--------------------------------//

//Regex
//

//On sélectionne le bouton du formulaire
const $orderBtn = document.getElementById("order");

//Fonction testant la validité du prénom et du nom
function isNameValid(name) {
  return /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g.test(name);
}

//On vise les champs "prénom" et "nom" du formulaire
const $firstNameInput = document.getElementById("firstName");
const $lastNameInput = document.getElementById("lastName");

//On ajoute la vérification lors du changement pour le prénom
$firstNameInput.addEventListener("change", function (e) {
  if (isNameValid($firstNameInput.value) === false) {
    console.log(isNameValid($firstNameInput.value));
    document.getElementById("firstNameErrorMsg").innerText =
      "Veuillez saisir votre prénom sans accents ni caractères spéciaux";
  } else {
    console.log(isNameValid($firstNameInput.value));
    document.getElementById("firstNameErrorMsg").innerText = "";
  }
});

//On ajoute la vérification lors du changement pour le nom
$lastNameInput.addEventListener("change", function (e) {
  if (isNameValid($lastNameInput.value) === false) {
    console.log(isNameValid($lastNameInput.value));
    document.getElementById("lastNameErrorMsg").innerText =
      "Veuillez saisir votre nom sans accents ni caractères spéciaux";
  } else {
    console.log(isNameValid($lastNameInput.value));
    document.getElementById("lastNameErrorMsg").innerText = "";
  }
});

//Fonction testant la validité de l'adresse
function isAddressValid(address) {
  return /(\d{1,}) [a-zA-Z0-9\s]+(\.)? [a-zA-Z]+(\,)?/g.test(address);
}

//On vise le champ "adresse" du formulaire
const $addressInput = document.getElementById("address");

//On ajoute la vérification lors du changement pour l'adresse
$addressInput.addEventListener("change", function (e) {
  if (isAddressValid($addressInput.value) === false) {
    console.log(isAddressValid($addressInput.value));
    document.getElementById("addressErrorMsg").innerText =
      "Veuillez saisir une adresse valide";
  } else {
    console.log(isAddressValid($addressInput.value));
    document.getElementById("addressErrorMsg").innerText = "";
  }
});

//Fonction testant la validité de la ville
function isCityValid(city) {
  return /([a-zA-Z'\s]){1,}/g.test(city);
}

//On vise le champ "ville" du formulaire
const $cityInput = document.getElementById("city");

//On ajoute la vérification lors du changement pour la ville
$cityInput.addEventListener("change", function (e) {
  if (isCityValid($cityInput.value) === false) {
    console.log(isCityValid($cityInput.value));
    document.getElementById("cityErrorMsg").innerText =
      "Veuillez saisir un nom de ville valide";
  } else {
    console.log(isCityValid($cityInput.value));
    document.getElementById("cityErrorMsg").innerText = "";
  }
});

//Fonction vérifiant si l'email est valide
function isEmailValid(email) {
  return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
    email
  );
}

//On vise le champ email du formulaire
const $emailInput = document.getElementById("email");

//On ajoute la vérification lors du changement
$emailInput.addEventListener("change", function (e) {
  if (isEmailValid($emailInput.value) === false) {
    console.log(isEmailValid($emailInput.value));
    document.getElementById("emailErrorMsg").innerText =
      "Veuillez saisir une adresse email valide";
  } else {
    document.getElementById("emailErrorMsg").innerText = "";
  }
});

//
//
//Gestion lors de l'envoi du formulaire
//
//Fonction créant un objet "contact"
function createContact() {
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
//Fonction créant le tableau de produits
function putCartInAnArray() {
  //On récupère le panier et on le parse
  const panier = JSON.parse(localStorage.getItem("panier"));

  //On crée notre tableau de produits, vide
  const products = [];

  //On crée une boucle récupérant chaque ID et le mettant dans le tableau
  for (item of panier) {
    products.push(item.id);
  }
  return products;
}

//
//
//Fonction envoyant les données à l'API
async function postFormData(objet) {
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

//Fonction récupérant la réponse de l'API
async function getResponse(objet) {
  const response = await postFormData(objet);
  console.log(response);
}

//Au clic sur le bouton "commander!" on déclenche le code suivant
$orderBtn.addEventListener("click", function (e) {
  e.preventDefault();
  //On vérifie que tous les champs du formulaire sont remplis
  if (
    $firstNameInput.value == "" ||
    $lastNameInput.value == "" ||
    $addressInput.value == "" ||
    $cityInput.value == "" ||
    $emailInput.value == ""
  ) {
    alert("Veuillez remplir tous les champs du formulaire");
  }
  //Si un message d'erreur est affiché, on empêche le formulaire d'être envoyé
  if (
    document.getElementById("firstNameErrorMsg").innerText != "" ||
    document.getElementById("lastNameErrorMsg").innerText != "" ||
    document.getElementById("addressErrorMsg").innerText != "" ||
    document.getElementById("cityErrorMsg").innerText != "" ||
    document.getElementById("emailErrorMsg").innerText != ""
  ) {
    alert("Veuillez remplir tous les champs du formulaire");
  }
  //Si tout est rempli correctement, on envoie le formulaire à l'API
  if (
    $firstNameInput.value != "" &&
    $lastNameInput.value != "" &&
    $addressInput.value != "" &&
    $cityInput.value != "" &&
    $emailInput.value != "" &&
    document.getElementById("firstNameErrorMsg").innerText == "" &&
    document.getElementById("lastNameErrorMsg").innerText == "" &&
    document.getElementById("addressErrorMsg").innerText == "" &&
    document.getElementById("cityErrorMsg").innerText == "" &&
    document.getElementById("emailErrorMsg").innerText == ""
  ) {
    //On crée l'objet "contact"
    let contact = createContact();
    console.log(contact);

    //On crée le tableau "products"
    let products = putCartInAnArray();
    console.log(products);

    //On crée l'objet à envoyer rassemblant "contact" et "products"
    const aEnvoyer = {
      contact,
      products,
    };

    //On poste la requête
    getResponse(aEnvoyer);
  }
});
