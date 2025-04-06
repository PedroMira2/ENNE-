// Adicionar avaliação
function addReview(productId, rating, comment, userId) {
    return db.collection('reviews').add({
        productId,
        rating,
        comment,
        userId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Buscar avaliações de um produto
function getProductReviews(productId) {
    return db.collection('reviews')
             .where('productId', '==', productId)
             .get();
}

// Calcular média de avaliações
async function calculateAverageRating(productId) {
    const reviews = await getProductReviews(productId);
    let total = 0;
    let count = 0;
    
    reviews.forEach(doc => {
        total += doc.data().rating;
        count++;
    });
    
    return count > 0 ? total / count : 0;
}