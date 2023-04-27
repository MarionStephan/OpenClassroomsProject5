const panier = JSON.parse(localStorage.getItem("kanapLs"));

// Fonction de récupération de l'API
async function fetchApi() {
  let tableauPanier = [];
  if (panier !== null) {
    for (let i = 0; i < panier.length; i++) {
      await fetch("http://localhost:3000/api/products/" + panier[i].id)
        .then((res) => res.json())
        .then((kanap) => {
          const produit = {
            _id: kanap._id,
            nom: kanap.name,
            prix: kanap.price,
            couleur: panier[i].colors,
            quantite: panier[i].quantity,
            alt: kanap.altTxt,
            img: kanap.imageUrl,
          };
          tableauPanier.push(produit);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }
  return tableauPanier;
}

// Fonction d'affichage du panier)
async function affichagePanier() {
  const produits = await fetchApi();
  if (panier !== null && panier.length !== 0) {
    const placePanier = document.getElementById("cart__items");
    produits.forEach((produit) => {
      placePanier.insertAdjacentHTML(
        "beforeend",
        `<article class="cart__item" data-id="${produit._id}" data-color="${produit.couleur}">
        <div class="cart__item__img">
          <img src="${produit.img}" alt="${produit.altTxt}">
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${produit.nom}</h2>
            <p>${produit.couleur}</p>
            <p>${produit.prix} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produit.quantite}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`
      );
    });
  }
}
// Fonction de récupération du panier dans le LS
function recupPanier() {
  return JSON.parse(localStorage.getItem("kanapLs"));
}
// Fonction d'enregistrement du panier dans le LS'
function sauvPanier(panier) {
  localStorage.setItem("kanapLs", JSON.stringify(panier));
}
// Fonction de modification de la quantité d'un article dans le panier au clic
function modifQte(id, color, nouvQte) {
  const panier = recupPanier();
  for (let i in panier) {
    if (panier[i].id === id && panier[i].colors === color) {
      panier[i].quantity = nouvQte;
      sauvPanier(panier);
    }
  }
}
document.addEventListener("change", (event) => {
  if (event.target.classList.contains("itemQuantity")) {
    const id = event.target.closest(".cart__item").dataset.id;
    const color = event.target.closest(".cart__item").dataset.color;
    const nouvQte = event.target.value;
    modifQte(id, color, nouvQte);
    location.reload(); // recharge la page pour mettre à jour l'affichage du panier
  }
});
// Fonction de suppression d'un article au clic
function supprimerProduit(id, color) {
  let panier = recupPanier();
  panier = panier.filter(
    (produit) => produit.id !== id || produit.colors !== color
  );
  sauvPanier(panier);
  location.reload();
}
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("deleteItem")) {
    const id = event.target.closest(".cart__item").dataset.id;
    const couleur = event.target.closest(".cart__item").dataset.color;
    supprimerProduit(id, couleur);
  }
});
// Fonction d'affichage des totaux
function afficherTotaux() {
  const produits = recupPanier();
  let totalArticles = 0;
  let totalPrix = 0;
  if (!Array.isArray(produits)) {
    // Le panier est vide, on affiche 0 pour les totaux
    totalArticles = 0;
    totalPrix = 0;
  } else {
    produits.forEach((produit) => {
      const quantite = parseInt(produit.quantity);
      const prix = parseFloat(produit.prix);
      totalArticles += quantite;
      totalPrix += quantite * prix;
    });
  }
  const placeTotalArticles = document.getElementById("totalQuantity");
  placeTotalArticles.innerHTML = totalArticles.toString();

  const placeTotalPrix = document.getElementById("totalPrice");
  placeTotalPrix.innerHTML = totalPrix;
}

affichagePanier();
afficherTotaux();

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
// Fonction de validation de la commande avec ajouts du tableau de produits et de l'objet de contact et validation des éléments
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