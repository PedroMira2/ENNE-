
// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mainNav = document.getElementById('main-nav');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('#main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Set today's date in daily basket
const todayDate = new Date();
document.getElementById('today-date').textContent = todayDate.toLocaleDateString('pt-PT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
});

// Initialize map
function initMap() {
    const map = L.map('map').setView([40.64427, -8.64554], 12); // Aveiro coordinates
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add pickup points markers
    const pickupPoints = [
        {
            name: 'Café Central',
            latlng: [40.6412, -8.6535],
            address: 'Rua do Comércio, 123 - Aveiro'
        },
        {
            name: 'Mercado Municipal',
            latlng: [40.6408, -8.6533],
            address: 'Praça do Peixe - Aveiro'
        },
        {
            name: 'Escola Primária',
            latlng: [40.6365, -8.6672],
            address: 'Avenida da Liberdade, 45 - Ílhavo'
        },
        {
            name: 'Parque de Estacionamento',
            latlng: [40.6189, -8.7513],
            address: 'Rua dos Pescadores - Costa Nova'
        }
    ];
    
    pickupPoints.forEach(point => {
        L.marker(point.latlng).addTo(map)
            .bindPopup(`<b>${point.name}</b><br>${point.address}`);
    });
}

// Initialize map when page loads
window.addEventListener('DOMContentLoaded', initMap);

// Modal functionality
const modals = {
    login: document.getElementById('login-modal'),
    cart: document.getElementById('cart-modal'),
    quickView: document.getElementById('quick-view-modal'),
    search: document.getElementById('search-modal')
};

const modalTriggers = {
    login: document.getElementById('login-btn'),
    cart: document.getElementById('cart-btn'),
    search: document.getElementById('search-btn')
};

// Open modals
Object.entries(modalTriggers).forEach(([key, trigger]) => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modals[key].classList.add('active');
    });
});

// Close modals
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Quick view functionality
document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        modals.quickView.classList.add('active');
    });
});

// Product filter functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        
        const category = btn.dataset.category;
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            card.style.display = (category === 'all' || card.dataset.category === category) 
                ? 'block' 
                : 'none';
        });
    });
});

// Testimonials slider
$(document).ready(function(){
    $('.testimonials-slider').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false
    });
});

// Quantity selector
document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const input = e.target.parentElement.querySelector('.quantity-input');
        let value = parseInt(input.value);
        
        if (e.target.textContent === '+' && value < 10) {
            input.value = value + 1;
        } else if (e.target.textContent === '-' && value > 1) {
            input.value = value - 1;
        }
    });
});


// Cart functionality
let cartItems = [];
let cartTotal = 0;

document.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (!e.target.classList.contains('quick-view-btn')) {
            e.preventDefault();
            const productCard = btn.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').textContent.match(/[\d,]+/)[0].replace(',', '.'));
            
            // Add to cart
            cartItems.push({
                name: productName,
                price: productPrice
            });
            
            // Update cart UI
            updateCartDisplay();
        }
    });
});

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const cartTotalElement = document.querySelector('.cart-total span:last-child');
    
    // Update count
    cartCount.textContent = cartItems.length;
    
    // Calculate total
    cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    cartTotalElement.textContent = `€${cartTotal.toFixed(2)}`;
    
    // Update cart items list
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">€${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-remove" onclick="removeCartItem(${index})">
                <i class="fas fa-times"></i>
            </div>
        </div>
    `).join('');
}

window.removeCartItem = function(index) {
    cartItems.splice(index, 1);
    updateCartDisplay();
};

// Daily basket order
document.querySelector('.daily-basket .btn-primary').addEventListener('click', () => {
    cartItems.push({
        name: 'Cabaz do Dia',
        price: 12.50
    });
    updateCartDisplay();
    alert('Cabaz do dia adicionado ao seu carrinho!');
});

window.onload = function() {
    // Get query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const loginStatus = urlParams.get('login');
    console.log("It loaded");

    // Create the modal element
    const modal = createModal();

    // Show error message if 'login=error' is found in the URL
    if (loginStatus === 'error') {
        const errorMessageDiv = createMessage('Incorrect login info. Please try again.', 'error');
        modal.appendChild(errorMessageDiv);
        modal.style.display = 'block'; // Show the modal
    }

    // Show success message if 'login=success' is found in the URL
    if (loginStatus === 'success') {
        const successMessageDiv = createMessage('Login successful!', 'success');
        modal.appendChild(successMessageDiv);
        modal.style.display = 'block'; // Show the modal
    }

    // Append the modal to the body
    document.body.appendChild(modal);
};

function createModal() {
    const modal = document.createElement('div');
    modal.classList.add('fixed-center-container');

    
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-btn'); 
    closeButton.innerHTML = 'Close';

    closeButton.onclick = function() {
        modal.style.display = 'none'; 
    };

    modal.appendChild(closeButton);
    return modal;
}

// Function to create message content
function createMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message-container'); 
    

    if (type === 'error') {
        messageDiv.classList.add('error-message'); 
    } else if (type === 'success') {
        messageDiv.classList.add('success-message'); 
    }

    messageDiv.innerHTML = message;
    return messageDiv;
}


window.addEventListener('load', () => {
    createParticles();

    // Esconder o ecrã de loading após 3 segundos
    setTimeout(() => {
        const loading = document.getElementById('loading-screen');
        loading.style.opacity = '0';
        loading.style.transition = 'opacity 0.5s ease';
        setTimeout(() => loading.remove(), 500); // remove do DOM
    }, 1500);
});