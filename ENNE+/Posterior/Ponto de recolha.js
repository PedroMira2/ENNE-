// Inicializar mapa (usando Leaflet.js ou Google Maps API)
function initMap() {
    const map = L.map('map').setView([40.64427, -8.64554], 13); // Coordenadas de Aveiro
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Adicionar marcadores
    const points = [
        { name: 'Café Central', latlng: [40.6412, -8.6535] },
        { name: 'Escola Primária', latlng: [40.6389, -8.6302] }
    ];
    
    points.forEach(point => {
        L.marker(point.latlng).addTo(map)
            .bindPopup(point.name);
    });
}

// Chamar initMap quando a página carregar
window.addEventListener('DOMContentLoaded', initMap);