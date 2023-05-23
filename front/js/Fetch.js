class ApiFetcher {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async fetchData(url) {
        try {
            const response = await fetch(`${this.baseUrl}/${url}`);
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données de l'API.");
            }
            return await response.json();
        } catch (error) {
            console.log(error);
            throw new Error("Erreur lors de la récupération des données de l'API.");
        }
    }

    async fetchProductData(productId) {
        return await this.fetchData(`products/${productId}`);
    }
}
