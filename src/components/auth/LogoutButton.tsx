'use client';

import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export function LogoutButton() {
  return <button onClick={() => signOut(auth)}>Cerrar sesión</button>;
}
