// Carregar produtos do produtor logado
function loadProducerProducts(producerId) {
    db.collection('products')
      .where('producerId', '==', producerId)
      .get()
      .then(querySnapshot => {
          const productList = document.querySelector('.product-list');
          productList.innerHTML = '';
          
          querySnapshot.forEach(doc => {
              const product = doc.data();
              const productElement = document.createElement('div');
              productElement.className = 'producer-product';
              productElement.innerHTML = `
                  <img src="${product.imageUrl}" alt="${product.name}">
                  <h4>${product.name}</h4>
                  <p>€${product.price}</p>
                  <button class="edit-btn" data-id="${doc.id}">Editar</button>
                  <button class="delete-btn" data-id="${doc.id}">Remover</button>
              `;
              productList.appendChild(productElement);
          });
      });
}

// Adicionar novo produto
document.getElementById('add-product-btn').addEventListener('click', () => {
    showProductForm();
});

function showProductForm(product = null) {
    // Mostrar modal com formulário de produto
    const formHtml = `
        <div class="modal">
            <div class="modal-content">
                <h3>${product ? 'Editar' : 'Adicionar'} Produto</h3>
                <form id="product-form">
                    <input type="hidden" id="product-id" value="${product?.id || ''}">
                    
                    <div class="form-group">
                        <label for="product-name">Nome</label>
                        <input type="text" id="product-name" value="${product?.name || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-price">Preço (€)</label>
                        <input type="number" step="0.01" id="product-price" value="${product?.price || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-category">Categoria</label>
                        <select id="product-category" required>
                            <option value="frutas" ${product?.category === 'frutas' ? 'selected' : ''}>Frutas</option>
                            <option value="pescados" ${product?.category === 'pescados' ? 'selected' : ''}>Pescados</option>
                            <option value="artesanato" ${product?.category === 'artesanato' ? 'selected' : ''}>Artesanato</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-description">Descrição</label>
                        <textarea id="product-description" required>${product?.description || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-image">Imagem</label>
                        <input type="file" id="product-image" accept="image/*">
                    </div>
                    
                    <div class="form-buttons">
                        <button type="submit">Salvar</button>
                        <button type="button" class="cancel-btn">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
    
    // Configurar submit do formulário
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value,
        producerId: getCurrentUserId() // Implementar conforme sistema de autenticação
    };
    
    const productId = document.getElementById('product-id').value;
    const imageFile = document.getElementById('product-image').files[0];
    
    if (imageFile) {
        // Upload da imagem para Firebase Storage
        uploadProductImage(imageFile)
            .then(imageUrl => {
                productData.imageUrl = imageUrl;
                saveProduct(productId, productData);
            });
    } else if (productId) {
        // Atualizar sem alterar a imagem
        saveProduct(productId, productData);
    } else {
        alert('Por favor, adicione uma imagem para o produto');
    }
}

function uploadProductImage(file) {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`products/${file.name}`);
    
    return fileRef.put(file)
        .then(snapshot => snapshot.ref.getDownloadURL());
}

function saveProduct(id, data) {
    if (id) {
        // Atualizar produto existente
        return db.collection('products').doc(id).update(data);
    } else {
        // Adicionar novo produto
        return db.collection('products').add(data);
    }
}