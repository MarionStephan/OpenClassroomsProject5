const listeKanap = document.getElementById("items");
const apiUrl = "http://localhost:3000/api/products/";

// Fonction de récupération de l'API
async function fetchData() {
	const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Impossible de récupérer les données");
  }
  return response.json();
}
// Fonction d'affichage des articles
async function displayArticles() {
	try{
		let articles = await fetchData();
	for (let catalogue of articles) {
    const idKanap = catalogue._id;
    const photoKanap = catalogue.imageUrl;
    const altTexte = catalogue.altTxt;
    const nomKanap = catalogue.name;
    const desKanap = catalogue.description;
	const baliseA = document.createElement('a');
	baliseA.href = `./product.html?id=${idKanap}`;
	const baliseArticle = document.createElement('article');
	const baliseImage = document.createElement('img');
	baliseImage.src = photoKanap;
	baliseImage.alt = altTexte;
	const baliseTitre = document.createElement('h3');
	baliseTitre.textContent = nomKanap;
	baliseTitre.classList.add('productName');
	const balisePara = document.createElement('p');
	balisePara.classList.add('productDescription');
	balisePara.textContent = desKanap;
	baliseA.appendChild(baliseArticle);
	baliseArticle.appendChild(baliseImage);
	baliseArticle.appendChild(baliseTitre);
	baliseArticle.appendChild(balisePara);
	listeKanap.appendChild(baliseA);
	}	
}catch (error) {
    console.error(error);
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Erreur lors de la récupération des données";
    listeKanap.appendChild(errorMessage);
  }
}

displayArticles();