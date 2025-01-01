from pydantic import BaseModel, EmailStr


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str 

class TokenData(BaseModel):
    id: int

class TokenRequest(BaseModel):
    token: str

class RefrestTokenRequest(BaseModel):  
    refresh_token: str