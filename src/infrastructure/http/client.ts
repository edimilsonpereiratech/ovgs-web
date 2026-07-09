import axios from 'axios'
import { mapHttpError } from '@infrastructure/http/error-mapper'

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(mapHttpError(error)),
)
