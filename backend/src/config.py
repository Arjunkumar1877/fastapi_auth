from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 3
    REFRESH_TOKEN_EXPIRE_SECONDS: int = 5  

    DATABASE_URL: str

    class Config: 
        env_file = ".env"  
        extra = "allow"

settings = Settings()