// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define the path to the uploads directory within the public folder
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
const metadataPath = path.join(uploadsDir, 'metadata.json');


// Ensure the uploads directory exists
const ensureUploadsDirExists = async () => {
  try {
    await fs.access(uploadsDir);
     console.log(`Uploads directory exists: ${uploadsDir}`);
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

// Function to read metadata safely
const readMetadata = async (): Promise<any[]> => {
    try {
        await fs.access(metadataPath); // Check if file exists first
        const data = await fs.readFile(metadataPath, 'utf-8');
        console.log("Successfully read metadata file.");
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log("Metadata file not found. Will create a new one.");
            return []; // File doesn't exist, return empty array
        }
        console.error("Error reading or parsing metadata:", error);
        // In case of parsing errors or other read errors, return empty to avoid data loss,
        // but log the error. Consider more robust error handling/backup strategy here for production.
        return [];
    }
};

// Function to write metadata safely
const writeMetadata = async (metadata: any[]) => {
    try {
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        console.log(`Successfully wrote ${metadata.length} items to metadata.json.`);
    } catch (error) {
        console.error("Error writing metadata:", error);
        // Decide how to handle: maybe delete the uploaded image if metadata fails?
        // For now, we just log the error.
        throw new Error('Failed to write metadata.'); // Propagate error
    }
};


export async function POST(request: Request) {
  console.log("Received POST request to /api/upload");
  try {
    // Ensure the target directory exists before processing the upload
    await ensureUploadsDirExists();

    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const caption = formData.get('caption') as string | null;

    if (!imageFile) {
        console.error("Upload Error: No image file provided.");
      return NextResponse.json({ message: 'No image file provided.' }, { status: 400 });
    }
     console.log(`Received file: ${imageFile.name}, Type: ${imageFile.type}, Size: ${imageFile.size}`);


    // Validate file type and size again on the server
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(imageFile.type)) {
        console.error(`Upload Error: Invalid file type - ${imageFile.type}`);
      return NextResponse.json({ message: 'Invalid file type.' }, { status: 400 });
    }
    if (imageFile.size > maxSize) {
        console.error(`Upload Error: File size exceeds limit - ${imageFile.size}`);
      return NextResponse.json({ message: 'File size exceeds limit.' }, { status: 400 });
    }

    // Generate a unique filename
    const fileExtension = imageFile.name.split('.').pop() || 'jpg'; // Fallback extension
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(uploadsDir, uniqueFilename);
    const publicPath = `/uploads/${uniqueFilename}`; // Path relative to the public folder
    console.log(`Generated unique filename: ${uniqueFilename}, Public path: ${publicPath}`);


    // Convert the file data to a Buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());
     console.log("Converted image file to buffer.");


    // Write the file to the filesystem
    await fs.writeFile(filePath, buffer);
    console.log(`File saved successfully to filesystem: ${filePath}`);


    // --- Metadata Storage ---
    console.log("Reading existing metadata...");
    let existingMetadata = await readMetadata(); // Read safely


    const newMetadataEntry = {
      id: uuidv4(),
      url: publicPath,
      alt: caption || `Uploaded image ${uniqueFilename}`, // Use caption for alt text
      caption: caption || '',
      uploadedAt: new Date().toISOString(),
    };
     console.log("New metadata entry created:", newMetadataEntry);


    existingMetadata.push(newMetadataEntry);

    console.log("Writing updated metadata...");
    await writeMetadata(existingMetadata); // Write safely
    // --- End Metadata Storage ---

    console.log(`Upload process completed successfully for ${uniqueFilename}.`);
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
