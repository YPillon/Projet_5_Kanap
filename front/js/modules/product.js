import { articleId } from "../product.js";

//Création d'une fonction qui va récuérer les données produits liées à l'ID
export async function getOneProduct() {
    return fetch(`http://localhost:3000/api/products/${articleId}`)
      .then((res) => res.json())
      .catch((err) => console.log("Erreur: " + err));
  }

  //
//
//Fonction insérant les éléments du produit par rapport aux données récupérées
export function insertArticle(article) {
    //
    //Insertion de l'image
    const $itemImageContainer = document.querySelector(".item__img");
    const $itemImage = document.createElement("img");
    $itemImage.setAttribute("src", `${article.imageUrl}`);
    $itemImage.setAttribute("alt", `${article.altTxt}`);
    $itemImageContainer.appendChild($itemImage);
  
    //Insertion du titre
    const $itemTitle = document.getElementById("title");
    $itemTitle.textContent = article.name;
  
    //Insertion du prix
    const $itemPrice = document.getElementById("price");
    $itemPrice.textContent = article.price;
  
    //Insertion de la description
    const $itemDescription = document.getElementById("description");
    $itemDescription.textContent = article.description;
  
    //Insertion des couleurs dans le menu déroulant
    const $colorsList = document.getElementById("colors");
  
    for (let color of article.colors) {
      const $itemColor = document.createElement("option");
      $itemColor.setAttribute("value", `${color}`);
      $itemColor.textContent = color;
  
      $colorsList.appendChild($itemColor);
    }
  }

  export async function main() {
    const articleData = await getOneProduct();
  
    insertArticle(articleData);
  }
  
  