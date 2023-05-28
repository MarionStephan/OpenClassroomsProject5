// Création d'une instance de la classe Panier pour gérer les opérations sur le panier
const panier = new Panier();


// Fonction pour afficher le contenu du panier
panier.afficherPanier();


// Écouteur d'événement pour détecter les changements de quantité dans le panier et appeler la méthode modifierQuantite du panier
document.addEventListener("change", (event) => {
  if (event.target.classList.contains("itemQuantity")) {
    const id = event.target.closest(".cart__item").dataset.id;
    const couleur = event.target.closest(".cart__item").dataset.color;
    const nouvelleQuantite = event.target.value;
    panier.modifierQuantite(id, couleur, nouvelleQuantite);
  }
});


// Écouteur d'événement pour détecter les clics sur le bouton de suppression d'un produit du panier et appeler la méthode supprimerProduit du panier
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("deleteItem")) {
    const id = event.target.closest(".cart__item").dataset.id;
    const couleur = event.target.closest(".cart__item").dataset.color;
    panier.supprimerProduit(id, couleur);
  }
});


// Fonction asynchrone pour afficher les totaux du panier (nombre d'articles et prix total)
panier.afficherTotaux();


const commandeBtn = document.getElementById("order");
commandeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  validate();
});


// Fonction de validation des input
function validateInput(champ, valeur, regex, messageErreur) {
  const alerte = document.getElementById(`${champ}ErrorMsg`);
  const resultat = regex.test(valeur);
  if (!resultat || valeur === "") {
    alerte.innerHTML = messageErreur;
    alerte.style.display = "block";
    return false;
  } else {
    alerte.innerHTML = "";
    alerte.style.display = "none";
    return true;
  }
}


// Fonction de test de chaque input
function validateContact() {
  const email = document.getElementById("email").value;
  const adresse = document.getElementById("address").value;
  const nom = document.getElementById("lastName").value;
  const prenom = document.getElementById("firstName").value;
  const ville = document.getElementById("city").value;

  const regexMail =
    /^[_A-z0-9-]+(\.[_A-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
  const regexNom = /^(?:(?:[A-Za-zÀ-ÖØ-öø-ÿ-]+(?:\s+|$)){1,})$/;
  const regexPrenom = regexNom;
  const regexVille = regexNom;
  const regexAdresse = /^[#.0-9a-zA-ZÀ-ÿ\s,-]{2,}$/;

  const prenomResult = validateInput(
    "firstName",
    prenom,
    regexPrenom,
    "Prénom invalide"
  );
  const nomResult = validateInput("lastName", nom, regexNom, "Nom invalide");
  const adresseResult = validateInput(
    "address",
    adresse,
    regexAdresse,
    "Adresse invalide"
  );
  const villeResult = validateInput(
    "city",
    ville,
    regexVille,
    "Ville invalide"
  );
  const emailResult = validateInput("email", email, regexMail, "Mail invalide");
  return (
    prenomResult && nomResult && adresseResult && villeResult && emailResult
  );
}


// Fonction de récupération des infos contact pour l'objet de commande
function getContactInfo() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const email = document.getElementById("email").value.trim();
  return { firstName, lastName, address, city, email };
}


// Fonction de récupération des articles du panier
function getProductsFromCart() {
  const cart = recupPanier();
  if (!cart || cart.length === 0) {
    // Gérer le cas où le panier est vide ou non initialisé
    return [];
  }
  return cart.map((item) => item.id);
}


// Fonction de validation du panier s'il n'est pas vide
function validateProducts(products) {
  if (products.length === 0) {
    alert("Le panier est vide");
    return false;
  } else {
    return true;
  }
}


//<Fonction de validation de la commande avec ajouts du tableau de produits et de l'objet de contact et validation des éléments>
async function validate() {
  const contact = getContactInfo();
  const products = getProductsFromCart();

  if (validateContact(contact) && validateProducts(products)) {
    const order = { contact, products };
    const response = await fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(order),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { orderId } = await response.json();
    window.location.href = `confirmation.html?orderId=${orderId}`;
  }
}
