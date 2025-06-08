document.addEventListener('DOMContentLoaded', function() {
  // Menu Mobile
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  
  if (navToggle && nav) {
    navToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      nav.setAttribute('data-visible', !isExpanded);
    });
  }

  // Atualizar data e hora
  function updateDateTime() {
    const now = new Date();
    const horaDataEl = document.getElementById('horaData');
    
    if (horaDataEl) {
      // Formatar hora (HH:MM)
      const horas = String(now.getHours()).padStart(2, '0');
      const minutos = String(now.getMinutes()).padStart(2, '0');
      
      // Nomes dos dias da semana e meses por extenso
      const diasSemana = [
        'domingo', 'segunda-feira', 'terça-feira', 
        'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'
      ];
      
      const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ];
      
      // Obter componentes da data
      const diaSemana = diasSemana[now.getDay()];
      const dia = now.getDate();
      const mes = meses[now.getMonth()];
      const ano = now.getFullYear();
      
      // Formatar a exibição
      horaDataEl.textContent = `${horas}:${minutos} | ${diaSemana}, ${dia} de ${mes} de ${ano}`;
    }
  }
  
  // Atualizar imediatamente e depois a cada minuto
  updateDateTime();
  setInterval(updateDateTime, 60000);

  // Efeito de hover nos cards
  const serviceCards = document.querySelectorAll('.card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    });
  });
  
  // Animar as barras do gráfico
  setTimeout(() => {
    const graphBars = document.querySelectorAll('.graph-fill');
    graphBars.forEach(bar => {
      const height = bar.style.height;
      bar.style.height = '0';
      setTimeout(() => {
        bar.style.height = height;
      }, 200);
    });
  }, 500);
});