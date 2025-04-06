import apiClient from './apiClient'

interface SignInCredentials {
  username: string
  password: string
}

interface SignInResponse {
  access_token: string
  user: {
    id: number
    roles: number[]
    full_name: string
  }
}

export async function signin(credentials: SignInCredentials): Promise<SignInResponse> {
  try {
    const response = await apiClient.post<SignInResponse>('/signin', credentials)
    return response.data
  } catch (err) {
    // TODO: tratar os erros mlhor aqqui
    console.error(err)
    throw err
  }
}

// TODO: logout, precisa fazer no back primeiro
