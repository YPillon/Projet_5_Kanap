let str = window.location.href;
let url = new URL(str);
let orderId = url.searchParams.get("orderId");
console.log("orderID = " + orderId);

document.getElementById("orderId").innerText = orderId;
