'use client';

import { useAuth } from '@/context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from '@/components/auth/RegisterForm'; // Asegúrate de crear este componente
import { ReactNode, useState } from 'react';

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (loading) return <div>Cargando...</div>;
  if (user === null) {
    return (
      <div>
        {isRegistering ? <RegisterForm /> : <LoginForm />}
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="mt-4 underline text-blue-600"
        >
          {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
