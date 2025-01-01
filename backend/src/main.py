from src.middleware import AuthMiddleware
from fastapi import FastAPI
from src.user.routes import router as user_router
from src.auth.routes import router as auth_router
from src.task.routes import router as task_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(user_router)
app.include_router(auth_router)
app.include_router(task_router)

origins = [
    "http://localhost:5173",
]
public_routes = ["/auth/login", "/users/register", "/auth/token/refresh", "/docs", "/openapi.json", "/static"]

app.add_middleware(AuthMiddleware, public_routes=public_routes)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow credentials (cookies, authorization headers)
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
) 