# MindfulHelp
 **MindfulHelp** is a comprehensive mental health support platform developed by **Hajar**. It empowers users through AI-driven emotional support, virtual consultations with professionals, self-help tools, and a safe community space. This project combines modern web technologies, intelligent NLP systems, and a user-first design to promote mental well-being and accessibility.

---

## 🌟 Features

### 💬 AI-Powered Chatbot
- Emotion-aware responses using natural language processing.
- Adapts tone and conversation style (therapist, friend, motivator).
- Tracks user mood over time and offers insights.

### 🧑‍⚕️ Professional Consultations
- Book sessions with licensed therapists.
- Integrated video calls with chat and scheduling support.

### 📚 Self-Help Resource Library
- Curated content: articles, exercises, and videos.
- Resources are categorized and searchable.
- Admins can manage content via full CRUD support.

### 🧑‍🤝‍🧑 Community Support Forums
- Safe, anonymous discussion boards for users to share and support.
- Browse, post, comment, and interact.
- Moderation features for safety and respect.

### 🚨 Emergency Help
- One-click access to local crisis hotlines and emergency support.
- Always visible in the UI for quick action.

---

## 🖥️ Frontend

**Tech Stack:** HTML • CSS • JavaScript

### Structure
- `index.html`: Main layout and navigation across features.
- `main.css`, `chatbot.css`, `video.css`: Modular styling for various components.
- `app.js`, `chatbot.js`, `modals.js`: Handles interactivity, chatbot logic, and dynamic content loading.

---

## 🔧 Backend

### 🐍 Flask (Python)
- Manages chatbot interactions and emotion analysis.
- Key API: `/chat` – processes user inputs and returns AI-generated replies.
- Components:
  - `EmotionDetector`: Uses NLP for sentiment/emotion classification.
  - `TherapyConversationEngine`: Generates contextual replies.

### 🌐 Node.js (JavaScript)
- Handles user management, authentication, and resource APIs.
- JWT-based auth system with hashed passwords (bcrypt).
- Connects to MongoDB for data persistence.

#### Structure:
- `routes/`: Defines endpoints (auth, user, resources).
- `controllers/`: Contains the business logic.
- `models/`: MongoDB schemas (e.g., User, Resource).
- `middleware/`: Auth verification and route protection.

---

## 🤖 Chatbot Intelligence

- **Emotion Detection**: Uses `spaCy` and `transformers` for NLP-based mood analysis.
- **Adaptive Conversations**: Changes tone/response style based on emotional state.
- **User Tracking**: Records emotional trends and provides long-term suggestions.

---

## 🗃️ Database (MongoDB)

**Collections:**
- `Users`: Profile info, emotional history, preferences.
- `Resources`: All articles, exercises, and videos.
- `Conversations`: Logs from chatbot for analysis and progress monitoring.

---

## ⚙️ Environment Variables

Create a `.env` file with the following:

```env
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

## 🚀 Getting Started

### Frontend
```bash
cd frontend
npm install -g http-server
http-server
```

### Flask Backend
```bash
cd mindfulhelp-flask
pip install -r requirements.txt
python app.py
```

### Node.js Backend
```bash
cd mindfulhelp-backend
npm install
node index.js
```

---

## 🔮 Future Plans
- Real-time group therapy chatrooms.
- Integration with wearable devices for mood prediction.
- Daily mood journaling and reminders.
- Gamified wellness challenges.

---

## 📜 License
MIT License

---

## 👩‍💻 Built With Love by Hajar

Feel free to fork, contribute, and share. Mental health matters — let’s build together. 💙
