const $listItems = document.getElementById("items");

//
//
//Je veux une fonction qui:
//-recupere les données
//-parcoure le tableau reçu
//-créé une image et l'insère
//-créé un titre et l'insère
//-créé une description et l'insère
//
//

//Je récupère les données
async function getAllProducts() {
  return fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .catch(function (err) {
      console.log("Erreur:", err);
    });
}

//
//Je créé la vignette d'un canapé à partir des données d'un objet du tableau
//
function createArticle(article) {
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

//
//Fonction compilant toutes les autres de la page
//
async function main() {
  const productData = await getAllProducts();

  for (article of productData) {
    createArticle(article);
  }
}

main();

