'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

interface Props {
  toggleRegister: () => void;
}

export default function LoginForm({ toggleRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-sm p-6 rounded shadow"
      style={{
        background: 'linear-gradient(135deg, #0a0f25 0%, #121921 50%, #000000 100%)',
      }}
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded bg-neutral-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded bg-neutral-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
      />
      {error && <p className="mb-3 text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition disabled:opacity-50"
      >
        {loading ? 'Iniciando...' : 'Iniciar sesión'}
      </button>
    </div>
  );
}


