class Panier {
    // Le constructeur initialise le panier à partir des données stockées dans le localStorage, ou un tableau vide si aucune donnée n'est présente.
    constructor() {
        this.panier = JSON.parse(localStorage.getItem("kanapLs")) || [];
    }

    // Cette méthode effectue une requête API pour récupérer les informations détaillées des produits présents dans le panier.
    // Elle renvoie un tableau contenant les produits avec leurs informations complètes.
    async fetchApiData() {
        const tableauPanier = [];
        let erreurAffichee = false; // Variable pour vérifier si une erreur a été affichée
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
                console.error(error);
                if (!erreurAffichee) {
                    window.alert("Erreur lors de la récupération des données");
                    erreurAffichee = true; // Marquer qu'une erreur a été affichée pour éviter les répétitions
                }
            }
        }
        return tableauPanier;
    }


    // Cette méthode affiche les produits présents dans le panier sur la page du panier.
    // Elle récupère les informations détaillées des produits à l'aide de la méthode fetchApiData(), puis génère les éléments HTML correspondants pour chaque produit.
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

    // Cette méthode modifie la quantité d'un produit dans le panier.
    // Elle recherche le produit correspondant dans le panier, met à jour la quantité et sauvegarde les modifications dans le localStorage.
    // Elle met également à jour les totaux affichés sur la page du panier.

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


    // Cette méthode supprime un produit du panier.
    // Elle filtre le panier pour retirer le produit correspondant en fonction de son identifiant (id) et de sa couleur.
    // Elle sauvegarde ensuite les modifications dans le localStorage et met à jour les totaux affichés sur la page du panier.
    supprimerProduit(id, couleur) {
        this.panier = this.panier.filter((produit) => produit.id !== id || produit.colors !== couleur);
        this.sauvegarderPanier();
        this.afficherTotaux();
        const baliseArticle = document.querySelector(`.cart__item[data-id="${id}"][data-color="${couleur}"]`);
        if (baliseArticle) {
            baliseArticle.remove();
        }
    }


    // Cette méthode sauvegarde le panier actuel dans le localStorage.   
    sauvegarderPanier() {
        localStorage.setItem("kanapLs", JSON.stringify(this.panier));
    }


    // Cette méthode calcule les totaux (nombre total d'articles et prix total) à partir des produits présents dans le panier.
    // Elle met à jour les éléments HTML correspondants affichant les totaux sur la page du panier.
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


    // Cette méthode ajoute un produit au panier.
    // Elle recherche si le produit existe déjà dans le panier en se basant sur son identifiant (id) et sa couleur.
    // Si le produit est déjà présent, elle met à jour la quantité. Sinon, elle ajoute le produit au panier.
    // Elle sauvegarde ensuite les modifications dans le localStorage et met à jour les totaux affichés sur la page du panier.

    ajouterProduit(produit) {
        const produitIndex = this.panier.findIndex(
            (p) => p.id === produit.id && p.colors === produit.colors
        );
        if (produitIndex !== -1) {
            this.panier[produitIndex].quantity =
                parseInt(this.panier[produitIndex].quantity) +
                parseInt(produit.quantity);
        } else {
            produit.quantity = produit.quantity;
            this.panier.push(produit);
        }
        this.sauvegarderPanier();
        this.afficherTotaux();
    }


    // Cette méthode récupère le panier depuis le localStorage.
    // Elle renvoie le panier sous forme d'un tableau d'objets.
    recupPanier() {
        return JSON.parse(localStorage.getItem("kanapLs"));
    }
}