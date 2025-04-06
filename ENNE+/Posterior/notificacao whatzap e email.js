// Função para enviar notificação de pedido
function sendOrderNotification(orderDetails) {
    const phoneNumber = '351123456789'; // Número do administrador
    const message = `Novo pedido AveiroHub:
    
    Cliente: ${orderDetails.customerName}
    Itens: ${orderDetails.items.join(', ')}
    Total: €${orderDetails.total}
    ${orderDetails.deliveryType === 'delivery' ? 
        `Entrega: ${orderDetails.address}` : 
        `Recolha: ${orderDetails.pickupLocation}`}
    `;
    
    // Enviar por WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
    
    // Opcional: enviar por email usando FormSubmit ou EmailJS
    sendEmailNotification(orderDetails);
}

function sendEmailNotification(orderDetails) {
    // Implementação usando EmailJS ou FormSubmit
    emailjs.send('service_id', 'template_id', {
        to_email: 'admin@aveirohub.com',
        subject: 'Novo Pedido - AveiroHub',
        message: `Detalhes do pedido: ${JSON.stringify(orderDetails)}`
    });
}