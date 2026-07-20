from fastapi import FastAPI

app = FastAPI(
    title="AI Game Arena API",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "AI Game Arena Backend Running"
    }