// Atualizar data do cabaz
document.getElementById('today-date').textContent = new Date().toLocaleDateString('pt-PT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
});

// Botão de pedido do cabaz
document.querySelector('.order-basket-btn').addEventListener('click', () => {
    // Adicionar itens ao carrinho automaticamente
    addDailyBasketToCart();
});

function addDailyBasketToCart() {
    const dailyBasketItems = [
        { name: 'Mirtilos', quantity: '250g', price: 3.50 },
        { name: 'Maçãs', quantity: '6 unidades', price: 2.00 },
        { name: 'Pêras', quantity: '4 unidades', price: 2.50 },
        { name: 'Mel', quantity: '1 frasco', price: 4.50 }
    ];
    
    // Adicionar ao carrinho no Firebase/localStorage
    updateCart(dailyBasketItems);
    
    // Redirecionar para checkout
    window.location.href = '#checkout';
}