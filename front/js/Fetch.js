class API {
    static async fetchProduct(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`);
            const product = await response.json();
            return product;
        } catch (error) {
            console.log(error);
            throw new Error("Erreur lors de la récupération des données");
        }
    }
}