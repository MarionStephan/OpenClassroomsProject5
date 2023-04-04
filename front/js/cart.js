const panier = JSON.parse(localStorage.getItem("kanapLs"));

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
function recupPanier() {
  return JSON.parse(localStorage.getItem("kanapLs"));
}
function sauvPanier(panier) {
  localStorage.setItem("kanapLs", JSON.stringify(panier));
}
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
function afficherTotaux() {
  const produits = recupPanier();
  let totalArticles = 0;
  let totalPrix = 0;

  produits.forEach((produit) => {
    const quantite = parseInt(produit.quantity);
    const prix = parseFloat(produit.prix);
    totalArticles += quantite;
    totalPrix += quantite * prix;
  });

  const placeTotalArticles = document.getElementById("totalQuantity");
  placeTotalArticles.innerHTML = totalArticles.toString();

  const placeTotalPrix = document.getElementById("totalPrice");
  placeTotalPrix.innerHTML = totalPrix;
}

affichagePanier();
afficherTotaux();
