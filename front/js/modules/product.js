import { articleId } from "../product.js";

/**
 * Cherche les données du produit dont
 * l'ID est dans l'url de la page
 * @returns { Promise } Objet contenant les données de l'article
 */
export async function getOneProduct() {
  return fetch(`http://localhost:3000/api/products/${articleId}`)
    .then((res) => res.json())
    .catch((err) => console.log("Erreur: " + err));
}

/**
 * Crée une vignette à partir des données produit
 * @param { Object } article
 */
export function insertArticle(article) {
  const $itemImageContainer = document.querySelector(".item__img");
  const $itemImage = document.createElement("img");
  $itemImage.setAttribute("src", `${article.imageUrl}`);
  $itemImage.setAttribute("alt", `${article.altTxt}`);
  $itemImageContainer.appendChild($itemImage);

  const $itemTitle = document.getElementById("title");
  $itemTitle.textContent = article.name;

  const $itemPrice = document.getElementById("price");
  $itemPrice.textContent = article.price;

  const $itemDescription = document.getElementById("description");
  $itemDescription.textContent = article.description;

  const $colorsList = document.getElementById("colors");
  for (let color of article.colors) {
    const $itemColor = document.createElement("option");
    $itemColor.setAttribute("value", `${color}`);
    $itemColor.textContent = color;

    $colorsList.appendChild($itemColor);
  }
}

/**
 * Fonction compilant getOneProduct() et insertArticle()
 */
export async function main() {
  const articleData = await getOneProduct();

  insertArticle(articleData);
}
