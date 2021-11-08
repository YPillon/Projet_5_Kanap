//Je récupère l'URL de la page produit
var str = window.location.href;

//Je stocke cette URL dans un objet URL
var url = new URL(str);

//Je récupère la valeur de l'ID dans contenu dans l'URL
var articleId = url.searchParams.get("id");

//Je vais chercher les données produits liées à l'ID
async function getOneProduct() {
  return (
    fetch(`http://localhost:3000/api/products/${articleId}`)
      .then((res) => res.json())
      /*.then((res) => {
      console.log(res);
    })*/
      .catch((err) => console.log("Erreur: " + err))
  );
}

//
//J'insère les éléments du produit par rapport aux données récupérées
//
function insertArticle(article) {
  //
  //Inserttion de l'image
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

  for (color of article.colors) {
    const $itemColor = document.createElement("option");
    $itemColor.setAttribute("value", `${color}`);
    $itemColor.textContent = color;

    $colorsList.appendChild($itemColor);
  }
}

//
//Fonction compilant toutes les autres de la page
//
async function main() {
  const articleData = await getOneProduct();

  insertArticle(articleData);
}

main();


//
//Partie ajout au panier
//

// On veut=
// - créer une classe articleInCart
// - Au clic du bouton
// -récuperer l'id, la quantité et la couleur
// -Envoyer ça à localStorage
// -Si même ID + même couleur alors incrémenter la quantité
// -Sinon créer une nouvelle instance et l'insérer au tableau

const articlesInCart = [];

localStorage.setItem('tableau', JSON.stringify(articlesInCart))

class articleInCart {
    constructor(id, quantity, color) {
        this.id = id;
        this.quantity = quantity;
        this.color = color;
    }
}

const $quantity = document.getElementById('quantity');
const $color = document.querySelector('#colors > option');

function retrieveData() {
    let article = new articleInCart(articleId, $quantity.value, $color.value);

    let $arrayInLocalStorageRaw = localStorage.get('tableau');
    let $arrayInLocalStorageClean = JSON.parse($arrayInLocalStorageRaw);


}

const $addToCart = document.getElementById('addToCart');

$addToCart.addEventListener('click', retrieveData())



