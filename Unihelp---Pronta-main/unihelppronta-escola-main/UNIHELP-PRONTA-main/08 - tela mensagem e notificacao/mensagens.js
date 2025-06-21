// Dados dos médicos (sem especialização)
const doctors = [
  {
    id: 1,
    name: "Dr. André Silva",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    online: true,
    unread: 0
  },
  {
    id: 2,
    name: "Dra. Carla Mendes",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    online: true,
    unread: 0
  },
  {
    id: 3,
    name: "Dra. Juliana Santos",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    online: false,
    unread: 1
  },
  {
    id: 4,
    name: "Dr. Marcos Oliveira",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    online: false,
    unread: 0
  }
];

// Banco de respostas baseado em palavras-chave
const keywordResponses = {
  "dor": [
    "A dor pode ser um sintoma importante. Você pode descrever melhor?",
    "Quantos dias você está sentindo essa dor?",
    "A dor é constante ou vai e volta?",
    "Em uma escala de 0 a 10, qual a intensidade da dor?",
    "Você já tomou algum medicamento para aliviar a dor?"
  ],
  "febre": [
    "Há quanto tempo você está com febre?",
    "A febre é alta? Você mediu a temperatura?",
    "Além da febre, você tem outros sintomas?",
    "Recomendo repouso e ingestão de líquidos.",
    "A febre pode ser um sinal de infecção. Vamos marcar uma consulta?"
  ],
  "tosse": [
    "A tosse é seca ou com catarro?",
    "Há quanto tempo você está com tosse?",
    "A tosse piora à noite?",
    "Você tem falta de ar associada à tosse?",
    "Recomendo beber bastante água e evitar mudanças bruscas de temperatura."
  ],
  "gripe": [
    "Quais sintomas da gripe você está sentindo?",
    "Há quanto tempo você está com esses sintomas?",
    "Você já tomou algum medicamento?",
    "Recomendo repouso e hidratação adequada.",
    "Se os sintomas persistirem por mais de 3 dias, procure atendimento."
  ],
  "cansaço": [
    "O cansaço é constante ou aparece após atividades?",
    "Você tem dificuldade para dormir?",
    "O cansaço afeta suas atividades diárias?",
    "Recomendo avaliar sua rotina de sono e alimentação.",
    "O cansaço persistente merece investigação médica."
  ],
  "pressão": [
    "Você monitora sua pressão regularmente?",
    "Quais valores de pressão você tem observado?",
    "Tem histórico familiar de hipertensão?",
    "Recomendo reduzir o consumo de sal e praticar exercícios.",
    "Vamos agendar uma consulta para avaliar seu caso."
  ],
  "diabetes": [
    "Você faz monitoramento da glicemia?",
    "Quais valores de glicemia você tem observado?",
    "Tem seguido a dieta recomendada?",
    "Recomendo manter uma alimentação balanceada e atividade física regular.",
    "É importante fazer exames periódicos para controle."
  ],
  "alergia": [
    "Quais sintomas de alergia você está sentindo?",
    "Sabe identificar o que causa sua alergia?",
    "Já usou algum antialérgico? Teve melhora?",
    "Recomendo evitar possíveis alérgenos e manter ambientes ventilados.",
    "Em casos graves, procure atendimento imediato."
  ],
  "ferida": [
    "Onde está localizada a ferida?",
    "Há quanto tempo apareceu?",
    "A ferida apresenta secreção ou vermelhidão ao redor?",
    "Mantenha o local limpo e seco.",
    "Se houver sinais de infecção (inchaço, pus, febre), procure atendimento."
  ],
  "inchaco": [
    "Onde está localizado o inchaço?",
    "Há quanto tempo apareceu?",
    "O inchaço é doloroso?",
    "Recomendo elevar o membro afetado e evitar ficar muito tempo parado.",
    "Inchaços persistentes merecem avaliação médica."
  ],
  "vomito": [
    "Há quanto tempo você está com vômitos?",
    "Consegue manter líquidos no estômago?",
    "Tem outros sintomas como febre ou dor abdominal?",
    "Recomendo pequenos goles de água ou soro caseiro.",
    "Se os vômitos persistirem por mais de 24 horas, procure atendimento."
  ],
  "diarreia": [
    "Há quanto tempo você está com diarreia?",
    "Quantas evacuações por dia?",
    "Há presença de sangue ou muco?",
    "Recomendo hidratação com soro e alimentação leve.",
    "Se persistir por mais de 2 dias, procure atendimento."
  ]
};

// Estado da aplicação
let currentDoctorId = null;
let conversationHistory = {};
let isFirstMessage = true;

// Inicialização
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

  // Renderiza lista de médicos
  renderDoctorsList();
  
  // Configura o chat
  setupChat();
});

// Renderiza a lista de médicos
function renderDoctorsList() {
  const doctorsList = document.getElementById('doctorsList');
  doctorsList.innerHTML = '';
  
  doctors.forEach(doctor => {
    const doctorCard = document.createElement('div');
    doctorCard.className = `doctor-card ${doctor.id === currentDoctorId ? 'active' : ''}`;
    doctorCard.dataset.id = doctor.id;
    
    doctorCard.innerHTML = `
      <img src="${doctor.avatar}" 
           alt="${doctor.name}" class="doctor-avatar">
      <div class="doctor-info">
        <div class="doctor-name">${doctor.name}</div>
        <div class="doctor-status ${doctor.online ? 'status-online' : 'status-offline'}">
          <i class="fas fa-circle"></i> ${doctor.online ? 'Online' : 'Offline'}
        </div>
      </div>
      ${doctor.unread > 0 ? `<div class="unread-badge">${doctor.unread}</div>` : ''}
    `;
    
    doctorCard.addEventListener('click', function() {
      switchToDoctor(doctor.id);
    });
    
    doctorsList.appendChild(doctorCard);
  });
}

// Muda para um médico específico
function switchToDoctor(doctorId) {
  // Remove a classe ativa de todos os cards
  document.querySelectorAll('.doctor-card').forEach(card => {
    card.classList.remove('active');
  });
  
  // Encontra o médico
  const doctor = doctors.find(d => d.id === doctorId);
  if (!doctor) return;
  
  // Adiciona classe ativa ao card clicado
  const doctorCard = document.querySelector(`.doctor-card[data-id="${doctorId}"]`);
  if (doctorCard) doctorCard.classList.add('active');
  
  // Atualiza o médico atual
  currentDoctorId = doctor.id;
  
  // Atualiza o cabeçalho do chat
  updateChatHeader(doctor);
  
  // Ativa o campo de mensagem
  document.getElementById('messageInput').disabled = false;
  
  // Carrega a conversa
  loadConversation(doctor.id);
}

// Atualiza o cabeçalho do chat com informações do médico
function updateChatHeader(doctor) {
  document.getElementById('currentDoctorName').textContent = doctor.name;
  document.getElementById('currentDoctorAvatar').src = doctor.avatar;
}

// Configura o chat
function setupChat() {
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const resetBtn = document.getElementById('resetChatBtn');
  const attachBtn = document.getElementById('attachFile');
  const typingIndicator = document.getElementById('typingIndicator');
  
  // Ajusta altura do textarea conforme o conteúdo
  messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    sendBtn.disabled = this.value.trim() === '';
  });
  
  // Envia mensagem ao clicar no botão
  sendBtn.addEventListener('click', sendMessage);
  
  // Envia mensagem ao pressionar Enter
  messageInput.addEventListener('keydown', function(e) {
    if(e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageInput.value.trim() !== '') {
        sendMessage();
      }
    }
  });
  
  // Simula upload de arquivo
  attachBtn.addEventListener('click', function() {
    alert('Funcionalidade de anexo será implementada em breve!');
  });
  
  // Resetar conversa
  resetBtn.addEventListener('click', function() {
    if (confirm('Deseja reiniciar a conversa com este médico?')) {
      resetConversation();
    }
  });
}

// Carrega a conversa com um médico específico
function loadConversation(doctorId) {
  const chatMessages = document.getElementById('chatMessages');
  const doctor = doctors.find(d => d.id === doctorId);
  const typingIndicator = document.getElementById('typingIndicator');
  
  // Se não houver histórico, inicia uma nova conversa
  if (!conversationHistory[doctorId] || conversationHistory[doctorId].length === 0) {
    startNewConversation(doctor);
    return;
  }
  
  // Limpa as mensagens atuais
  chatMessages.innerHTML = '';
  
  // Adiciona o indicador de digitação
  if (typingIndicator) chatMessages.appendChild(typingIndicator);
  
  // Adiciona as mensagens do histórico
  conversationHistory[doctorId].forEach(msg => {
    addMessageToChat(msg.message, msg.sender);
  });
  
  // Rola para o final do chat
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Inicia uma nova conversa com um médico
function startNewConversation(doctor) {
  // Limpa o histórico de mensagens
  const chatMessages = document.getElementById('chatMessages');
  chatMessages.innerHTML = '';
  
  // Mensagem de saudação do médico
  const greeting = `Olá! Sou o(a) ${doctor.name.split(' ')[0]}. Como posso ajudar hoje?`;
  
  // Adiciona mensagem de saudação
  addMessageToChat(greeting, 'received');
  
  // Inicializa o histórico da conversa
  conversationHistory[doctor.id] = [{
    sender: 'received',
    message: greeting,
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }];
  
  // Marca que a primeira mensagem foi enviada
  isFirstMessage = true;
}

// Adiciona uma mensagem ao chat
function addMessageToChat(message, sender) {
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');
  
  // Esconde o indicador de digitação
  if (typingIndicator) typingIndicator.style.display = 'none';
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  messageDiv.innerHTML = `
    <div class="message-content">
      <div class="message-text">${message}</div>
      <div class="message-time">${timeString}</div>
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  
  // Rola para a última mensagem
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Gera resposta baseada em palavras-chave
function generateResponse(doctor, userMessage) {
  const typingIndicator = document.getElementById('typingIndicator');
  const chatMessages = document.getElementById('chatMessages');
  
  // Esconde o indicador de digitação
  if (typingIndicator) typingIndicator.style.display = 'none';
  
  // Converter mensagem para minúsculas e remover acentos
  const cleanMessage = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Procurar palavras-chave na mensagem
  let foundKeyword = null;
  for (const keyword in keywordResponses) {
    if (cleanMessage.includes(keyword)) {
      foundKeyword = keyword;
      break;
    }
  }
  
  let response;
  if (foundKeyword) {
    // Selecionar resposta aleatória para a palavra-chave encontrada
    const responses = keywordResponses[foundKeyword];
    response = responses[Math.floor(Math.random() * responses.length)];
  } else {
    // Resposta padrão
    const responses = [
      "Obrigado por compartilhar suas preocupações. Como profissional de saúde, recomendo buscar avaliação médica para sintomas persistentes.",
      "Entendo sua preocupação. Vamos agendar uma consulta para discutir isso com mais detalhes?",
      "Para uma orientação mais precisa, precisarei realizar alguns exames complementares.",
      "Com base no que você descreveu, aqui estão algumas recomendações gerais de saúde..."
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Adiciona a resposta ao chat
  addMessageToChat(response, 'received');
  
  // Atualiza o histórico
  conversationHistory[doctor.id].push({
    sender: 'received',
    message: response,
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  });
}

// Envia uma mensagem
function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();
  const typingIndicator = document.getElementById('typingIndicator');
  const sendBtn = document.getElementById('sendBtn');
  const doctor = doctors.find(d => d.id === currentDoctorId);
  
  if (message && doctor) {
    // Adiciona a mensagem do usuário ao chat
    addMessageToChat(message, 'sent');
    
    // Salva no histórico
    if (!conversationHistory[doctor.id]) {
      conversationHistory[doctor.id] = [];
    }
    
    conversationHistory[doctor.id].push({
      sender: 'sent',
      message: message,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    
    // Limpa o campo de entrada
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;
    
    // Mostra indicador de digitação
    if (typingIndicator) typingIndicator.style.display = 'flex';
    
    // Gera resposta do médico baseada em palavras-chave
    setTimeout(() => {
      generateResponse(doctor, message);
    }, 1000 + Math.random() * 1000);
  }
}

// Resetar conversa
function resetConversation() {
  if (currentDoctorId) {
    conversationHistory[currentDoctorId] = [];
    const doctor = doctors.find(d => d.id === currentDoctorId);
    if (doctor) {
      startNewConversation(doctor);
    }
  }
}