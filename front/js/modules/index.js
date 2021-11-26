const $listItems = document.getElementById("items");

/**
 * Cherche les données de tous les produits
 * @return { Promise } tableau contenant les données produits
 */
export async function getAllProducts() {
  return fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .catch(function (err) {
      console.log("Erreur:", err);
    });
}

/**
 * Crée une vignette à partir des données
 * d'un produit et l'insère dans le DOM
 * @param { Object } article
 */
export function createArticle(article) {
  const $link = document.createElement("a");
  $link.setAttribute("href", `./product.html?id=${article._id}`);

  const $article = document.createElement("article");

  const $image = document.createElement("img");
  $image.setAttribute("src", `${article.imageUrl}`);
  $image.setAttribute("alt", `${article.altTxt}`);

  const $title = document.createElement("h3");
  $title.classList.add("productName");
  $title.innerText = article.name;

  const $description = document.createElement("p");
  $description.classList.add("productDescription");
  $description.innerText = article.description;

  //Insertion des éléments dans la page HTML
  $listItems.appendChild($link);
  $link.appendChild($article);
  $article.appendChild($image);
  $article.appendChild($title);
  $article.appendChild($description);
}

/**
 * Fonction compilant getAllProducts() et creatArticle()
 */
export async function main() {
  const productData = await getAllProducts();

  for (let article of productData) {
    createArticle(article);
  }
}
