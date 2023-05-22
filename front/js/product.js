// Récupération de l'id en Param et création des constantes pour chaque élément de l'article
const urlParams = new URLSearchParams(document.location.search);
const kanapId = urlParams.get("id");
const produitUrl = `http://localhost:3000/api/products/${kanapId}`;
const imgKanap = document.querySelector(".item__img");
const imgTxtAlt = document.querySelector(".item__img");
const nomKanap = document.getElementById("title");
const prixKanap = document.getElementById("price");
const descKanap = document.getElementById("description");
const colorOptions = document.getElementById("colors");
const qteProduit = document.getElementById("quantity");

// Fonction d'affichage des produits
fetch(produitUrl)
  .then((res) => res.json())
  .then((produit) => {
    const imgKanape = produit.imageUrl;
    const imgTxtA = produit.altTxt;
    const nameKanap = produit.name;
    const priceKanap = produit.price;
    const descrKanap = produit.description;
    const colorsKanap = produit.colors;
    const baliseImg = document.createElement('img');
    baliseImg.src = imgKanape;
    baliseImg.alt = imgTxtA;
    imgKanap.appendChild(baliseImg);
    // imgTxtAlt.innerHTML = `<img src="${imgKanape}" alt="${imgTxtA}">`;
    nomKanap.textContent = nameKanap;
    prixKanap.textContent = priceKanap;
    descKanap.textContent = descrKanap;
    for (let couleur of colorsKanap) {
      const option = document.createElement('option');
      option.textContent = couleur;
      option.value = couleur;
      colorOptions.appendChild(option);
      // colorOptions.innerHTML += `<option value="${couleur}">${couleur}</option>`;
    }
    // Ajout au panier des articles au clic
    const ajoutPanier = document.getElementById("addToCart");
    ajoutPanier.addEventListener("click", () => {
      let panier = {
        id: kanapId,
        name: nameKanap,
        colors: colorOptions.value,
        quantity: qteProduit.value,
      };
      // Récupération du panier dans le LS
      function recupePanier() {
        let panier = JSON.parse(localStorage.getItem("kanapLs"));
        if (panier === null) {
          return []; //si le LocalStorage est vide, on crée un tableau vide
        } else {
          return panier;
        }
      }
      
      // Fonction d'ajout d'un produit au panier
      /**
       * Description
       * @param {any} produit
       * @returns {any}
       */
      function ajoutPanier(produit) {
        let panier = recupePanier();
        console.log(panier);
        const produitIndex = panier.findIndex(
          (p) => p.id === produit.id && p.colors === produit.colors
        );
        if (produitIndex !== -1) {
          panier[produitIndex].quantity =
            parseInt(panier[produitIndex].quantity) +
            parseInt(produit.quantity);
        } else {
          produit.quantity = qteProduit.value;
          panier.push(produit);
        }
        sauvPanier(panier);
        alert(
          `Le canapé ${nameKanap} ${colorOptions.value} a été ajouté en ${qteProduit.value} exemplaires à votre panier !`
        );
      }
     
      if (
        colorOptions.value === "" ||
        qteProduit.value <= 0 ||
        qteProduit.value > 100
      ) {
        alert(
          "Veuillez sélectionner une couleur et une quantité valide, merci"
        );
      } else if (colorOptions.value === "") {
        alert("Veuillez sélectionner une couleur, merci");
      } else if (qteProduit.value <= 0 || qteProduit.value > 100) {
        alert(
          "Veuillez sélectionner une quantité supérieure à zéro et inférieure à 100, merci"
        );
      } else {
        ajoutPanier(panier);
      }
    });
  })
  .catch(function (err) {
    console.log(err);
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Erreur lors de la récupération des données";
    listeKanap.appendChild(errorMessage);
  });