from deepface import DeepFace
from utils import map_emotion

def predict_emotion(img_path: str) -> str:
    """
    Predict emotion for an image file and map it to custom categories.
    """
    try:
        result = DeepFace.analyze(img_path=img_path, actions=['emotion'], enforce_detection=False)
        # DeepFace returns a dict inside a list sometimes
        if isinstance(result, list):
            result = result[0]

        dominant_emotion = result["dominant_emotion"]
        mapped_emotion = map_emotion(dominant_emotion)
        return mapped_emotion
    except Exception as e:
        print(f"Prediction failed: {e}")
        return "Carefree"
