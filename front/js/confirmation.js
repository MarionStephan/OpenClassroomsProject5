let url = new URL(location.href);
let commandeFinId = url.searchParams.get("orderId");
zoneNumId = document.getElementById("orderId");
zoneNumId.innerHTML = `${commandeFinId}`;
localStorage.clear();