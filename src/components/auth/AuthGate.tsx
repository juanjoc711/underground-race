'use client';

import { useAuth } from '@/context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { ReactNode, useState } from 'react';

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (loading) return <div>Cargando...</div>;

  if (user === null) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{
          background: 'linear-gradient(135deg, #0a0f25 0%, #121921 50%, #000000 100%)',
        }}
      >
        {/* Título */}
        <h1 className="text-white text-3xl font-bold mb-4 text-center">
          UNDERGROUNDRACE
        </h1>

        {/* Logo */}
        <div className="mb-6">
          <img
            src="/imagenes/FotoFondo.jpeg"
            alt="Logo"
            className="mx-auto h-24 w-auto object-contain"
          />
        </div>

        {/* Formulario */}
        <div className="w-full max-w-sm">
          {isRegistering ? (
            <RegisterForm toggleRegister={() => setIsRegistering(false)} />
          ) : (
            <LoginForm toggleRegister={() => setIsRegistering(true)} />
          )}
        </div>

        {/* Texto para cambiar entre login y registro, fuera del cuadro */}
        <div className="mt-4 text-white underline cursor-pointer" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

