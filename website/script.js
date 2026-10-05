/**
 * COMPACTO CORRETORA DE SEGUROS
 * Interactive UX & Live Demo Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroChatDemo();
  initSimulator();
  initFloatingWidget();
  initMobileNav();
});

/* ==========================================================================
   1. Interactive Hero Chat Demo (Inspirado no Chatbase)
   ========================================================================== */
function initHeroChatDemo() {
  const chatBody = document.getElementById('chatDemoBody');
  const demoInput = document.getElementById('demoInput');
  const demoSendBtn = document.getElementById('demoSendBtn');
  const chipsContainer = document.getElementById('demoChips');
  const statusPill = document.getElementById('chatStatusPill');

  if (!chatBody || !demoInput || !demoSendBtn) return;

  // Click on quick chips
  if (chipsContainer) {
    chipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-btn');
      if (!chip) return;
      const text = chip.getAttribute('data-reply') || chip.innerText;
      handleUserSend(text);
      chip.style.display = 'none'; // remove after use
    });
  }

  // Send button click
  demoSendBtn.addEventListener('click', () => {
    const text = demoInput.value.trim();
    if (text) {
      handleUserSend(text);
      demoInput.value = '';
    }
  });

  // Enter key press
  demoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      demoSendBtn.click();
    }
  });

  function handleUserSend(userText) {
    appendUserBubble(userText);
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const botResponse = generateSofiaResponse(userText);
      appendSofiaBubble(botResponse);

      // Update status pill to reinforce AI value
      if (statusPill) {
        statusPill.innerHTML = `
          <div class="status-icon" style="background-color: #2563EB;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="status-info">
            <strong>Cálculo finalizado:</strong> Condições localizadas com descontos na Porto Seguro, Tokio Marine e Azul.
          </div>
        `;
      }
    }, 1100);
  }

  function appendUserBubble(text) {
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble bubble-client';
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    bubble.innerHTML = `
      <p>${escapeHtml(text)}</p>
      <span class="time-stamp">${time}</span>
    `;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.id = 'demoTypingIndicator';
    typing.className = 'message-bubble bubble-sofia';
    typing.style.padding = '8px 14px';
    typing.innerHTML = `
      <div class="sofia-tag" style="margin-bottom: 2px;">Sofia está digitando...</div>
      <span style="display: inline-block; font-size: 1.2rem; letter-spacing: 3px; line-height: 1;">•••</span>
    `;
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('demoTypingIndicator');
    if (indicator) indicator.remove();
  }

  function appendSofiaBubble(text) {
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble bubble-sofia';
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    bubble.innerHTML = `
      <div class="sofia-tag">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>
        Sofia da Compacto
      </div>
      <p>${text}</p>
      <span class="time-stamp">${time}</span>
    `;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function generateSofiaResponse(text) {
    const lower = text.toLowerCase();
    if (lower.includes('residencial') || lower.includes('casa') || lower.includes('apartamento') || lower.includes('buritis')) {
      return 'Perfeito! Para seguro residencial em BH temos condições excelentes na Porto Seguro e Bradesco com assistência 24h completa (chaveiro, encanador e eletricista). O imóvel é próprio ou alugado? 😊';
    }
    if (lower.includes('corolla') || lower.includes('cross') || lower.includes('porto')) {
      return 'Excelente veículo! E a Porto Seguro é uma das nossas principais parceiras. Conseguimos preservar sua classe de bônus na renovação e comparar se Tokio Marine ou Azul oferecem coberturas extras pelo mesmo valor. Qual o CEP de pernoite?';
    }
    if (lower.includes('compass') || lower.includes('jeep')) {
      return 'Ótima máquina! O Compass tem aceitação com desconto especial em nossas parceiras. Você já possui seguro nele ou seria contrato novo?';
    }
    return 'Entendido perfeitamente! Já estou consultando as tabelas com as seguradoras parceiras da Compacto aqui em BH para buscar o melhor valor. Quer receber o comparativo completo no seu WhatsApp?';
  }
}

/* ==========================================================================
   2. Interactive Simulator Logic
   ========================================================================== */
let currentSimulatorProduct = 'auto';

const productConfigs = {
  auto: {
    label: 'Modelo e Ano do Carro',
    placeholder: 'Ex: Corolla Cross 2023 ou Placa do Veículo',
    btnText: 'Comparar Seguro Auto nas 15 Seguradoras'
  },
  residencial: {
    label: 'Tipo de Imóvel e Situação',
    placeholder: 'Ex: Apartamento Próprio ou Casa Alugada',
    btnText: 'Comparar Seguro Residencial nas 15 Seguradoras'
  },
  vida: {
    label: 'Idade e Profissão',
    placeholder: 'Ex: 38 anos, Engenheiro Civil',
    btnText: 'Simular Cobertura de Vida e Saúde'
  },
  empresarial: {
    label: 'Ramo de Atuação ou Condomínio',
    placeholder: 'Ex: Loja de Roupas, Escritório ou Condomínio 24 aptos',
    btnText: 'Cotar Proteção Empresarial & Patrimonial'
  }
};

function selectSimulatorTab(tabKey) {
  const tabs = document.querySelectorAll('.sim-tab');
  tabs.forEach(t => {
    if (t.getAttribute('data-tab') === tabKey) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  const config = productConfigs[tabKey] || productConfigs.auto;
  currentSimulatorProduct = tabKey;

  const lblDetalhe = document.getElementById('lblDetalhe');
  const simDetalhe = document.getElementById('simDetalhe');
  const btnSubmit = document.getElementById('btnSubmitSimulador');

  if (lblDetalhe) lblDetalhe.textContent = config.label;
  if (simDetalhe) simDetalhe.placeholder = config.placeholder;
  if (btnSubmit) {
    const textSpan = btnSubmit.querySelector('span');
    if (textSpan) textSpan.textContent = config.btnText;
  }
}

function initSimulator() {
  const tabs = document.querySelectorAll('.sim-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const target = tab.getAttribute('data-tab');
      selectSimulatorTab(target);
    });
  });
}

function handleSimulatorSubmit(event) {
  event.preventDefault();

  const nome = document.getElementById('simNome').value.trim();
  const whats = document.getElementById('simWhats').value.trim();
  const detalhe = document.getElementById('simDetalhe').value.trim();
  const cep = document.getElementById('simCep').value.trim();

  const successAlert = document.getElementById('simSuccessAlert');
  const simForm = document.getElementById('simForm');

  if (successAlert) {
    successAlert.style.display = 'flex';
    successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Build direct WhatsApp message for the client
  const productNames = {
    auto: 'Seguro Automóvel',
    residencial: 'Seguro Residencial',
    vida: 'Seguro de Vida / Saúde',
    empresarial: 'Seguro Empresarial'
  };
  const prodName = productNames[currentSimulatorProduct] || 'Seguro';

  const wppText = encodeURIComponent(
    `Olá Sofia! Sou o ${nome}. Fiz a simulação no site da Compacto para ${prodName}.
` +
    `• Dados: ${detalhe}
` +
    `• Localização: ${cep}
` +
    `• Meu Contato: ${whats}
` +
    `Poderia me enviar o comparativo das seguradoras parceiras?`
  );

  // Open WhatsApp in new tab after brief delay for smooth UX
  setTimeout(() => {
    const url = `https://wa.me/5531998825005?text=${wppText}`;
    window.open(url, '_blank');
  }, 1200);
}

/* ==========================================================================
   3. Floating WhatsApp Widget Logic
   ========================================================================== */
function initFloatingWidget() {
  const widget = document.getElementById('floatingWidget');
  const popup = document.getElementById('widgetPopup');
  const toggleBtn = document.getElementById('floatingToggle');
  const closeBtn = document.getElementById('popupClose');

  if (!widget || !popup || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    popup.classList.toggle('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popup.classList.remove('active');
    });
  }

  // Auto show popup gently after 7 seconds
  setTimeout(() => {
    if (!popup.classList.contains('active')) {
      popup.classList.add('active');
    }
  }, 7000);
}

/* ==========================================================================
   4. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('mainNav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    if (nav.style.display === 'flex') {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '72px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.backgroundColor = '#FFFFFF';
      nav.style.padding = '24px';
      nav.style.borderBottom = '1px solid #E4E4E7';
      nav.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
      nav.style.gap = '16px';
    }
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
