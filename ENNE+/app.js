// Firebase Configuration (substitua com suas credenciais)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "aveirohub.firebaseapp.com",
    projectId: "aveirohub",
    storageBucket: "aveirohub.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Authentication State Observer
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        console.log("User logged in:", user.email);
        updateUIForLoggedInUser(user);
    } else {
        // User is signed out
        console.log("User signed out");
        updateUIForLoggedOutUser();
    }
});

// Update UI based on auth state
function updateUIForLoggedInUser(user) {
    const nav = document.querySelector('nav ul');
    nav.innerHTML = `
        <li><a href="#products">Produtos</a></li>
        <li><a href="#producers">Produtores</a></li>
        <li><a href="#pickup">Pontos de Recolha</a></li>
        <li><a href="#dashboard" class="nav-btn">Minha Conta</a></li>
    `;
}

function updateUIForLoggedOutUser() {
    const nav = document.querySelector('nav ul');
    nav.innerHTML = `
        <li><a href="#products">Produtos</a></li>
        <li><a href="#producers">Produtores</a></li>
        <li><a href="#pickup">Pontos de Recolha</a></li>
        <li><a href="#signup">Sou Produtor</a></li>
        <li><a href="#login" class="nav-btn">Entrar</a></li>
    `;
}

// Enhanced Login Functionality
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log("User logged in:", userCredential.user);
        document.getElementById('login-modal').classList.remove('active');
    } catch (error) {
        console.error("Login error:", error);
        alert("Erro no login: " + error.message);
    }
});

// Enhanced Producer Signup
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const producerData = {
        name: document.getElementById('name').value,
        business: document.getElementById('business').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        location: document.getElementById('location').value,
        products: document.getElementById('products').value,
        description: document.getElementById('description').value,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    const files = document.getElementById('photos').files;
    
    try {
        // Upload images to storage
        const imageUrls = await Promise.all(
            Array.from(files).map(file => uploadFile(file))
        );
        
        producerData.photos = imageUrls;
        
        // Save to Firestore
        await db.collection('producers').add(producerData);
        
        alert('Cadastro enviado com sucesso! Entraremos em contacto em breve para validar a sua conta.');
        e.target.reset();
    } catch (error) {
        console.error("Signup error:", error);
        alert("Erro no cadastro: " + error.message);
    }
});

async function uploadFile(file) {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`producers/${file.name}`);
    await fileRef.put(file);
    return await fileRef.getDownloadURL();
}

// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }
    
    addItem(product) {
        this.items.push(product);
        this.save();
    }
    
    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    }
    
    clear() {
        this.items = [];
        this.save();
    }
    
    getTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }
    
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
}

const cart = new ShoppingCart();

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load products from Firestore
    loadProducts();
    
    // Set up event listeners
    setupEventListeners();
});

async function loadProducts() {
    try {
        const snapshot = await db.collection('products').limit(8).get();
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Render products (simplified example)
        console.log("Loaded products:", products);
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

function setupEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.product-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const product = {
                id: productCard.dataset.id || Math.random().toString(36).substr(2, 9),
                name: productCard.querySelector('.product-title').textContent,
                price: parseFloat(
                    productCard.querySelector('.product-price').textContent
                        .replace('€', '')
                        .replace(',', '.')
                ),
                producer: productCard.querySelector('.product-producer').textContent,
                image: productCard.querySelector('.product-img').src
            };
            
            cart.addItem(product);
            updateCartUI();
            
            alert(`${product.name} foi adicionado ao carrinho!`);
        });
    });
}

function updateCartUI() {
    // In a complete implementation, this would update a cart counter
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.items.length;
    }
}