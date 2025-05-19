'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

interface Props {
  toggleRegister: () => void;
}

export default function RegisterForm({ toggleRegister }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);

    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name.trim(),
        });
      }

      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    }
  };

  return (
    <div className="w-full max-w-sm p-6 rounded shadow">
      <div className="flex flex-col space-y-3">
        <input
          className="bg-[#2a2a2a] text-gray-200 placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none"
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="bg-[#2a2a2a] text-gray-200 placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="bg-[#2a2a2a] text-gray-200 placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <input
          className="bg-[#2a2a2a] text-gray-200 placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none"
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleRegister}
          className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition disabled:opacity-50"
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}


