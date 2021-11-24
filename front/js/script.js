import {getAllProducts, createArticle} from './modules/script.js';

//
//Fonction compilant la récupération des données, la création et l'insertion des articles
//dans la page
//
async function main() {
  const productData = await getAllProducts();
  console.log(productData);

  for (let article of productData) {
    createArticle(article);
  }
}

main();

