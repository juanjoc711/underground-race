// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Quitamos esta importación porque no existe realmente
// import { auth } from '@/auth';

const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const metadataPath = path.join(uploadsDir, 'metadata.json');

const ensureUploadsDirExists = async () => {
  try {
    await fs.access(uploadsDir);
    console.log(`Uploads directory exists: ${uploadsDir}`);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      try {
        await fs.mkdir(uploadsDir, { recursive: true });
        console.log(`Created directory: ${uploadsDir}`);
      } catch (mkdirError) {
        console.error(`Error creating directory ${uploadsDir}:`, mkdirError);
        throw new Error('Could not create upload directory.');
      }
    } else {
      console.error(`Error accessing directory ${uploadsDir}:`, error);
      throw new Error('Could not access upload directory.');
    }
  }
};

const readMetadata = async (): Promise<any[]> => {
  try {
    await fs.access(metadataPath);
    const data = await fs.readFile(metadataPath, 'utf-8');
    console.log("Successfully read metadata file.");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log("Metadata file not found. Will create a new one.");
      return [];
    }
    console.error("Error reading or parsing metadata:", error);
    return [];
  }
};

const writeMetadata = async (metadata: any[]) => {
  try {
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`Successfully wrote ${metadata.length} items to metadata.json.`);
  } catch (error) {
    console.error("Error writing metadata:", error);
    throw new Error('Failed to write metadata.');
  }
};

export async function POST(request: Request) {
  console.log("Received POST request to /api/upload");

  try {
    await ensureUploadsDirExists();

    // Quitamos la validación de usuario porque no hay auth en esta opción

    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const caption = formData.get('caption') as string | null;

    if (!imageFile) {
      console.error("Upload Error: No image file provided.");
      return NextResponse.json({ message: 'No image file provided.' }, { status: 400 });
    }

    console.log(`Received file: ${imageFile.name}, Type: ${imageFile.type}, Size: ${imageFile.size}`);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(imageFile.type)) {
      console.error(`Upload Error: Invalid file type - ${imageFile.type}`);
      return NextResponse.json({ message: 'Invalid file type.' }, { status: 400 });
    }

    if (imageFile.size > maxSize) {
      console.error(`Upload Error: File size exceeds limit - ${imageFile.size}`);
      return NextResponse.json({ message: 'File size exceeds limit.' }, { status: 400 });
    }

    const fileExtension = imageFile.name.split('.').pop() || 'jpg';
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(uploadsDir, uniqueFilename);
    const publicPath = `/uploads/${uniqueFilename}`;
    console.log(`Generated unique filename: ${uniqueFilename}, Public path: ${publicPath}`);

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    console.log("Converted image file to buffer.");

    await fs.writeFile(filePath, buffer);
    console.log(`File saved successfully to filesystem: ${filePath}`);

    console.log("Reading existing metadata...");
    const existingMetadata = await readMetadata();

    // Aquí usamos 'Anónimo' porque no tenemos usuario autenticado
    const newMetadataEntry = {
      id: uuidv4(),
      url: publicPath,
      alt: caption || `Uploaded image ${uniqueFilename}`,
      caption: caption || '',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Anónimo',
    };

    console.log("New metadata entry created:", newMetadataEntry);

    existingMetadata.push(newMetadataEntry);
    console.log("Writing updated metadata...");
    await writeMetadata(existingMetadata);

    console.log(`Upload process completed successfully for ${uniqueFilename}.`);
    return NextResponse.json({
      message: 'File uploaded successfully!',
      filePath: publicPath,
      caption,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
