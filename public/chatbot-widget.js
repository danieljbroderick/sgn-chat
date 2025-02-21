(function() {
  const API_URL = 'https://sgn-chat-api.vercel.app/api/chat';

  // Create and inject CSS
  const style = document.createElement('style');
  style.textContent = `
    .chatbot-widget {
      position: fixed;
      bottom: 90px;  /* Increased to leave space for the toggle button */
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
    }
    .chatbot-header {
      padding: 15px;
      background: #0070f3;
      color: white;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    }
    .message {
      margin-bottom: 10px;
      padding: 8px 12px;
      border-radius: 15px;
      max-width: 80%;
    }
    .user-message {
      background: #e3f2fd;
      margin-left: auto;
    }
    .bot-message {
      background: #f5f5f5;
    }
    .chatbot-input {
      padding: 15px;
      border-top: 1px solid #eee;
      display: flex;
    }
    .chatbot-input input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-right: 8px;
    }
    .chatbot-input button {
      padding: 8px 15px;
      background: #0070f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .chatbot-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: #0070f3;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      z-index: 1000;
      transition: transform 0.3s ease;
    }
    .chatbot-toggle:hover {
      transform: scale(1.1);
    }
    .chatbot-hidden {
      opacity: 0;
      transform: translateY(20px);
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);

  // Create chat widget HTML
  const widgetHTML = `
    <div class="chatbot-toggle">💬</div>
    <div class="chatbot-widget chatbot-hidden">
      <div class="chatbot-header">
        Chat Support
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