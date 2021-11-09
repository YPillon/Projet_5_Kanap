//On récupère le panier
const panierRaw = localStorage.getItem("panier");

//On convertit le panier en tableau javascript
const panierClean = JSON.parse(panierRaw);
console.log(panierClean);