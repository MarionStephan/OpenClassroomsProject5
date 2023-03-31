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
fetch(produitUrl)
  .then((res) => res.json())
  .then((produit) => {
    const imgKanape = produit.imageUrl;
    const imgTxtA = produit.altTxt;
    const nameKanap = produit.name;
    const priceKanap = produit.price;
    const descrKanap = produit.description;
    const colorsKanap = produit.colors;
    imgTxtAlt.innerHTML = `<img src="${imgKanape}" alt="${imgTxtA}">`;
    nomKanap.innerHTML = `${nameKanap}`;
    prixKanap.innerHTML = `${priceKanap}`;
    descKanap.innerHTML = `${descrKanap}`;
    for (let couleur of colorsKanap) {
      colorOptions.innerHTML += `<option value="${couleur}">${couleur}</option>`;
    }
    const ajoutPanier = document.getElementById("addToCart");
    ajoutPanier.addEventListener("click", () => {
      let panier = {
        id: kanapId,
        name: nameKanap,
        colors: colorOptions.value,
        quantity: qteProduit.value,
        prix: priceKanap,
      };
      function recupPanier() {
        let panier = JSON.parse(localStorage.getItem("kanapLs"));
        if (panier === null) {
          return []; //si le LocalStorage est vide, on crée un tableau vide
        } else {
          return panier;
        }
      }
      function ajoutPanier(produit) {
        let panier = recupPanier();
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
      function sauvPanier(panier) {
        localStorage.setItem("kanapLs", JSON.stringify(panier));
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
  });