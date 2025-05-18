'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function RegisterForm() {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: name.trim(),
        });
      }

      // Opcional: limpiar formulario o redirigir después del registro
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    }
  };

  return (
    <div className="flex flex-col max-w-sm mx-auto p-4 border rounded shadow-sm">
      <input
        className="mb-3 px-3 py-2 border border-gray-300 rounded text-black"
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="mb-3 px-3 py-2 border border-gray-300 rounded text-black"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="mb-3 px-3 py-2 border border-gray-300 rounded text-black"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <input
        className="mb-3 px-3 py-2 border border-gray-300 rounded text-black"
        type="password"
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      {error && <p className="mb-3 text-red-600">{error}</p>}
      <button
        onClick={handleRegister}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Registrarse
      </button>
    </div>
  );
}


