'use client' // Componente de Cliente

import React from 'react'
import { QueryProvider } from './QueryProvider'
import { AuthProvider } from '../auth/AuthProvider'



export const MainProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  )
}