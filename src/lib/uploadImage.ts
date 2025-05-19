import { storage } from '@/firebaseConfig'; // tu ruta puede variar
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Sube una imagen a Firebase Storage
 * @param file - Archivo a subir
 * @param path - Ruta opcional (por defecto: 'uploads/')
 * @returns URL pública de la imagen
 */
export const uploadImage = async (file: File, path = 'uploads/'): Promise<string> => {
  const storageRef = ref(storage, `${path}${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
