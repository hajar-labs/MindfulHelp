// Check for authentication on page load
document.addEventListener('DOMContentLoaded', checkAuthStatus);

// Function to check if user is logged in
function checkAuthStatus() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        updateUIForLoggedInUser(userData);
    }
}

// Fetch resources from the backend
const fetchResources = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/resources');
        const data = await response.json();
        console.log(data);

        // Display resources in the UI
        const resourceList = document.getElementById('resource-list');
        if (resourceList) {
            resourceList.innerHTML = data.map(resource => `
                <li>
                    <h3>${resource.title}</h3>
                    <p>${resource.content}</p>
                </li>
            `).join('');
        }
    } catch (err) {
        console.error('Error fetching resources:', err);
        // Use fallback data if backend is not available
        useFallbackResources();
    }
};

// Fallback function for when backend is not available
function useFallbackResources() {
    console.log('Using fallback resources');
    const fallbackData = [
        { title: 'Understanding Anxiety', content: 'Anxiety is a normal emotion that can help us stay alert and focused...' },
        { title: 'Mindfulness Techniques', content: 'Mindfulness involves paying attention to the present moment...' },
        { title: 'Stress Management', content: 'Effective stress management helps you break the hold stress has on your life...' }
    ];
    
    const resourceList = document.getElementById('resource-list');
    if (resourceList) {
        resourceList.innerHTML = fallbackData.map(resource => `
            <li>
                <h3>${resource.title}</h3>
                <p>${resource.content}</p>
            </li>
        `).join('');
    }
}

// Add event listener to a button (if needed)
const fetchResourcesBtn = document.getElementById('fetch-resources');
if (fetchResourcesBtn) {
    fetchResourcesBtn.addEventListener('click', fetchResources);
}

// Signup Function
const signup = async (username, email, password) => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Signup successful:', data);
            alert('Signup successful! You can now login.');
            // Close the signup modal and open the login modal
            closeModal('signup-modal');
            openModal('login-modal');
        } else {
            console.error('Signup failed:', data.error);
            alert(`Signup failed: ${data.error}`);
        }
    } catch (err) {
        console.error('Error during signup:', err);
        alert('An error occurred during signup. Please try again.');
    }
};

// Login Function
const login = async (email, password) => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Login successful:', data);
            
            // Save token to localStorage
            localStorage.setItem('token', data.token);
            
            // Fetch user data
            try {
                const userResponse = await fetch('http://localhost:5000/api/users/profile', {
                    headers: {
                        'x-auth-token': data.token
                    }
                });
                
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    // Store user data in localStorage
                    localStorage.setItem('userData', JSON.stringify(userData));
                    
                    // Update UI to show logged-in state
                    updateUIForLoggedInUser(userData);
                    
                    // Close the login modal
                    closeModal('login-modal');
                    
                    // Show success message
                    alert('Login successful!');
                } else {
                    // If we can't get user data, use fallback
                    const fallbackUserData = {
                        username: email.split('@')[0],
                        email: email,
                        bio: 'User profile',
                        profilepic: ''
                    };
                    localStorage.setItem('userData', JSON.stringify(fallbackUserData));
                    updateUIForLoggedInUser(fallbackUserData);
                    closeModal('login-modal');
                    alert('Login successful!');
                }
            } catch (userErr) {
                // Fallback if user data fetch fails
                console.error('Error fetching user data:', userErr);
                const fallbackUserData = {
                    username: email.split('@')[0],
                    email: email,
                    bio: 'User profile',
                    profilepic: ''
                };
                localStorage.setItem('userData', JSON.stringify(fallbackUserData));
                updateUIForLoggedInUser(fallbackUserData);
                closeModal('login-modal');
                alert('Login successful!');
            }
        } else {
            console.error('Login failed:', data.error);
            alert(`Login failed: ${data.error}`);
        }
    } catch (err) {
        console.error('Error during login:', err);
        alert('An error occurred during login. Please try again.');
        
        // Fallback for development/testing - simulate login
        if (confirm('Backend server might be unavailable. Would you like to use a test account for development?')) {
            const testUserData = {
                username: 'TestUser',
                email: email || 'test@example.com',
                bio: 'This is a test account for development purposes',
                profilepic: '',
                moodHistory: [
                    { date: new Date(Date.now() - 6*24*60*60*1000), mood: 'good' },
                    { date: new Date(Date.now() - 5*24*60*60*1000), mood: 'great' },
                    { date: new Date(Date.now() - 4*24*60*60*1000), mood: 'okay' },
                    { date: new Date(Date.now() - 3*24*60*60*1000), mood: 'sad' },
                    { date: new Date(Date.now() - 2*24*60*60*1000), mood: 'okay' },
                    { date: new Date(Date.now() - 1*24*60*60*1000), mood: 'good' },
                    { date: new Date(), mood: 'great' }
                ],
                upcomingSessions: [
                    { therapist: 'Dr. Sarah Johnson', date: '2025-03-20', time: '10:00 AM' },
                    { therapist: 'Lisa Rodriguez', date: '2025-03-25', time: '2:00 PM' }
                ],
                bookmarkedResources: [
                    { title: 'Understanding Anxiety', type: 'article' },
                    { title: 'Guided Meditation for Stress Relief', type: 'video' },
                    { title: '5-Minute Grounding Exercise', type: 'exercise' }
                ]
            };
            localStorage.setItem('userData', JSON.stringify(testUserData));
            localStorage.setItem('token', 'test-token-for-development');
            updateUIForLoggedInUser(testUserData);
            closeModal('login-modal');
        }
    }
};

// Function to update UI for logged-in user
function updateUIForLoggedInUser(userData) {
    // Update navigation bar
    const navLinks = document.querySelector('.nav-links');
    
    // Remove login and signup buttons
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    if (loginBtn) loginBtn.parentElement.remove();
    if (signupBtn) signupBtn.parentElement.remove();
    
    // Add profile and logout buttons
    const profileLi = document.createElement('li');
    profileLi.innerHTML = `<button class="btn btn-primary" id="profile-btn">
        <i class="fas fa-user-circle"></i> ${userData.username}
    </button>`;
    
    const logoutLi = document.createElement('li');
    logoutLi.innerHTML = `<button class="btn btn-secondary" id="logout-btn">
        <i class="fas fa-sign-out-alt"></i> Logout
    </button>`;
    
    navLinks.appendChild(profileLi);
    navLinks.appendChild(logoutLi);
    
    // Add event listeners for new buttons
    document.getElementById('profile-btn').addEventListener('click', openProfileModal);
    document.getElementById('logout-btn').addEventListener('click', logout);
}

// Function to open profile modal
function openProfileModal() {
    // Create profile modal if it doesn't exist
    if (!document.getElementById('profile-modal')) {
        createProfileModal();
    }
    
    // Populate profile modal with user data
    populateProfileModal();
    
    // Show the modal
    document.getElementById('profile-modal').style.display = 'block';
}

// Function to create profile modal
function createProfileModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'profile-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <div class="modal-header">
                <h2>Your Profile</h2>
            </div>
            <div class="profile-content">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <i class="fas fa-user-circle fa-5x"></i>
                    </div>
                    <div class="profile-info">
                        <h3 id="profile-username">Username</h3>
                        <p id="profile-email">email@example.com</p>
                        <p id="profile-bio">Bio information</p>
                    </div>
                </div>
                
                <div class="profile-tabs">
                    <button class="profile-tab-btn active" data-tab="activity">Activity</button>
                    <button class="profile-tab-btn" data-tab="sessions">Upcoming Sessions</button>
                    <button class="profile-tab-btn" data-tab="bookmarks">Bookmarked Resources</button>
                    <button class="profile-tab-btn" data-tab="settings">Settings</button>
                </div>
                
                <div class="profile-tab-content active" id="activity-tab">
                    <h3>Recent Activity</h3>
                    <div class="mood-history-chart">
                        <h4>Your Mood History</h4>
                        <div class="chart-container" id="mood-chart">
                            <!-- Mood chart will be populated here -->
                        </div>
                    </div>
                    <div class="recent-interactions">
                        <h4>Recent Interactions</h4>
                        <ul id="recent-interactions-list">
                            <!-- Will be populated with data -->
                        </ul>
                    </div>
                </div>
                
                <div class="profile-tab-content" id="sessions-tab">
                    <h3>Upcoming Sessions</h3>
                    <div id="upcoming-sessions-list">
                        <!-- Will be populated with data -->
                    </div>
                    <button class="btn btn-primary" id="book-new-session-btn">Book New Session</button>
                </div>
                
                <div class="profile-tab-content" id="bookmarks-tab">
                    <h3>Bookmarked Resources</h3>
                    <div id="bookmarked-resources-list">
                        <!-- Will be populated with data -->
                    </div>
                </div>
                
                <div class="profile-tab-content" id="settings-tab">
                    <h3>Account Settings</h3>
                    <form id="profile-settings-form">
                        <div class="form-group">
                            <label for="settings-username">Username</label>
                            <input type="text" id="settings-username">
                        </div>
                        <div class="form-group">
                            <label for="settings-email">Email</label>
                            <input type="email" id="settings-email">
                        </div>
                        <div class="form-group">
                            <label for="settings-bio">Bio</label>
                            <textarea id="settings-bio"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for the modal
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Tab switching functionality
    const tabBtns = modal.querySelectorAll('.profile-tab-btn');
    const tabContents = modal.querySelectorAll('.profile-tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(tb => tb.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            btn.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Book new session button
    document.getElementById('book-new-session-btn').addEventListener('click', () => {
        modal.style.display = 'none';
        document.getElementById('booking-modal').style.display = 'block';
    });
    
    // Settings form submission
    document.getElementById('profile-settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userData = JSON.parse(localStorage.getItem('userData'));
        userData.username = document.getElementById('settings-username').value;
        userData.email = document.getElementById('settings-email').value;
        userData.bio = document.getElementById('settings-bio').value;
        
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Update UI
        document.getElementById('profile-username').textContent = userData.username;
        document.getElementById('profile-email').textContent = userData.email;
        document.getElementById('profile-bio').textContent = userData.bio;
        
        // Update nav bar
        document.getElementById('profile-btn').innerHTML = `<i class="fas fa-user-circle"></i> ${userData.username}`;
        
        alert('Profile updated successfully!');
    });
    
    // Add CSS for the profile modal
    const style = document.createElement('style');
    style.textContent = `
        .profile-content {
            padding: 20px 0;
        }
        
        .profile-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .profile-avatar {
            margin-right: 20px;
            color: var(--primary-color);
        }
        
        .profile-info h3 {
            margin-bottom: 5px;
            color: var(--primary-color);
        }
        
        .profile-tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
        }
        
        .profile-tab-btn {
            padding: 10px 15px;
            background: none;
            border: none;
            cursor: pointer;
            font-weight: 500;
            color: #666;
        }
        
        .profile-tab-btn.active {
            color: var(--primary-color);
            border-bottom: 2px solid var(--primary-color);
        }
        
        .profile-tab-content {
            display: none;
        }
        
        .profile-tab-content.active {
            display: block;
        }
        
        .mood-history-chart {
            margin-bottom: 30px;
        }
        
        .chart-container {
            display: flex;
            align-items: flex-end;
            height: 200px;
            margin-top: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        
        .chart-bar {
            flex: 1;
            background-color: var(--primary-color);
            margin: 0 5px;
            position: relative;
            min-height: 20px;
            border-radius: 3px 3px 0 0;
        }
        
        .chart-bar span {
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.8rem;
        }
        
        #upcoming-sessions-list, #bookmarked-resources-list, #recent-interactions-list {
            margin-top: 20px;
        }
        
        .session-card, .resource-card, .interaction-item {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .session-card h4, .resource-card h4 {
            margin-bottom: 5px;
            color: var(--primary-color);
        }
        
        #book-new-session-btn {
            margin-top: 20px;
        }
    `;
    
    document.head.appendChild(style);
}

// Function to populate profile modal with user data
function populateProfileModal() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) return;
    
    // Update basic info
    document.getElementById('profile-username').textContent = userData.username;
    document.getElementById('profile-email').textContent = userData.email;
    document.getElementById('profile-bio').textContent = userData.bio || 'No bio provided';
    
    // Populate settings form
    document.getElementById('settings-username').value = userData.username;
    document.getElementById('settings-email').value = userData.email;
    document.getElementById('settings-bio').value = userData.bio || '';
    
    // Populate mood chart
    const moodChart = document.getElementById('mood-chart');
    moodChart.innerHTML = '';
    
    if (userData.moodHistory && userData.moodHistory.length > 0) {
        // Sort mood history by date
        const sortedMoodHistory = [...userData.moodHistory].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );
        
        // Get the last 7 entries or fewer if not available
        const recentMoods = sortedMoodHistory.slice(-7);
        
        // Create mood bars
        recentMoods.forEach(moodEntry => {
            const date = new Date(moodEntry.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            // Convert mood to height percentage
            let heightPercentage;
            switch(moodEntry.mood) {
                case 'awful': heightPercentage = 20; break;
                case 'sad': heightPercentage = 40; break;
                case 'okay': heightPercentage = 60; break;
                case 'good': heightPercentage = 80; break;
                case 'great': heightPercentage = 100; break;
                default: heightPercentage = 50;
            }
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${heightPercentage}%`;
            bar.innerHTML = `<span>${dayName}</span>`;
            moodChart.appendChild(bar);
        });
    } else {
        // Create placeholder bars if no mood history
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${Math.random() * 80 + 20}%`;
            bar.innerHTML = `<span>${dayName}</span>`;
            moodChart.appendChild(bar);
        }
    }
    
    // Populate upcoming sessions
    const sessionsContainer = document.getElementById('upcoming-sessions-list');
    sessionsContainer.innerHTML = '';
    
    if (userData.upcomingSessions && userData.upcomingSessions.length > 0) {
        userData.upcomingSessions.forEach(session => {
            const sessionCard = document.createElement('div');
            sessionCard.className = 'session-card';
            sessionCard.innerHTML = `
                <h4>${session.therapist}</h4>
                <p><i class="fas fa-calendar"></i> ${session.date} at ${session.time}</p>
                <button class="btn btn-secondary btn-sm">Reschedule</button>
                <button class="btn btn-danger btn-sm">Cancel</button>
            `;
            sessionsContainer.appendChild(sessionCard);
        });
    } else {
        sessionsContainer.innerHTML = '<p>No upcoming sessions. Book a session with one of our professionals.</p>';
    }
    
    // Populate bookmarked resources
    const resourcesContainer = document.getElementById('bookmarked-resources-list');
    resourcesContainer.innerHTML = '';
    
    if (userData.bookmarkedResources && userData.bookmarkedResources.length > 0) {
        userData.bookmarkedResources.forEach(resource => {
            const resourceCard = document.createElement('div');
            resourceCard.className = 'resource-card';
            
            let icon;
            switch(resource.type) {
                case 'article': icon = 'fa-file-alt'; break;
                case 'video': icon = 'fa-video'; break;
                case 'exercise': icon = 'fa-dumbbell'; break;
                default: icon = 'fa-bookmark';
            }
            
            resourceCard.innerHTML = `
                <h4><i class="fas ${icon}"></i> ${resource.title}</h4>
                <button class="btn btn-secondary btn-sm">View</button>
                <button class="btn btn-danger btn-sm">Remove</button>
            `;
            resourcesContainer.appendChild(resourceCard);
        });
    } else {
        resourcesContainer.innerHTML = '<p>No bookmarked resources. Browse our resources section to find helpful content.</p>';
    }
    
    // Populate recent interactions
    const interactionsContainer = document.getElementById('recent-interactions-list');
    interactionsContainer.innerHTML = `
        <li class="interaction-item">
            <p><strong>Chatbot Conversation</strong> - Today</p>
            <p>You discussed stress management techniques</p>
        </li>
        <li class="interaction-item">
            <p><strong>Resource Viewed</strong> - Yesterday</p>
            <p>Understanding Anxiety: Causes and Coping Mechanisms</p>
        </li>
        <li class="interaction-item">
            <p><strong>Mood Logged</strong> - 2 days ago</p>
            <p>You reported feeling "Good"</p>
        </li>
    `;
}

// Logout function
function logout() {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Reload the page to reset UI
    window.location.reload();
}

// Close Modal Function
const closeModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
};

// Open Modal Function
const openModal = (modalId) => {
    document.getElementById(modalId).style.display = 'block';
};

// Add event listeners to close buttons
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal.id);
    });
});

// Add event listeners to switch links
document.getElementById('switch-to-signup').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default link behavior
    closeModal('login-modal');
    openModal('signup-modal');
});

document.getElementById('switch-to-login').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default link behavior
    closeModal('signup-modal');
    openModal('login-modal');
});

// Add event listener to the login form
document.getElementById('login-modal').querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await login(email, password); // Call the login function
});

// Add event listener to the signup form
document.getElementById('signup-modal').querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    const username = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    await signup(username, email, password); // Call the signup function
});
