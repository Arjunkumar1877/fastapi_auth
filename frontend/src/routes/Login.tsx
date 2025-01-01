import React, { useState } from 'react'
import { ErrorResponse, LoginForm, LoginResponse } from '../types/auth'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useWebStore } from '../store/authStore'
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AxiosError } from 'axios'

const Login = () => {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: ''
  })
  const navigate = useNavigate()
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { setAccessToken, fetchUser, setRefreshToken } = useWebStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([])
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await API.post<LoginResponse>('/auth/login', form) 
      console.log(response.data)
      setAccessToken(response.data.access_token)
      setRefreshToken(response.data.refresh_token)
      fetchUser()
      navigate('/')
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.log(axiosError.response?.data)
      if (axiosError.response?.data?.detail) {
        setErrors([axiosError.response.data.detail]);
      } else {
        setErrors(['An unknown error occurred']);
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={handleChange}
                  value={form.email}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={handleChange}
                  value={form.password}
                />
              </div>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center">
              {!isLoading ? (
                <Button type="submit">Sign in</Button>
              ) : (
                <Button disabled>
                  <Loader2 className="animate-spin" />
                  Please wait
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login