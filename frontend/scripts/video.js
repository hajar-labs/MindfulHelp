// Video controls
videoBtn.addEventListener('click', () => {
    if (videoBtn.innerHTML.includes('Stop')) {
        videoBtn.innerHTML = '<i class="fas fa-video-slash"></i> Start Video';
    } else {
        videoBtn.innerHTML = '<i class="fas fa-video"></i> Stop Video';
    }
});

micBtn.addEventListener('click', () => {
    if (micBtn.innerHTML.includes('Mute')) {
        micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Unmute';
    } else {
        micBtn.innerHTML = '<i class="fas fa-microphone"></i> Mute';
    }
});

endCallBtn.addEventListener('click', () => {
    videoConsultationModal.style.display = 'none';
});

// Session chat
sessionChatSend.addEventListener('click', () => {
    const message = sessionChatInput.value.trim();
    if (message) {
        // Add user message
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'message user-message';
        userMessageElement.innerHTML = `
            <div class="message-content">
                ${message}
            </div>
        `;
        sessionChatMessages.appendChild(userMessageElement);
        
        // Clear input
        sessionChatInput.value = '';
        
        // Scroll to bottom
        sessionChatMessages.scrollTop = sessionChatMessages.scrollHeight;
    }
});

// Video consultation demo
document.querySelectorAll('.book-session-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // First show booking modal
        bookingModal.style.display = 'block';
        
        // Add event listener to the confirm booking button
        const confirmButton = bookingModal.querySelector('.btn-primary');
        confirmButton.addEventListener('click', (e) => {
            e.preventDefault();
            bookingModal.style.display = 'none';
            
            // Show consultation immediately for demo purposes
            // In a real app, this would be scheduled
            videoConsultationModal.style.display = 'block';
            
            // Access user's camera for demo
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function(stream) {
                        const video = document.getElementById('video-stream');
                        video.srcObject = stream;
                    })
                    .catch(function(error) {
                        console.log("Could not access camera: " + error);
                    });
            }
        });
    });
});