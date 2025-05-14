document.addEventListener('DOMContentLoaded', function() {
    const btn = document.querySelector('.btn');
    
    // Efeito de pulso no botão a cada 5 segundos
    setInterval(() => {
        btn.style.transform = 'scale(1.05)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 300);
    }, 5000);
    
    // Se quiser adicionar evento de clique como outra opção
    btn.addEventListener('click', function(e) {
        // Evita comportamento padrão se você quiser fazer algo antes da navegação
        // e.preventDefault();
        
        // Navega para a página da calculadora
        window.location.href = 'index.html';
    });
});
