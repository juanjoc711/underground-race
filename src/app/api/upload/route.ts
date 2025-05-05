// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the path to the uploads directory within the public folder
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

// Ensure the uploads directory exists
const ensureUploadsDirExists = async () => {
  try {
    await fs.access(uploadsDir);
  } catch (error: any) {
    // If directory doesn't exist (ENOENT error), create it
    if (error.code === 'ENOENT') {
      try {
        await fs.mkdir(uploadsDir, { recursive: true });
        console.log(`Created directory: ${uploadsDir}`);
      } catch (mkdirError) {
        console.error(`Error creating directory ${uploadsDir}:`, mkdirError);
        throw new Error('Could not create upload directory.'); // Re-throw specific error
      }
    } else {
      // If it's another error (e.g., permissions), re-throw it
      console.error(`Error accessing directory ${uploadsDir}:`, error);
      throw new Error('Could not access upload directory.');
    }
  }
};

export async function POST(request: Request) {
  try {
    // Ensure the target directory exists before processing the upload
    await ensureUploadsDirExists();

    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const caption = formData.get('caption') as string | null;

    if (!imageFile) {
      return NextResponse.json({ message: 'No image file provided.' }, { status: 400 });
    }

    // Validate file type and size again on the server
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json({ message: 'Invalid file type.' }, { status: 400 });
    }
    if (imageFile.size > maxSize) {
      return NextResponse.json({ message: 'File size exceeds limit.' }, { status: 400 });
    }

    // Generate a unique filename
    const fileExtension = imageFile.name.split('.').pop() || 'jpg'; // Fallback extension
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(uploadsDir, uniqueFilename);
    const publicPath = `/uploads/${uniqueFilename}`; // Path relative to the public folder

    // Convert the file data to a Buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Write the file to the filesystem
    await fs.writeFile(filePath, buffer);

    // --- Metadata Storage (Simple JSON file example) ---
    // In a real app, use a database. This is a basic example.
    const metadataPath = path.join(uploadsDir, 'metadata.json');
    let existingMetadata: any[] = [];
    try {
        const data = await fs.readFile(metadataPath, 'utf-8');
        existingMetadata = JSON.parse(data);
    } catch (error: any) {
        if (error.code !== 'ENOENT') {
            console.error("Error reading metadata:", error);
            // Decide how to handle: maybe continue without saving metadata?
        }
        // If file doesn't exist, existingMetadata remains empty, which is fine.
    }

    existingMetadata.push({
        id: uuidv4(),
        url: publicPath,
        alt: caption || `Uploaded image ${uniqueFilename}`, // Use caption for alt text
        caption: caption || '',
        uploadedAt: new Date().toISOString(),
    });

    try {
        await fs.writeFile(metadataPath, JSON.stringify(existingMetadata, null, 2));
    } catch (error) {
        console.error("Error writing metadata:", error);
        // Decide how to handle: maybe delete the uploaded image?
    }
    // --- End Metadata Storage ---

    console.log(`File saved successfully: ${filePath}`);
    return NextResponse.json({
      message: 'File uploaded successfully!',
      filePath: publicPath, // Return the public path
      caption: caption,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
