import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from '@/lib/cloudinary';


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const caption = formData.get('caption') as string | null;
    const uploadedBy = formData.get('uploadedBy') as string | null || 'Anónimo';

    if (!imageFile) {
      return NextResponse.json({ message: 'No image file provided.' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json({ message: 'Invalid file type.' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return NextResponse.json({ message: 'File size exceeds limit.' }, { status: 400 });
    }

    // Convertir a buffer para subir a Cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<{ url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'underground-race' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      ).end(buffer);
    });

    const metadata = {
      id: uuidv4(),
      url: uploadResult.url,
      caption: caption || '',
      alt: caption || 'Uploaded image',
      uploadedAt: new Date().toISOString(),
      uploadedBy,
    };

    return NextResponse.json({
      message: 'Image uploaded successfully!',
      metadata,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

