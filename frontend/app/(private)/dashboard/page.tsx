'use client'

import React from 'react'
import { useRouter } from 'next/navigation' 
import { useAuth } from '@/src/auth/AuthProvider'
import { LogOut } from 'lucide-react'

export default function DashboardPage() {
  const { logout, userData } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout() 
    router.push('/')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 border-b pb-2">
        Painel de Controle (Dashboard)
      </h1>

      {/* Exibição das Informações do Usuário */}
      <div className="space-y-4 mb-8 p-4 border rounded-lg bg-indigo-50/50">
        <h2 className="text-xl font-semibold text-indigo-700">Detalhes da Conta</h2>
        
        {userData ? (
          <>
            <p className="text-gray-700">
              <strong className="font-medium text-gray-900">Email:</strong>{' '}
              {/* Assumindo que 'email' existe no UserTokenData */}
              <span className="font-medium text-indigo-600">
                {userData.email || 'N/A'} 
              </span>
            </p>
            {/* Você pode adicionar mais campos aqui se eles existirem em UserTokenData */}
            {userData.acessLevel && (
                <p className="text-gray-700">
                    <strong className="font-medium text-gray-900">Nível de Acesso (Role):</strong>{' '}
                    <span className="bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full text-xs">
                        {userData.acessLevel}
                    </span>
                </p>
            )}
          </>
        ) : (
          <p className="text-red-500 font-medium">Informações do usuário não carregadas.</p>
        )}
      </div>

      {/* Botão de Logout Ajustado */}
      <button 
        onClick={handleLogout} 
        className="flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 hover:bg-red-700 shadow-md"
      >
        <LogOut className="w-5 h-5" />
        Sair (Logout) e Voltar
      </button>
    </div>
  )
}