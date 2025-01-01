from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from jose import jwt
from src.config import settings

class AuthMiddleware:
    def __init__(self, app: FastAPI, public_routes: list):
        self.app = app
        self.public_routes = public_routes

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            request = Request(scope, receive)
            path = request.url.path

            # Skip authentication for public routes
            if any(path.startswith(route) for route in self.public_routes):
                await self.app(scope, receive, send)
                return

            # Check Authorization header for private routes
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Missing or invalid Authorization header."}, 
                )
                await response(scope, receive, send)
                return

            token = auth_header.split(" ")[1]
            try:
                # Decode and validate the JWT token
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
                scope["user"] = payload  # Attach user info to the request scope
            except jwt.ExpiredSignatureError:
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Token has expired."},
                )
                await response(scope, receive, send)
                return
            except jwt.JWTError:
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Invalid token."},
                )
                await response(scope, receive, send)
                return

        await self.app(scope, receive, send)
