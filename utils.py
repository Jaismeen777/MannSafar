custom_mapping = {
    "angry": "Angry",
    "disgust": "Demotivated",
    "fear": "Tensed",
    "happy": "Happy",
    "sad": "Lonely",
    "surprise": "Curious",
    "neutral": "Carefree"
}

def map_emotion(deepface_emotion: str) -> str:
    """
    Maps DeepFace's detected emotion into our custom emotion categories.
    """
    return custom_mapping.get(deepface_emotion.lower(), "Carefree")
