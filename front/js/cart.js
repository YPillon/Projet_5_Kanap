//----------------------------Partie affichage et gestion du panier--------------------------//
import { main, calculatePrice,calculateItemsQuantity } from "./modules/cart.js";

//On récupère le panier
const panierRaw = localStorage.getItem("panier");

//On convertit le panier en tableau javascript
const panierClean = JSON.parse(panierRaw);

//
//On crée une boucle pour récupérer les Id de chaque produit, leur couleur et leur quantité
//et les insérer dans la page
//
for (let articleInCart of panierClean) {
  main(articleInCart);
}

calculatePrice();
calculateItemsQuantity();

//--------------------------------Gestion du formulaire--------------------------------//

import { isNameValid, isAddressValid, isCityValid, isEmailValid, createContact, putCartInAnArray, postFormData } from "./modules/cart.js";

//
//
//Regex

//On sélectionne le bouton du formulaire
const $orderBtn = document.getElementById("order");

//On vise les champs "prénom" et "nom" du formulaire
export const $firstNameInput = document.getElementById("firstName");
export const $lastNameInput = document.getElementById("lastName");

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

//On vise le champ "adresse" du formulaire
export const $addressInput = document.getElementById("address");

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

//On vise le champ "ville" du formulaire
export const $cityInput = document.getElementById("city");

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

//On vise le champ email du formulaire
export const $emailInput = document.getElementById("email");

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
  //Si un message d'erreur est affiché en-dessous d'un champ, 
  //on empêche le formulaire d'être envoyé
  if (
    document.getElementById("firstNameErrorMsg").innerText != "" ||
    document.getElementById("lastNameErrorMsg").innerText != "" ||
    document.getElementById("addressErrorMsg").innerText != "" ||
    document.getElementById("cityErrorMsg").innerText != "" ||
    document.getElementById("emailErrorMsg").innerText != ""
  ) {
    alert(
      "Veuillez remplir les champs du formulaire en suivant les instructions"
    );
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

    //On poste la requête et on récupère la réponse
    postFormData(aEnvoyer);
  }
});
