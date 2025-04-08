// DOM Elements
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const bookingModal = document.getElementById('booking-modal');
const newTopicModal = document.getElementById('new-topic-modal');
const videoConsultationModal = document.getElementById('video-consultation-modal');
const closeBtns = document.querySelectorAll('.close-btn');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const bookSessionBtns = document.querySelectorAll('.book-session-btn');
const newTopicBtn = document.getElementById('new-topic-btn');
const chatInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const tabBtns = document.querySelectorAll('.tab-btn');
const resourcesContents = document.querySelectorAll('.resources-content');
const videoBtn = document.getElementById('video-btn');
const micBtn = document.getElementById('mic-btn');
const endCallBtn = document.getElementById('end-call-btn');
const screenShareBtn = document.getElementById('screen-share-btn');
const sessionChatInput = document.getElementById('session-chat-input');
const sessionChatSend = document.getElementById('session-chat-send');
const sessionChatMessages = document.getElementById('session-chat-messages');
const chatInsightsToggle = document.querySelector('#chatInsightsToggle');
const chatInsights = document.getElementById('chatInsights'); // Added definition for chatInsights
const closeInsights = document.getElementById('closeInsights'); // Added definition for closeInsights
const suggestionChips = document.querySelectorAll('.suggestion-chip');

// Initialize modals and variables that could be undefined
if (loginModal) {
    loginModal.style.display = 'none';
}
if (signupModal) {
    signupModal.style.display = 'none';
}
if (bookingModal) {
    bookingModal.style.display = 'none';
}
if (newTopicModal) {
    newTopicModal.style.display = 'none';
}

// Function to handle sending messages (placeholder)
function sendMessage(message, isSuggestion = false) {
    console.log('Sending message:', message, 'Is suggestion:', isSuggestion);
    // Add your actual message sending logic here
    if (chatMessages) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
    }
}

// Booking session
if (bookSessionBtns) {
    bookSessionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (bookingModal) {
                bookingModal.style.display = 'block';
            }
        });
    });
}

// New topic
if (newTopicBtn) {
    newTopicBtn.addEventListener('click', () => {
        if (newTopicModal) {
            newTopicModal.style.display = 'block';
        }
    });
}

// Resources tabs
if (tabBtns) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            if (tabBtns && resourcesContents) {
                // Remove active class from all tabs and contents
                tabBtns.forEach(tb => tb.classList.remove('active'));
                resourcesContents.forEach(content => content.classList.remove('active'));
            }
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (loginModal && e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (signupModal && e.target === signupModal) {
        signupModal.style.display = 'none';
    }
    if (bookingModal && e.target === bookingModal) {
        bookingModal.style.display = 'none';
    }
    if (newTopicModal && e.target === newTopicModal) {
        newTopicModal.style.display = 'none';
    }
});

// Suggestion chips
if (suggestionChips) {
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function () {
            sendMessage(this.textContent, true);
        });
    });
}

// Toggle insights panel
if (chatInsightsToggle && chatInsights && closeInsights) {
    chatInsightsToggle.addEventListener('click', function () {
        chatInsights.classList.toggle('hidden');
    });

    closeInsights.addEventListener('click', function () {
        chatInsights.classList.add('hidden');
    });
}

// Close modal functionality
if (closeBtns) {
    closeBtns.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal'); // Assuming the modal has a class "modal"
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
}
// Login functionality
if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
}
// Signup functionality
if (signupBtn && signupModal) {
    signupBtn.addEventListener('click', () => {
        signupModal.style.display = 'block';
    });
}
// Switch to Signup functionality
if (switchToSignup && loginModal && signupModal) {
    switchToSignup.addEventListener('click', () => {
        loginModal.style.display = 'none';
        signupModal.style.display = 'block';
    });
}
// Switch to login functionality
if (switchToLogin && signupModal && loginModal) {
    switchToLogin.addEventListener('click', () => {
        signupModal.style.display = 'none';
        loginModal.style.display = 'block';
    });
}