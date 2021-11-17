//Je récupère l'URL de la page produit
var str = window.location.href;

//Je stocke cette URL dans un objet URL
var url = new URL(str);

//Je récupère la valeur de l'ID contenu dans l'URL
var articleId = url.searchParams.get("id");
console.log("ID = " + articleId);

//Je vais chercher les données produits liées à l'ID
async function getOneProduct() {
  return fetch(`http://localhost:3000/api/products/${articleId}`)
    .then((res) => res.json())
    .catch((err) => console.log("Erreur: " + err));
}

//
//J'insère les éléments du produit par rapport aux données récupérées
//
function insertArticle(article) {
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

//Sélection de l'id "quantité" du formulaire
const $articleQuantity = document.getElementById("quantity");

//Sélection de l'id "couleur" du formulaire
const $colorsList = document.getElementById("colors");

//Sélection du bouton add to cart
const $addToCartBtn = document.getElementById("addToCart");

//
//
//Ecouter le bouton et envoyer le panier
$addToCartBtn.addEventListener("click", function (e) {
  //Mettre le choix de l'utilisateur dans une variable
  const quantityChoice = $articleQuantity.value;

  //Mettre le choix de l'utilisateur dans une variable
  const colorChoice = $colorsList.value;

  //Si le panier n'existe pas encore, on le créé
  if (localStorage.getItem("panier") === null) {
    const panier = [];
    localStorage.setItem("panier", JSON.stringify(panier));
  }

  //Création de l'objet correspondant au choix de la couleur et quantité
  let articleSelected = {
    id: articleId,
    color: colorChoice,
    quantity: quantityChoice,
  };

  //On récupère le panier
  const panierRaw = localStorage.getItem("panier");

  //On convertit le panier en tableau javascript
  const panierClean = JSON.parse(panierRaw);
  console.log(panierClean);

  //On recherche dans le panier un élément ayant le même ID et la même couleur que l'objet sélectionné
  const recherche = panierClean.find(
    (article) => article.id === articleId && article.color === colorChoice
  );
  console.log(recherche);

  //Si on a pas trouvé l'élément, on rajoute un objet dans les tableau
  if (recherche === undefined) {
    console.log("Introuvable!");
    //Si il n'y a pas de quantité ou pas de couleur, on ne traite pas l'ajout au panier
    if (articleSelected.color === "" || articleSelected.quantity === "0") {
      alert("Veuillez sélectionner une couleur et une quantité");
    }
    //Si quantité et couleur sont conformes, on ajoute le nouvel élément au panier
    else {
      panierClean.push(articleSelected);
      console.log(panierClean);

      //On supprime l'ancien panier au niveau du LocalStorage
      localStorage.removeItem("panier");

      //On envoie le nouveau panier dans le localStorage
      localStorage.setItem("panier", JSON.stringify(panierClean));
      console.log(localStorage.getItem("panier"));

      //On fait apparaître un message indiquant l'ajout au panier avec le nom du produit
      const $articleName = document.getElementById('title').innerText;
      console.log($articleName);
      alert(`Votre ${$articleName} a été ajouté au panier !`)
    }
  }
  //Si on a trouvé l'article, on met à jour la quantité
  else {
    console.log("trouvé!");
    //Si il n'y a pas de quantité ou pas de couleur, on ne traite pas l'ajout au panier
    if (articleSelected.color === "" || articleSelected.quantity === "0") {
      alert("Veuillez sélectionner une couleur et une quantité");
    } else {
      //On met à jour la quantité
      articleSelected.quantity = (
        parseInt(articleSelected.quantity, 10) +
        parseInt(recherche.quantity, 10)
      ).toString();
      //En fusionnant, on remplace l'ancienne quantité de l'article par la nouvelle
      Object.assign(recherche, articleSelected);
      console.log(panierClean);

      //On supprime l'ancien panier au niveau du LocalStorage
      localStorage.removeItem("panier");

      //On envoie le nouveau panier dans le localStorage
      localStorage.setItem("panier", JSON.stringify(panierClean));
      console.log(localStorage.getItem("panier"));

      //On fait apparaître un message indiquant l'ajout au panier avec le nom du produit
      const $articleName = document.getElementById('title').innerText;
      console.log($articleName);
      alert(`Votre ${$articleName} a été ajouté au panier !`)
    }
  }
});

//localStorage.clear();
