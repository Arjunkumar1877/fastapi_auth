import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '../types/auth'
import API from '../api/axios'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<RegisterForm>({
      first_name: '',
      last_name: '',
      email: '',
      password: ''
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrors([])
      setForm({
          ...form,
          [e.target.name]: e.target.value
      })  
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
          const response = await API.post('/users/register', form) 
          console.log(response.data)
          navigate('/login')
      } catch (error: any) {
          console.log(error)
          if (error.response?.data?.detail) {
              setErrors([error.response.data.detail]) 
          } else {
              setErrors(['An unknown error occurred'])
          }
      } finally {
          setIsLoading(false)
      }
  }
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Register your account
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                First name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    autoComplete="first_name"
                                    required
                                    onChange={handleChange}
                                    value={form.first_name}
                                    className="input-class w-full border-gray-300 rounded-md border border-gray-300 p-2 rounded"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                Last name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    autoComplete="last_name"
                                    required
                                    onChange={handleChange}
                                    value={form.last_name}
                                    className="input-class w-full border-gray-300 rounded-md border border-gray-300 p-2 rounded"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    onChange={handleChange}
                                    value={form.email}
                                    className="input-class w-full border-gray-300 rounded-md border border-gray-300 p-2 rounded"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    onChange={handleChange}
                                    value={form.password}
                                    className="input-class w-full border-gray-300 rounded-md border border-gray-300 p-2 rounded"
                                />
                            </div>
                        </div>
                        {errors.length > 0 && (
                            <div className="text-red-500">
                                {errors.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-center">
                        {!isLoading ? (
                            <Button type="submit">Register</Button>
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

export default Register
