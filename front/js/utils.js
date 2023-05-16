// Fonction de sauvegarde du panier dans le LS
function sauvPanier(panier) {
    localStorage.setItem("kanapLs", JSON.stringify(panier));
}
// Fonction de récupération du panier dans le LS
function recupPanier() {
    return JSON.parse(localStorage.getItem("kanapLs"));
}