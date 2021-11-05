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
  fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch(function (err) {
      console.log("Erreur:", err);
    });
}

/*async function waitAllProducts() {
  const result = await getAllProducts();
  return result;
}

console.log(waitAllProducts());*/
//Retourne: Promise {<pending>}
//[[Prototype]]: Promise
//[[PromiseState]]: "fulfilled"
//[[PromiseResult]]: undefined

//
//Je créé la vignette d'un canapé à partir des données d'un objet du tableau
//
function createArticle(article) {
  const $link = document.createElement("a");
  $link.setAttribute("href", `./product.html?id=${article.id}`);

  const $article = document.createElement("article");

  const $image = document.createElement("img");
  $image.setAttribute("src", `../../back/images/${article.imageURL}`);
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
//
async function main() {
  const productData = await getAllProducts();
  //return productData;

  for (article of productData) {
    createArticle(article);
  }
}

console.log(main());

//
//Vérification que la fonction createArticle() fonctionne bien en statique
//
/*function createArticle() {
    const $link = document.createElement("a");
    $link.setAttribute("href", "./product.html?id=107fb5b75607497b96722bda5b504926");
  
    const $article = document.createElement("article");
  
    const $image = document.createElement("img");
    $image.setAttribute("src", "../../back/images/kanap01.jpeg");
    $image.setAttribute("alt", "Photo d'un canapé bleu, deux places");
  
    const $title = document.createElement("h3");
    $title.classList.add("productName");
    $title.innerText = "Kanap Sinopé";
  
    const $description = document.createElement("p");
    $description.classList.add("productDescription");
    $description.innerText = "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
  
    //Insertion des éléments dans la page HTML
    $listItems.appendChild($link);
    $link.appendChild($article);
    $article.appendChild($image);
    $article.appendChild($title);
    $article.appendChild($description);
  }

  createArticle();*/
