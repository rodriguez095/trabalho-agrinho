function toggleDarkMode() {
  const body = document.body;
  const button = document.getElementById('darkModeToggle');
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    button.textContent = 'Desativar modo escuro';
  } else {
    button.textContent = 'Ativar modo escuro';
  }
}

function acaoBase() {
  const saida = document.getElementById('saida');
  if (saida) {
    saida.textContent = 'Botão clicado!';
  }
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

function abrirSecao(sectionId) {
  const section = document.getElementById(sectionId);
  const sectionTextarea = section.querySelector('.section-textarea');
  const closeBtn = section.querySelector('.section-close-btn');
  
  section.classList.add('expanded');
  sectionTextarea.style.display = 'block';
  closeBtn.style.display = 'block';
  
  // Focus no textarea
  setTimeout(() => {
    sectionTextarea.querySelector('textarea').focus();
  }, 100);
}

function fecharSecao(sectionId) {
  const section = document.getElementById(sectionId);
  const sectionTextarea = section.querySelector('.section-textarea');
  const closeBtn = section.querySelector('.section-close-btn');
  
  // Adiciona a animação de fade out
  sectionTextarea.classList.add('fade-out');
  
  // Aguarda a animação terminar antes de esconder
  setTimeout(() => {
    section.classList.remove('expanded');
    sectionTextarea.style.display = 'none';
    sectionTextarea.classList.remove('fade-out');
    closeBtn.style.display = 'none';
  }, 600);
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const section = entry.target.closest('section');
      if (section) {
        section.classList.add('visible-title');
      }
      sectionObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2,
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('section h2').forEach((title) => {
    sectionObserver.observe(title);
  });
  
  // Adicionar evento de clique em todas as seções
  document.querySelectorAll('section').forEach((section) => {
    section.addEventListener('click', function(e) {
      // Não abrir se clicou no botão de fechar, no textarea ou em elementos específicos
      if (!e.target.classList.contains('section-close-btn') && 
          !e.target.closest('.section-textarea') &&
          !e.target.closest('.caixa-interativa') &&
          !e.target.closest('img')) {
        if (!section.classList.contains('expanded')) {
          abrirSecao(section.id);
        }
      }
    });
  });
});
