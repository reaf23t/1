document.addEventListener('DOMContentLoaded', () => {
    // Modo Escuro/Claro
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.textContent = 'Modo Claro';
        } else {
            themeToggle.textContent = 'Modo Escuro';
        }
    });

    // Rolagem Suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
