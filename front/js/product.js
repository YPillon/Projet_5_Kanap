//----------------------------------Affichage du produit-----------------------------------//

import { main, articleId } from "./modules/product.js";

main();

//-------------------------------------Ajout au panier-------------------------------------//

//Sélection des champs du formulaire
const $articleQuantity = document.getElementById("quantity");
const $colorsList = document.getElementById("colors");
const $addToCartBtn = document.getElementById("addToCart");

//Ecouter le bouton et ajouter au panier
$addToCartBtn.addEventListener("click", function (e) {
  const quantityChoice = $articleQuantity.value;
  const colorChoice = $colorsList.value;

  //Si le panier n'existe pas encore, on le crée
  if (localStorage.getItem("panier") === null) {
    const panier = [];
    localStorage.setItem("panier", JSON.stringify(panier));
  }

  let articleSelected = {
    id: articleId,
    color: colorChoice,
    quantity: quantityChoice,
  };

  const panierClean = JSON.parse(localStorage.getItem("panier"));
  const recherche = panierClean.find(
    (article) => article.id === articleId && article.color === colorChoice
  );
  console.log(recherche);

  //Si on n'a pas trouvé l'article avec find(), on rajoute un objet dans le tableau
  if (recherche === undefined) {
    console.log("Introuvable!");
    if (articleSelected.color === "") {
      alert("Veuillez sélectionner une couleur");
    } else if (
      (articleSelected.quantity === "0" ||
        parseInt(articleSelected.quantity, 10) > 100) &&
      articleSelected.color != ""
    ) {
      alert("Veuillez sélectionner une quantité entre 1 et 100");
    } else {
      panierClean.push(articleSelected);
      console.log(panierClean);

      //On remplace le panier
      localStorage.removeItem("panier");
      localStorage.setItem("panier", JSON.stringify(panierClean));
      console.log(localStorage.getItem("panier"));

      const $articleName = document.getElementById("title").innerText;
      alert(`Votre ${$articleName} a été ajouté au panier !`);
    }
  }
  //Si on a trouvé l'article, on met à jour la quantité
  else {
    console.log("trouvé!");
    if (articleSelected.color === "") {
      alert("Veuillez sélectionner une couleur");
    } else if (
      (articleSelected.quantity === "0" ||
        parseInt(articleSelected.quantity, 10) > 100) &&
      articleSelected.color != ""
    ) {
      alert("Veuillez sélectionner une quantité entre 1 et 100");
    } else {
      if (recherche.quantity == "100") {
        alert("Vous ne pouvez commander que 100 articles de cette couleur");
      } else {
        //On met à jour la quantité
        articleSelected.quantity = (
          parseInt(articleSelected.quantity, 10) +
          parseInt(recherche.quantity, 10)
        ).toString();
        console.log(articleSelected.quantity);
        if (parseInt(articleSelected.quantity, 10) > 100) {
          articleSelected.quantity = "100";
          //alert("Vous ne pouvez commander que 100 articles de cette couleur");
        }
        //On remplace l'ancienne quantité de l'article par la nouvelle
        Object.assign(recherche, articleSelected);
        console.log(panierClean);

        localStorage.removeItem("panier");
        localStorage.setItem("panier", JSON.stringify(panierClean));
        console.log(localStorage.getItem("panier"));

        const $articleName = document.getElementById("title").innerText;
        console.log($articleName);
        alert(`Votre ${$articleName} a été ajouté au panier !`);
      }
    }
  }
});
