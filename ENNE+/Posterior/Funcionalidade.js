// Filtro de produtos
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.textContent;
        filterProducts(category);
    });
});

function filterProducts(category) {
    // Lógica para filtrar produtos
}

// Formulário de cadastro
document.getElementById('producer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        location: document.getElementById('location').value,
        products: document.getElementById('products').value,
        contact: document.getElementById('contact').value
    };
    
    try {
        // Enviar para Firebase/Supabase
        const response = await fetch('your-backend-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Cadastro enviado com sucesso! Entraremos em contato em breve.');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
});

// Finalização de pedido
document.getElementById('finalize-order').addEventListener('click', () => {
    const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
    const orderDetails = {}; // Obter detalhes do carrinho
    
    if (deliveryType === 'delivery') {
        orderDetails.address = document.getElementById('address').value;
    } else {
        orderDetails.pickupLocation = document.querySelector('.map-container').getAttribute('data-location');
    }
    
    // Enviar pedido por WhatsApp/Email
    sendOrderNotification(orderDetails);
});

function sendOrderNotification(orderDetails) {
    // Lógica para enviar notificação
}