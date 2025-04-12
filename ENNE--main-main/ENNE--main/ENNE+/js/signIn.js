

document.getElementById('profile_picture').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        const preview = document.getElementById('previewImage');
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        
        reader.readAsDataURL(file);
    }
});

// Validação de formulário básica
document.querySelector('.auth-form').addEventListener('submit', function(e) {
    const password = document.getElementById('password').value;
    
    if (password.length < 8) {
        alert('A palavra-passe deve ter pelo menos 8 caracteres');
        e.preventDefault();
    }
    
    // Aqui pode adicionar mais validações conforme necessário
});


function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = `-${size}px`;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        particle.style.animation = `float ${duration}s linear ${delay}s infinite`;
        particle.style.opacity = Math.random() * 0.3;
        const colors = ['var(--jade)', 'var(--gold)', 'var(--beige)'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particlesContainer.appendChild(particle);
    }
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