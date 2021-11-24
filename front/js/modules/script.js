 //On sélectionne le conteneur qui contiendra tous les articles
const $listItems = document.getElementById("items");
 
 //Je récupère les données
 export async function getAllProducts() {
  return fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .catch(function (err) {
      console.log("Erreur:", err);
    });
}

//
//Je créé la vignette d'un canapé à partir des données d'un objet du tableau
//
export function createArticle(article) {
    //On crée les lien redirigeant vers la page produit
    const $link = document.createElement("a");
    $link.setAttribute("href", `./product.html?id=${article._id}`);
  
    //Création de l'article contenant le reste des données produit
    const $article = document.createElement("article");
  
    //Création de l'image
    const $image = document.createElement("img");
    $image.setAttribute("src", `${article.imageUrl}`);
    $image.setAttribute("alt", `${article.altTxt}`);
  
    //Création du titre
    const $title = document.createElement("h3");
    $title.classList.add("productName");
    $title.innerText = article.name;
  
    //Création de la description
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
  //Fonction compilant la récupération des données, la création et l'insertion des articles
  //dans la page
  //
  export async function main() {
    const productData = await getAllProducts();
    console.log(productData);
  
    for (article of productData) {
      createArticle(article);
    }
  }