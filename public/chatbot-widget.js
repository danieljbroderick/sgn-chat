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
      
      /* Add these media queries for mobile */
      @media (max-width: 480px) {
        width: calc(100% - 40px);
        height: 60vh;
        bottom: 70px;
        right: 20px;
        left: 20px;
      }
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
      
      /* Add for mobile */
      @media (max-width: 480px) {
        width: calc(100% - 40px);
        justify-content: center;
        right: 20px;
        left: 20px;
      }
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
    .message-container {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16px;
      gap: 8px;
    }
    .user-container {
      flex-direction: row-reverse;
    }
    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f0f0;
      flex-shrink: 0;
    }
    .bot-container .message-avatar {
      background: #e6f7ef;
    }
    .message {
      padding: 10px 12px;
      border-radius: 15px;
      max-width: 75%;
      position: relative;
    }
    .user-message {
      background: #f0f0f0;
      border-top-right-radius: 4px;
    }
    .bot-message {
      background: #f0f0f0; 
      border-top-left-radius: 4px;
    }
    /* Add animation for new messages */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .message-container {
      animation: fadeIn 0.3s ease-out;
    }
    .message-timestamp {
      font-size: 0.7rem;
      color: #888;
      text-align: right;
      margin-top: 5px;
      margin-bottom: -5px;
    }
    .clear-history-button {
      margin: 10px auto;
      display: block;
      padding: 8px 15px;
      background: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: background-color 0.2s;
    }
    .clear-history-button:hover {
      background: #e0e0e0;
    }
    .notification-bubble {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #01bf53;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s ease;
    }
    .notification-bubble.show {
      opacity: 1;
      transform: scale(1);
    }
  `;
  document.head.appendChild(style);

  // Create chat widget HTML
  const widgetHTML = `
    <div class="chatbot-toggle" role="button" tabindex="0" aria-label="Open chat support">Click here for help</div>
    <div class="chatbot-widget chatbot-hidden" role="dialog" aria-labelledby="chatbot-header" aria-hidden="true">
      <div class="chatbot-header" id="chatbot-header">
        <div class="header-text">
          <span class="sgn">SGN</span><span class="golf">GOLF Support</span> 
        </div>
        <span class="chatbot-close" role="button" tabindex="0" aria-label="Close chat">×</span>
      </div>
      <div class="chatbot-messages" role="log" aria-live="polite"></div>
      <div class="typing-indicator" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="chatbot-input" role="form">
        <input type="text" placeholder="Type your message..." aria-label="Message input">
        <button aria-label="Send message">Send</button>
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
  const INACTIVITY_TIMEOUT = 150000; // 2.5 minutes in milliseconds
  
  // Add message context preservation
  let messageHistory = [];
  
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    followUpSent = false;  // Reset the flag when timer is reset
    inactivityTimer = setTimeout(() => {
      if (!followUpSent) {  // Only send the follow-up message if it hasn't been sent
        const followUpMessage = "Is there anything else I can help with? Or feel free to contact us:\nPhone: 513-212-6934\nEmail: sgngolf@gmail.com";
        addMessage(followUpMessage, 'bot');
        followUpSent = true;  // Mark follow-up as sent
      }
    }, INACTIVITY_TIMEOUT);
  }

  // Toggle chat widget
  toggle.addEventListener('click', () => {
    widget.classList.remove('chatbot-hidden');
    widget.setAttribute('aria-hidden', 'false');
    notificationBubble.classList.remove('show');
    if (messages.children.length > 1) {
      resetInactivityTimer();
    }
    // Focus the input field when opening
    input.focus();
  });

  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      widget.classList.remove('chatbot-hidden');
      widget.setAttribute('aria-hidden', 'false');
      notificationBubble.classList.remove('show');
      if (messages.children.length > 1) {
        resetInactivityTimer();
      }
      // Focus the input field when opening
      input.focus();
    }
  });

  closeButton.addEventListener('click', () => {
    widget.classList.add('chatbot-hidden');
    widget.setAttribute('aria-hidden', 'true');
    clearTimeout(inactivityTimer);
    followUpSent = false;
  });

  closeButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      widget.classList.add('chatbot-hidden');
      widget.setAttribute('aria-hidden', 'true');
      clearTimeout(inactivityTimer);
      followUpSent = false;
    }
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

    addMessage(message, 'user');
    input.value = '';
    resetInactivityTimer();
    
    // Add the message to our history
    messageHistory.push({
      role: 'user',
      content: message
    });
    
    showTypingIndicator();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messageHistory
        })
      });

      const data = await response.json();
      
      // Hide typing indicator before showing response
      hideTypingIndicator();
      
      if (response.ok) {
        // The response.content will contain markdown formatting
        addMessage(data.response.content, 'bot');
        
        // Add the response to our history
        messageHistory.push({
          role: 'assistant',
          content: data.response.content
        });
        
        // Limit history to prevent excessive token usage
        if (messageHistory.length > 10) {
          // Keep first message (context) and last 9 messages
          messageHistory = [
            messageHistory[0],
            ...messageHistory.slice(messageHistory.length - 9)
          ];
        }
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      }
    } catch (error) {
      console.error('Chat error:', error);
      hideTypingIndicator();
      addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
  }

  // Add these functions to handle chat history persistence
  function saveMessageToHistory(content, sender) {
    const chatHistory = JSON.parse(localStorage.getItem('sgn-chat-history') || '[]');
    chatHistory.push({
      content, 
      sender,
      timestamp: new Date().toISOString()
    });
    
    // Limit history to last 50 messages
    if (chatHistory.length > 50) {
      chatHistory.shift();
    }
    
    localStorage.setItem('sgn-chat-history', JSON.stringify(chatHistory));
  }

  function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('sgn-chat-history') || '[]');
    
    // Clear any existing messages in the chat window
    while (messages.firstChild) {
      messages.removeChild(messages.firstChild);
    }
    
    if (chatHistory.length > 0) {
      // Add a welcome back message
      addMessage('Welcome back! What can I help you with?', 'bot');
      
      // Restore conversation history for context (optional)
      // You can uncomment this if you want to show the last few messages from history
      /*
      const recentMessages = chatHistory.slice(-3); // Show last 3 messages
      for (const msg of recentMessages) {
        addMessage(msg.content, msg.sender, false); // false to not save it again
      }
      */
      
      // Restore message history for API context
      messageHistory = chatHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
    } else {
      // Initial greeting for new users
      addMessage('Hi! How can I assist you with SGN Golf simulators today?', 'bot');
    }
  }

  // Update the addMessage function to save messages
  function addMessage(content, sender, saveToHistory = true) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', `${sender}-container`);
    
    // Create avatar element
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('message-avatar');
    
    // Set different avatars for bot and user
    if (sender === 'bot') {
      avatarDiv.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="#01bf53"><path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25zm2.259 5.854a2.25 2.25 0 114.091 1.88l-1.824 3.969a.75.75 0 01-1.362-.628l1.824-3.969a.752.752 0 00-.98-.98l-3.969 1.824a.75.75 0 01-.628-1.362l3.969-1.824a2.25 2.25 0 01-.121.09zM9.776 15.896a2.25 2.25 0 11-4.09-1.88l1.824-3.969a.75.75 0 011.362.628L7.05 14.643a.752.752 0 00.979.98l3.97-1.824a.75.75 0 01.628 1.362l-3.97 1.824a2.22 2.22 0 01.12-.09z"/></svg>'; // Golf ball icon
    } else {
      avatarDiv.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="#888"><path d="M12 2.25c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75S17.376 2.25 12 2.25zm-4.5 9.75a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"/></svg>'; // User icon
    }
    
    // Create message bubble
    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('message', `${sender}-message`);
    
    // Add timestamp div
    const timestamp = document.createElement('div');
    timestamp.classList.add('message-timestamp');
    const now = new Date();
    timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Clean the content before processing markdown
    const cleanedContent = cleanResponse(content);
    
    if (typeof marked !== 'undefined') {
      marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: true
      });
      
      bubbleDiv.innerHTML = marked.parse(cleanedContent);
    } else {
      bubbleDiv.textContent = cleanedContent;
    }
    
    // Append timestamp to bubble
    bubbleDiv.appendChild(timestamp);
    
    // Append everything
    messageContainer.appendChild(avatarDiv);
    messageContainer.appendChild(bubbleDiv);
    messages.appendChild(messageContainer);
    messages.scrollTop = messages.scrollHeight;

    if (messages.children.length > 1) {
      resetInactivityTimer();
    }

    // Save to history if needed
    if (saveToHistory) {
      saveMessageToHistory(content, sender);
    }

    if (sender === 'bot') {
      showNotification();
    }
  }

  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Update initialization to load history
  loadChatHistory();

  // Add marked.js for markdown parsing (add this in your HTML)
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  document.head.appendChild(script);

  // Add notification HTML to toggle element
  const notificationBubble = document.createElement('div');
  notificationBubble.classList.add('notification-bubble');
  notificationBubble.textContent = '1';
  toggle.appendChild(notificationBubble);

  // Show notification when bot message comes in while chat is hidden
  function showNotification() {
    if (widget.classList.contains('chatbot-hidden')) {
      notificationBubble.classList.add('show');
    }
  }

  // Remove the addClearHistoryButton function since we're not using it anymore
  // But add a function to clear history if needed
  function clearChatHistory() {
    localStorage.removeItem('sgn-chat-history');
    messageHistory = [];
    while (messages.firstChild) {
      messages.removeChild(messages.firstChild);
    }
    addMessage('Hi! How can I assist you with SGN Golf simulators today?', 'bot');
  }
})(); 