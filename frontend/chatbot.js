// Function to send a message to the Flask backend
function sendMessage(message) {
    console.log('Sending message:', message); // Debugging log

    // Show typing indicator
    showTypingIndicator();

    fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Received response:', data); // Debugging log

            // Add bot's response to the chat
            addMessageToChat(data.response, 'bot');
        })
        .catch(error => {
            console.error('Error communicating with the chatbot:', error);
            addMessageToChat('Error: Unable to communicate with the chatbot.', 'bot');
        })
        .finally(() => {
            // Hide typing indicator
            hideTypingIndicator();
        });
}

// Helper function to add a message to the chat interface
function addMessageToChat(message, sender) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Helper functions to show/hide the typing indicator
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.style.display = 'block';
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.style.display = 'none';
}

document.getElementById('send-button').addEventListener('click', () => {
    console.log('Send button clicked'); // Debugging log
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (message) {
        console.log('Message to send:', message); // Debugging log
        addMessageToChat(message, 'user'); // Add user's message to the chat
        sendMessage(message);
        userInput.value = ''; // Clear the input field
    }
});

document.getElementById('user-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const message = event.target.value.trim();

        if (message) {
            addMessageToChat(message, 'user'); // Add user's message to the chat
            sendMessage(message);
            event.target.value = ''; // Clear the input field
        }
    }
});