// Récupération de l'identifiant de la commande à partir des paramètres de l'URL
let url = new URL(location.href);
let commandeFinId = url.searchParams.get("orderId");


// Sélection de l'élément HTML où afficher l'identifiant de la commande
zoneNumId = document.getElementById("orderId");


// Affichage de l'identifiant de la commande dans l'élément HTML sélectionné
zoneNumId.innerHTML = `${commandeFinId}`;


// Suppression de toutes les données stockées dans le localStorage
localStorage.clear();