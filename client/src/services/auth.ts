const TEST_CREDENTIALS = {
  email: 'test@example.com',
  password: 'test123'
}

export const authService = {
  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        const isValid = email === TEST_CREDENTIALS.email && 
                       password === TEST_CREDENTIALS.password
        if (isValid) {
          localStorage.setItem('isAuthenticated', 'true')
        }
        resolve(isValid)
      }, 500)
    })
  },

  logout() {
    localStorage.removeItem('isAuthenticated')
  },

  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true'
  }
} 