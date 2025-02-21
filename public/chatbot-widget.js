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
      background: #00FF33;
      color: black;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-text span.sgn {
      color: white;
    }
    .header-text span.golf-support {
      color: #01bf53;
    }
    .chatbot-close {
      cursor: pointer;
      font-size: 20px;
      color: black;
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
      background: #00FF33;
      color: black;
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
      background: #00FF33;
      color: black;
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
      background: #00FF33;
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);

  // Create chat widget HTML
  const widgetHTML = `
    <div class="chatbot-toggle">Click here for help</div>
    <div class="chatbot-widget chatbot-hidden">
      <div class="chatbot-header">
        <div class="header-text">
          <span class="sgn">SGN</span> <span class="golf-support">Golf Support</span>
        </div>
        <span class="chatbot-close">×</span>
      </div>
      <div class="chatbot-messages"></div>
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

  // Toggle chat widget
  toggle.addEventListener('click', () => {
    widget.classList.remove('chatbot-hidden');
  });

  closeButton.addEventListener('click', () => {
    widget.classList.add('chatbot-hidden');
  });

  // Handle sending messages
  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    input.value = '';

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
      
      if (response.ok) {
        addMessage(data.response.content, 'bot');
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
  }

  function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = content;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Initial greeting
  addMessage('Hello! How can I help you today?', 'bot');
})(); 