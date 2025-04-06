// Configuração Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "aveirohub.firebaseapp.com",
    projectId: "aveirohub",
    storageBucket: "aveirohub.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Função para adicionar produtor
function addProducer(producerData) {
    return db.collection('producers').add(producerData);
}

// Função para buscar produtos
function getProducts(category = null) {
    let query = db.collection('products');
    
    if (category && category !== 'Todos') {
        query = query.where('category', '==', category);
    }
    
    return query.get();
}

// Função para registrar pedido
function addOrder(orderData) {
    return db.collection('orders').add({
        ...orderData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pending'
    });
}