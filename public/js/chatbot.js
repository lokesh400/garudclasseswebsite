/* ===================================================
   GARUD CLASSES – CHATBOT WIDGET
   =================================================== */
(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────
  const API_URL    = '/api/chat';
  const BOT_NAME   = 'Garud Assistant';
  const TYPING_MS  = 900; // simulated typing delay

  const WELCOME_MSG =
    '👋 Hi there! Welcome to **Garud Classes**!\n\nI\'m here to help you with courses, admissions, fees, and more.\n\nHow can I assist you today?';

  const QUICK_SUGGESTIONS = [
    '📚 Courses',
    '✅ Admission',
    '💰 Fees',
    '📞 Contact',
    '🏆 Results'
  ];

  // ── State ────────────────────────────────────────────
  let isOpen    = false;
  let isBotTyping = false;

  // ── DOM References ───────────────────────────────────
  const toggle      = document.getElementById('chatbot-toggle');
  const window_     = document.getElementById('chatbot-window');
  const overlay     = document.getElementById('chatbot-overlay');
  const messages    = document.getElementById('chatbot-messages');
  const input       = document.getElementById('chatbot-input');
  const sendBtn     = document.getElementById('chatbot-send');
  const minimizeBtn = document.getElementById('chatbot-minimize');
  const badge       = document.getElementById('chatbot-badge');

  if (!toggle || !window_ || !messages || !input || !sendBtn) return;

  // ── Helpers ──────────────────────────────────────────
  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /** Convert simple markdown-ish formatting to HTML */
  function formatMessage(text) {
    return escapeHtml(text)
      // Bold: **text**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic: *text*
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      // Line breaks
      .replace(/\n/g, '<br>')
      // Inline links: [label](/path) or [label](url)
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]*)\)/g,
        (_, label, href) => `<a href="${href}" target="${href.startsWith('http') ? '_blank' : '_self'}" rel="noopener">${label}</a>`);
  }

  function getTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  // ── Append Message ───────────────────────────────────
  function addMessage(text, sender = 'bot') {
    const wrap = document.createElement('div');
    wrap.className = `chat-msg ${sender}`;

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = sender === 'bot' ? '🦅' : '<i class="fas fa-user"></i>';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = formatMessage(text);

    const time = document.createElement('div');
    time.className = 'msg-time';
    time.textContent = getTime();

    const inner = document.createElement('div');
    inner.style.display = 'flex';
    inner.style.flexDirection = 'column';
    inner.appendChild(bubble);
    inner.appendChild(time);

    wrap.appendChild(avatar);
    wrap.appendChild(inner);
    messages.appendChild(wrap);
    scrollToBottom();
  }

  // ── Typing Indicator ─────────────────────────────────
  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg bot';
    wrap.id = 'typing-bubble';

    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.innerHTML = '🦅';

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById('typing-bubble');
    if (el) el.remove();
  }

  // ── Send Message ─────────────────────────────────────
  async function sendMessage(text) {
    const msg = (text || input.value).trim();
    if (!msg || isBotTyping) return;

    // Clear input
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    // Show user bubble
    addMessage(msg, 'user');

    // Show typing
    isBotTyping = true;
    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });

      // Simulate min typing delay for natural feel
      await new Promise(r => setTimeout(r, TYPING_MS));

      hideTyping();
      isBotTyping = false;
      sendBtn.disabled = false;

      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      addMessage(data.reply || 'Sorry, I could not understand that.', 'bot');

    } catch (err) {
      await new Promise(r => setTimeout(r, TYPING_MS));
      hideTyping();
      isBotTyping = false;
      sendBtn.disabled = false;
      addMessage('⚠️ Something went wrong. Please call us at **+91 98969 13009** for immediate help.', 'bot');
    }
  }

  // ── Toggle Window ────────────────────────────────────
  function openChat() {
    isOpen = true;
    window_.classList.add('open');
    toggle.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.classList.add('chatbot-open');
    if (badge) badge.style.display = 'none';
    input.focus();
  }

  function closeChat() {
    isOpen = false;
    window_.classList.remove('open');
    toggle.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('chatbot-open');
  }

  // ── Events ───────────────────────────────────────────
  toggle.addEventListener('click', () => (isOpen ? closeChat() : openChat()));

  // Click overlay to close
  if (overlay) overlay.addEventListener('click', closeChat);

  if (minimizeBtn) minimizeBtn.addEventListener('click', closeChat);

  sendBtn.addEventListener('click', () => sendMessage());

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea as user types
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  // Quick suggestion buttons
  const suggestionBtns = document.querySelectorAll('.suggestion-btn');
  suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.dataset.msg || btn.textContent.replace(/^[^\w]+/, '').trim();
      openChat();
      setTimeout(() => sendMessage(label), 100);
    });
  });

  // ── Init: Welcome message ─────────────────────────────
  setTimeout(() => {
    addMessage(WELCOME_MSG, 'bot');
  }, 300);

  // ── Auto-open after delay (first visit only) ──────────
  if (!sessionStorage.getItem('chatbot_opened')) {
    setTimeout(() => {
      openChat();
      sessionStorage.setItem('chatbot_opened', '1');
    }, 4000);
  }

})();
