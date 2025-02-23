(function() {
  const API_URL = 'https://sgn-chat.vercel.app/api/chat';

  // Create and inject CSS
  const style = document.createElement('style');
  style.textContent = `
    .chatbot-widget {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 1000;
      font-family: system-ui, -apple-system, sans-serif;
      transition: all 0.3s ease;
      opacity: 1;
      transform: translateY(0);
      color: black;
    }
    .chatbot-header {
      padding: 15px;
      background: black;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-text span.sgn {
      color: white;
    }
    .header-text span.golf {
      color: #01bf53;
    }
    .chatbot-close {
      cursor: pointer;
      font-size: 20px;
      color: white;
      padding: 5px;
    }
    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      background: white;
    }
    .message {
      margin-bottom: 10px;
      padding: 8px 12px;
      border-radius: 15px;
      max-width: 80%;
      color: black;
    }
    .user-message {
      background: #f0f0f0;
      margin-left: auto;
    }
    .bot-message {
      background: #f0f0f0;
    }
    .chatbot-input {
      padding: 15px;
      border-top: 1px solid #eee;
      display: flex;
      background: white;
    }
    .chatbot-input input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-right: 8px;
      background: white;
      color: black;
    }
    .chatbot-input input::placeholder {
      color: #888888;
    }
    .chatbot-input button {
      padding: 8px 15px;
      background: black;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }
    .chatbot-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 24px;
      background: black;
      color: white;
      border-radius: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
      transition: transform 0.3s ease;
      font-weight: bold;
    }
    .chatbot-toggle:hover {
      transform: scale(1.05);
    }
    .chatbot-hidden {
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    }
    /* Custom scrollbar for the messages area */
    .chatbot-messages::-webkit-scrollbar {
      width: 6px;
    }
    .chatbot-messages::-webkit-scrollbar-track {
      background: white;
    }
    .chatbot-messages::-webkit-scrollbar-thumb {
      background: black;
      border-radius: 3px;
    }
    .typing-indicator {
      background-color: #f0f0f0;
      border-radius: 15px;
      padding: 8px 12px;
      margin-bottom: 10px;
      width: fit-content;
      display: none;
      position: relative;
      margin-top: auto;
    }
    
    .typing-indicator span {
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: #666;
      border-radius: 50%;
      margin-right: 5px;
      animation: typing 1s infinite;
    }
    
    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
      margin-right: 0;
    }
    
    @keyframes typing {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }
    .message pre {
      background: #f4f4f4;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
    .message code {
      background: #f4f4f4;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
    }
    .message p {
      margin: 0 0 10px 0;
    }
    .message ul, .message ol {
      padding-left: 20px;
      margin: 0 0 10px 0;
    }
    .message blockquote {
      border-left: 3px solid #ccc;
      margin: 0;
      padding-left: 10px;
      color: #666;
    }
    .message table {
      border-collapse: collapse;
      margin: 10px 0;
    }
    .message th, .message td {
      border: 1px solid #ddd;
      padding: 6px;
    }
    .message a {
      color: #0066cc;
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);

  // Create chat widget HTML
  const widgetHTML = `
    <div class="chatbot-toggle">Click here for help</div>
    <div class="chatbot-widget chatbot-hidden">
      <div class="chatbot-header">
        <div class="header-text">
          <span class="sgn">SGN</span><span class="golf">GOLF Support</span> 
        </div>
        <span class="chatbot-close">×</span>
      </div>
      <div class="chatbot-messages"></div>
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="chatbot-input">
        <input type="text" placeholder="Type your message...">
        <button>Send</button>
      </div>
    </div>
  `;

  // Insert widget into page
  const container = document.createElement('div');
  container.innerHTML = widgetHTML;
  document.body.appendChild(container);

  // Get DOM elements
  const toggle = document.querySelector('.chatbot-toggle');
  const widget = document.querySelector('.chatbot-widget');
  const messages = document.querySelector('.chatbot-messages');
  const input = document.querySelector('.chatbot-input input');
  const sendButton = document.querySelector('.chatbot-input button');
  const closeButton = document.querySelector('.chatbot-close');

  let inactivityTimer;
  let followUpSent = false;  // Flag to track if follow-up has been sent
  const INACTIVITY_TIMEOUT = 60000; // 1 minute in milliseconds
  
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    if (!followUpSent) {  // Only set timer if follow-up hasn't been sent
      inactivityTimer = setTimeout(() => {
        const followUpMessage = "Is there anything else I can help with? Or feel free to contact us:\nPhone: 513-212-6934\nEmail: sgngolf@gmail.com";
        addMessage(followUpMessage, 'bot');
        followUpSent = true;  // Mark follow-up as sent
      }, INACTIVITY_TIMEOUT);
    }
  }

  // Toggle chat widget
  toggle.addEventListener('click', () => {
    widget.classList.remove('chatbot-hidden');
    if (messages.children.length > 1) { // Only start timer if conversation has started
      resetInactivityTimer();
    }
  });

  closeButton.addEventListener('click', () => {
    widget.classList.add('chatbot-hidden');
    clearTimeout(inactivityTimer);
    followUpSent = false;  // Reset the flag when chat is closed
  });

  function showTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    typingIndicator.style.display = 'block';
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    typingIndicator.style.display = 'none';
  }

  function cleanResponse(content) {
    // Remove citations with【】brackets and any content inside
    return content.replace(/【[^】]*】/g, '').trim();
  }

  // Handle sending messages
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: message
          }]
        })
      });

      const data = await response.json();
      
      // Hide typing indicator before showing response
      hideTypingIndicator();
      
      if (response.ok) {
        // The response.content will contain markdown formatting
        addMessage(data.response.content, 'bot');
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }
    } catch (error) {
      console.error('Chat error:', error);
      hideTypingIndicator();
      addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
  }

  function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    
    // Clean the content before processing markdown
    const cleanedContent = cleanResponse(content);
    
    if (typeof marked !== 'undefined') {
      marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: true
      });
      
      messageDiv.innerHTML = marked.parse(cleanedContent);
    } else {
      messageDiv.textContent = cleanedContent;
    }
    
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;

    if (messages.children.length > 1) {
      resetInactivityTimer();
    }
  }

  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Initial greeting
  addMessage('Hello! How can we help you today?', 'bot');

  // Add marked.js for markdown parsing (add this in your HTML)
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  document.head.appendChild(script);
})(); 