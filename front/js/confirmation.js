//On récupère l'URL de la page produit
var str = window.location.href;

//On stocke cette URL dans un objet URL
var url = new URL(str);

//On récupère la valeur de l'orderId contenu dans l'URL
var orderId = url.searchParams.get("orderId");
console.log("orderID = " + orderId);

//On vise l'identifiant "orderId" et on y ajoute le numéro de commande
document.getElementById('orderId').innerText = orderId;