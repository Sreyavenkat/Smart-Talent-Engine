from sentence_transformers import SentenceTransformer

# load once (VERY IMPORTANT)
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str):
    return model.encode(text)