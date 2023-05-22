class Panier {
    constructor() {
        this.panier = JSON.parse(localStorage.getItem("kanapLs")) || [];
    }
    async fetchApiData() {
        const tableauPanier = [];
        for (let i = 0; i < this.panier.length; i++) {
            try {
                const response = await fetch(`http://localhost:3000/api/products/${this.panier[i].id}`);
                const kanap = await response.json();
                const produit = {
                    _id: kanap._id,
                    nom: kanap.name,
                    prix: kanap.price,
                    couleur: this.panier[i].colors,
                    quantite: this.panier[i].quantity,
                    alt: kanap.altTxt,
                    img: kanap.imageUrl,
                };
                tableauPanier.push(produit);
            } catch (error) {
                console.log(error);
                const errorMessage = document.createElement("p");
                errorMessage.textContent = "Erreur lors de la récupération des données";
                listeKanap.appendChild(errorMessage);
            }
        }
        return tableauPanier;
    }

    async afficherPanier() {
        const produits = await this.fetchApiData();
        if (produits.length !== 0) {
            const placePanier = document.getElementById("cart__items");
            produits.forEach((produit) => {
                const baliseArticle = document.createElement("article");
                baliseArticle.classList.add("cart__item");
                baliseArticle.dataset.id = `${produit._id}`;
                baliseArticle.dataset.color = `${produit.couleur}`;
                const baliseDivImg = document.createElement("div");
                baliseDivImg.classList.add("cart__item__img");
                const baliseImg = document.createElement("img");
                baliseImg.src = produit.img;
                baliseImg.alt = produit.altTxt;
                const baliseDivContent = document.createElement("div");
                baliseDivContent.classList.add("cart__item__content");
                const baliseDivContentDesc = document.createElement("div");
                baliseDivContentDesc.classList.add("cart__item__content__description");
                const baliseTitre = document.createElement("h2");
                baliseTitre.textContent = `${produit.nom}`;
                const baliseCoul = document.createElement("p");
                baliseCoul.textContent = `${produit.couleur}`;
                const balisePrix = document.createElement("p");
                balisePrix.textContent = `${produit.prix} €`;
                const baliseDivContentSet = document.createElement("div");
                baliseDivContentSet.classList.add('cart__item__content__settings');
                const baliseDivContentQte = document.createElement("div");
                baliseDivContentQte.classList.add('cart__item__content__settings__quantity');
                const baliseQte = document.createElement("p");
                baliseQte.textContent = "Qté : ";
                const baliseInput = document.createElement("input");
                baliseInput.setAttribute("type", "number");
                baliseInput.classList.add('itemQuantity');
                baliseInput.setAttribute("name", "itemQuantity");
                baliseInput.setAttribute("min", "1");
                baliseInput.setAttribute("max", "100");
                baliseInput.setAttribute("value", produit.quantite);
                baliseInput.value = `${produit.quantite}`;
                const baliseDivDel = document.createElement("div");
                baliseDivDel.classList.add("cart__item__content__settings__delete");
                const baliseParaDel = document.createElement("p");
                baliseParaDel.classList.add("deleteItem");
                baliseParaDel.textContent = "Supprimer";
                placePanier.appendChild(baliseArticle);
                baliseArticle.appendChild(baliseDivImg);
                baliseDivImg.appendChild(baliseImg);
                baliseArticle.appendChild(baliseDivContent);
                baliseDivContent.appendChild(baliseDivContentDesc);
                baliseDivContentDesc.appendChild(baliseTitre);
                baliseDivContentDesc.appendChild(baliseCoul);
                baliseDivContentDesc.appendChild(balisePrix);
                baliseDivContent.appendChild(baliseDivContentSet);
                baliseDivContentSet.appendChild(baliseDivContentQte);
                baliseDivContentQte.appendChild(baliseQte);
                baliseDivContentQte.appendChild(baliseInput);
                baliseDivContentSet.appendChild(baliseDivDel);
                baliseDivDel.appendChild(baliseParaDel);
            });
        }
    }

    modifierQuantite(id, couleur, nouvelleQuantite) {
        for (let i in this.panier) {
            if (this.panier[i].id === id && this.panier[i].colors === couleur) {
                this.panier[i].quantity = nouvelleQuantite;
                this.sauvegarderPanier();
                break;
            }
        }
        this.afficherTotaux();
    }

    supprimerProduit(id, couleur) {
        this.panier = this.panier.filter((produit) => produit.id !== id || produit.colors !== couleur);
        this.sauvegarderPanier();
        this.afficherTotaux();
        const baliseArticle = document.querySelector(`.cart__item[data-id="${id}"][data-color="${couleur}"]`);
        if (baliseArticle) {
            baliseArticle.remove();
        }
    }

    sauvegarderPanier() {
        localStorage.setItem("kanapLs", JSON.stringify(this.panier));
    }

    async afficherTotaux() {
        const totalPanier = await this.fetchApiData();
        let totalArticles = 0;
        let totalPrix = 0;
        if (totalPanier.length !== 0) {
            totalPanier.forEach((produit) => {
                const quantite = parseInt(produit.quantite);
                const prix = produit.prix;
                totalArticles += quantite;
                totalPrix += quantite * prix;
            });
        }
        const placeTotalPrix = document.getElementById("totalPrice");
        placeTotalPrix.textContent = totalPrix;
        const placeTotalArticles = document.getElementById("totalQuantity");
        placeTotalArticles.textContent = totalArticles.toString();
    }
}