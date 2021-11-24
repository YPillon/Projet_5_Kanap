//----------------------------Partie affichage et gestion du panier--------------------------//

import {
  main,
  calculatePrice,
  calculateItemsQuantity,
} from "./modules/cart.js";

const panierClean = JSON.parse(localStorage.getItem("panier"));

//On crée une boucle pour récupérer les Id de chaque produit,
//leur couleur et leur quantité et les insérer dans la page
for (let articleInCart of panierClean) {
  main(articleInCart);
}

calculatePrice();
calculateItemsQuantity();

//--------------------------------Gestion du formulaire--------------------------------//

import {
  isNameValid,
  isAddressValid,
  isCityValid,
  isEmailValid,
  createContact,
  putCartInAnArray,
  postFormData,
} from "./modules/cart.js";

const $orderBtn = document.getElementById("order");

export const $firstNameInput = document.getElementById("firstName");
export const $lastNameInput = document.getElementById("lastName");
export const $addressInput = document.getElementById("address");
export const $cityInput = document.getElementById("city");
export const $emailInput = document.getElementById("email");

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

//On ajoute la vérification lors du changement pour l'email
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
    let contact = createContact();
    console.log(contact);
    let products = putCartInAnArray();
    console.log(products);
    const aEnvoyer = {
      contact,
      products,
    };

    postFormData(aEnvoyer);
  }
});
