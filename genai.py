from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile, os, uuid, warnings

import librosa
import numpy as np
import google.generativeai as genai
import whisper
from gtts import gTTS

from predict import predict_emotion  
import os
from dotenv import load_dotenv
load_dotenv()

# CONFIG
warnings.filterwarnings("ignore", message="TypedStorage is deprecated")

app = Flask(__name__, static_folder="static")
CORS(app, resources={r"/*": {"origins": "*"}})

# Gemini API key setup
gemini_api_key = os.getenv("GEMINI_API_KEY")

if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY not set!")

genai.configure(api_key=gemini_api_key)

# Load Whisper once
whisper_model = whisper.load_model("base")


# AUDIO EMOTION UTILS 
def analyze_emotion(audio_path):
    """
    Analyzes the emotion from an audio file based on acoustic features.
    """
    try:
        y, sr = librosa.load(audio_path, sr=None)

        energy = np.sum(y**2) / len(y)
        pitch = librosa.yin(
            y=y, fmin=librosa.note_to_hz("C2"), fmax=librosa.note_to_hz("C7")
        )
        mean_pitch = np.nanmean(pitch) if np.any(np.isfinite(pitch)) else 0

        emotion = "calm"
        if energy > 0.1:
            if mean_pitch > 150:
                emotion = "energetic"
            else:
                emotion = "tense"
        elif energy < 0.05:
            if 0 < mean_pitch < 120:
                emotion = "calm"
            else:
                emotion = "sad"
        else:
            emotion = "neutral"
        return emotion
    except Exception as e:
        print(f"Error in emotion analysis: {e}")
        return "neutral"


# API ENDPOINTS
@app.route("/analyze", methods=["POST"])
def analyze():
    user_text = None
    emotion = "neutral"

    # TEXT INPUT
    if request.is_json:
        data = request.get_json()
        user_text = data.get("text")
        if not user_text:
            return jsonify({"error": "No text provided in JSON"}), 400

    # AUDIO INPUT 
    elif "file" in request.files and request.files["file"].mimetype.startswith("audio"):
        file = request.files["file"]
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            file.save(tmp.name)
            wav_path = tmp.name

        try:
            user_text = whisper_model.transcribe(wav_path)["text"]
            emotion = analyze_emotion(wav_path)
        finally:
            if os.path.exists(wav_path):
                os.remove(wav_path)

    # FACE DETECTION
    elif "file" in request.files and request.files["file"].mimetype.startswith("image"):
        file = request.files["file"]
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            file.save(tmp.name)
            img_path = tmp.name

        try:
            emotion = predict_emotion(img_path)
            user_text = f"My face shows {emotion}"
        finally:
            if os.path.exists(img_path):
                os.remove(img_path)

    else:
        return jsonify({"error": "Invalid input. Provide text JSON, audio, or image."}), 400

    # GEMINI RESPONSE
    prompt = f"""
    The user said or expressed: "{user_text}".
    Detected emotion: {emotion}.
    Respond briefly, empathetically, and supportively.
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        reply = response.text.strip() if response.text else "I'm here for you."
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # TEXT TO SPEECH
    os.makedirs(app.static_folder, exist_ok=True)
    audio_filename = f"{uuid.uuid4()}.mp3"
    audio_path_out = os.path.join(app.static_folder, audio_filename)

    tts = gTTS(reply)
    tts.save(audio_path_out)

    return jsonify(
        {
            "transcript": user_text,
            "response": reply,
            "audio_url": f"/static/{audio_filename}",
            "emotion": emotion,
        }
    )


@app.route("/api/analyze-sentiment", methods=["POST"])
def analyze_sentiment():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "Text is required."}), 400

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"""Analyze the sentiment of the following text and categorize it as a single emotion 
        from this list: Happy, Sad, Angry, Stressed, Depressed, Carefree, Emotional, or Neutral. 
        Provide only the emotion word. 
        Text: "{text}" """
        response = model.generate_content(prompt)
        emotion = response.text.strip()
        return jsonify({"emotion": emotion}), 200
    except Exception as e:
        print("Gemini API error:", e)
        return jsonify({"error": "Failed to analyze emotion."}), 500


@app.route("/api/analyze-face", methods=["POST"])
def analyze_face():
    if "file" not in request.files:
        return jsonify({"error": "Image file required"}), 400

    file = request.files["file"]
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        file.save(tmp.name)
        img_path = tmp.name

    try:
        emotion = predict_emotion(img_path)
        return jsonify({"emotion": emotion}), 200
    finally:
        if os.path.exists(img_path):
            os.remove(img_path)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
