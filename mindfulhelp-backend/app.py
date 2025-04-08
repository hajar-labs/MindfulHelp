%%app
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import EmotionDetector, TherapyConversationEngine  # Import classes from chatbot.py

app = Flask(__name__)
CORS(app)

# Initialize the EmotionDetector and TherapyConversationEngine
emotion_detector = EmotionDetector()
conversation_engine = TherapyConversationEngine()

@app.route('/')
def home():
    return "Welcome to the Flask Chatbot API!"

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    
    # Step 1: Detect emotion
    emotion_profile = emotion_detector.detect_emotion(user_message)
    
    # Step 2: Generate a response using the conversation engine
    bot_response = conversation_engine.generate_response(emotion_profile, user_message)
    
    # Step 3: Return the response
    return jsonify({
        'response': bot_response,
        'emotion_profile': emotion_profile  # Optional: Include emotion analysis in the response
    })

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)