// src/components/features/photo-upload.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

export default function PhotoUpload() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<PhotoUploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
     // Manually trigger validation for the file input
    form.setValue('image', event.target.files as FileList);
    form.trigger('image');
  };

  const onSubmit = async (values: PhotoUploadFormValues) => {
    setIsSubmitting(true);
    console.log("Form Submitted:", values); // Log values for debugging

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Replace with actual upload logic (e.g., to Firebase Storage)
    // const file = values.image[0];
    // const caption = values.caption;
    // Perform upload...

    setIsSubmitting(false);
    toast({
      title: "Photo Uploaded!",
      description: "Your ride is now in the gallery.",
    });
    form.reset(); // Reset form fields
    setPreview(null); // Clear preview
     // Clear file input manually if needed (tricky to do directly, often requires a key change or ref)
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = '';
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="image-upload">Photo</FormLabel>
                  <FormControl>
                       {/* Make Input the direct child of FormControl */}
                       <Input
                        id="image-upload" // Keep id here for the label association
                        type="file"
                        accept="image/*"
                        className="file:text-foreground" // Style the file input button text
                         // We need onChange to handle preview and setValue, but RHF handles the value via setValue
                        onChange={handleFileChange}
                        // RHF doesn't directly work well with file inputs, so we use onChange and manually set value.
                        // We omit field.onChange, field.value, field.ref from the input itself.
                      />
                  </FormControl>
                   {/* Render preview outside FormControl but within FormItem */}
                  {preview && (
                    <div className="mt-4 w-full aspect-video relative rounded-md overflow-hidden border">
                       <img src={preview} alt="Selected preview" className="object-contain w-full h-full" />
                     </div>
                   )}
                  <FormMessage />
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
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Uploading...' : 'Upload Photo'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
