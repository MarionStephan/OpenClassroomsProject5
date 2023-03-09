const urlParams = new URLSearchParams(document.location.search);
const kanapId = urlParams.get("id");
const produitUrl = `http://localhost:3000/api/products/${kanapId}`;

async function getProduit() {
  return fetch(produitUrl)
    .then((res) => res.json())
    .catch((err) => console.log(err));
}

async function displayProduit() {
  let produit = await getProduit();
  console.log(produit);
  document.querySelector(
    ".item__img"
  ).innerHTML = `<img src="${produit.imageUrl}" alt="${produit.altTxt}">`;
  document.getElementById("title").innerHTML = `${produit.name}`;
  document.getElementById("price").innerHTML = `${produit.price}`;
  document.getElementById("description").innerHTML = `${produit.description}`;
  for (let couleur of produit.colors) {
    document.getElementById(
      "colors"
    ).innerHTML += `<option value="${couleur}">${couleur}</option>`;
  }
}
displayProduit();
