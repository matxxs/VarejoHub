'use client' // Componente de Cliente

import React from 'react'
import { QueryProvider } from './QueryProvider'
import { AuthProvider } from '../auth/AuthProvider'
import { DataProvider } from '../contexts/DataContext'
import { SalesProvider } from '../contexts/SalesContext'



export const MainProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <DataProvider>
          <SalesProvider>
            {children}
          </SalesProvider>
        </DataProvider>
      </AuthProvider>
    </QueryProvider>
  )
}