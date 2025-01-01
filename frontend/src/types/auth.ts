export interface LoginForm {
    email: string
    password: string
}

export interface RegisterForm extends LoginForm {
    first_name: string
    last_name: string
}

export interface User {
    id: number
    email: string
    first_name: string
    last_name: string
    is_active: boolean
    is_admin: boolean
}

export interface Token {
    access_token: string
    refresh_token: string
    token_type: string
}

export interface ProfileUpdate {
    first_name: string;
    last_name: string;
    email: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
  }
  
export interface ErrorResponse {
    detail?: string;
  }