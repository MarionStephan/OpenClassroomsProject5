// Récupération de l'id en paramètre
const urlParams = new URLSearchParams(document.location.search);
const kanapId = urlParams.get("id");


// Création d'une instance de la classe Panier
const panier = new Panier();


// Récupération des éléments HTML
const imgKanap = document.querySelector(".item__img");
const nomKanap = document.getElementById("title");
const prixKanap = document.getElementById("price");
const descKanap = document.getElementById("description");
const colorOptions = document.getElementById("colors");
const qteProduit = document.getElementById("quantity");
const ajoutPanier = document.getElementById("addToCart");

// Fonction d'affichage des produits
fetch(`http://localhost:3000/api/products/${kanapId}`)
  .then((res) => res.json())
  .then((produit) => {
    const imgKanape = produit.imageUrl;
    const imgTxtA = produit.altTxt;
    const nameKanap = produit.name;
    const priceKanap = produit.price;
    const descrKanap = produit.description;
    const colorsKanap = produit.colors;

    // Affichage des éléments du produit
    const baliseImg = document.createElement("img");
    baliseImg.src = imgKanape;
    baliseImg.alt = imgTxtA;
    imgKanap.appendChild(baliseImg);
    nomKanap.textContent = nameKanap;
    prixKanap.textContent = priceKanap;
    descKanap.textContent = descrKanap;

    for (let couleur of colorsKanap) {
      const option = document.createElement("option");
      option.textContent = couleur;
      option.value = couleur;
      colorOptions.appendChild(option);
    }

    // Ajout au panier des articles au clic
    ajoutPanier.addEventListener("click", () => {
      if (
        colorOptions.value === "" ||
        qteProduit.value <= 0 ||
        qteProduit.value > 100
      ) {
        alert(
          "Veuillez sélectionner une couleur et une quantité valide, merci"
        );
      } else {
        const produit = {
          id: kanapId,
          name: nameKanap,
          colors: colorOptions.value,
          quantity: qteProduit.value,
        };
        panier.ajouterProduit(produit);
        alert(
          `Le canapé ${nameKanap} ${colorOptions.value} a été ajouté en ${qteProduit.value} exemplaires à votre panier !`
        );
      }
    });
  })
  .catch(function (err) {
    console.error(err);
    window.alert("Erreur lors de la récupération des données");
  });
