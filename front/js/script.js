const listeKanap = document.getElementById("items");
const apiUrl = "http://localhost:3000/api/products/";
async function fetchData() {
	return fetch(apiUrl)
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
}

async function displayArticles() {
	let articles = await fetchData();
	console.log(articles);
	for (let catalogue of articles) {
    const idKanap = catalogue._id;
    const photoKanap = catalogue.imageUrl;
    const altTexte = catalogue.altTxt;
    const nomKanap = catalogue.name;
    const desKanap = catalogue.description;
    listeKanap.innerHTML += `<a href="./product.html?id=${idKanap}">
	<article>
	<img src="${photoKanap}" alt="${altTexte}">
	<h3 class="productName">${nomKanap}</h3>
	<p class="productDescription">${desKanap}</p>
	</article>
	</a>`;
	}	
}
displayArticles();
