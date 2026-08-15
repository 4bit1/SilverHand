from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.advisor import router as advisor_router
from app.api.routes.customer import router as customer_router


app = FastAPI(
    title="ElderSkill AI Platform",
    description="AI-powered provider matching and advisor service",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# AI Advisor routes
app.include_router(
    advisor_router
)


# Customer service search routes
app.include_router(
    customer_router
)


@app.get("/")
def root():

    return {
        "service": "ElderSkill AI Platform",
        "status": "running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }