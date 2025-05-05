// src/components/features/photo-upload.tsx
"use client";

import * as React from 'react'; // Added React import
import { useState, useRef } from 'react'; // Combined React hooks
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { v4 as uuidv4 } from 'uuid'; // Keep uuid import
import { useRouter } from 'next/navigation'; // Keep useRouter
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  image: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  caption: z.string().max(150, "Caption cannot exceed 150 characters.").optional(),
});

type PhotoUploadFormValues = z.infer<typeof formSchema>;

// Helper function to read file as Data URL (still needed for preview)
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


export default function PhotoUpload() {
  const router = useRouter(); // Initialize router
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  // Ref for file input to allow clearing
  const fileInputRef = useRef<HTMLInputElement>(null);


  const form = useForm<PhotoUploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: '',
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        setPreview(dataUrl);
         // Manually set value for RHF and trigger validation
        form.setValue('image', event.target.files as FileList, { shouldValidate: true });
      } catch (error) {
        console.error("Error reading file:", error);
        setPreview(null);
        // Clear RHF value if preview fails
        form.setValue('image', new DataTransfer().files, { shouldValidate: true });
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not generate image preview.",
        });
      }
    } else {
      setPreview(null);
       // Clear RHF value if file is invalid
      form.setValue('image', new DataTransfer().files, { shouldValidate: true });
      // Trigger validation manually if file is invalid or cleared
      form.trigger('image');
    }
  };

  const onSubmit = async (values: PhotoUploadFormValues) => {
    setIsSubmitting(true);

    const file = values.image[0];
    const caption = values.caption;

    if (!file) {
       toast({
         variant: 'destructive',
         title: 'No File Selected',
         description: 'Please select an image to upload.',
       });
       setIsSubmitting(false);
       return;
    }

    // Create FormData to send file and caption
    const formData = new FormData();
    formData.append('image', file);
    if (caption) {
      formData.append('caption', caption);
    }

    try {
      // Send data to the API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        // No 'Content-Type' header needed, browser sets it for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);

      toast({
        title: "Photo Uploaded!",
        description: "Your ride has been added to the gallery.",
      });

      form.reset(); // Reset form fields
      setPreview(null); // Clear preview

      // Attempt to clear file input more reliably
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }


      router.refresh(); // Refresh the page to show the new image

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Could not save the photo. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Share Your Ride
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              // We use render prop but don't spread field directly onto Input type="file"
              render={({ fieldState }) => ( // Use fieldState for error access
                <FormItem>
                  <FormLabel htmlFor="image-upload">Photo</FormLabel>
                  <FormControl>
                    {/* Assign the ref here */}
                     <Input
                       id="image-upload"
                       ref={fileInputRef} // Assign ref
                       type="file"
                       accept={ACCEPTED_IMAGE_TYPES.join(',')}
                       className="file:text-foreground"
                       onChange={handleFileChange} // Use our custom handler
                       // Omit RHF's value, onChange, ref props here
                     />
                  </FormControl>
                   {/* Render preview outside FormControl but within FormItem */}
                   {preview && (
                    <div className="mt-4 w-full aspect-video relative rounded-md overflow-hidden border">
                       <img src={preview} alt="Selected preview" className="object-contain w-full h-full" />
                     </div>
                   )}
                  {/* Display error message from fieldState */}
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your ride..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="w-full">
              {isSubmitting ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
