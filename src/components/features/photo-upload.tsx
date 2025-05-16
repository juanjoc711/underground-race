"use client";

import * as React from 'react';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext'; // 👈 añadido

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  image: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, "La imagen es obligatoria.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo es 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Se aceptan archivos .jpg, .jpeg, .png y .webp."
    ),
  caption: z.string().max(150, "La descripción no puede exceder los 150 caracteres.").optional(),
});

type PhotoUploadFormValues = z.infer<typeof formSchema>;

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export default function PhotoUpload() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth(); // 👈 obtenido el usuario
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
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
        form.setValue('image', event.target.files as FileList, { shouldValidate: true });
      } catch (error) {
        console.error("Error leyendo archivo:", error);
        setPreview(null);
        form.setValue('image', new DataTransfer().files, { shouldValidate: true });
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo generar la vista previa de la imagen.",
        });
      }
    } else {
      setPreview(null);
      form.setValue('image', new DataTransfer().files, { shouldValidate: true });
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
        title: 'No se seleccionó archivo',
        description: 'Por favor, selecciona una imagen para subir.',
      });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    if (caption) {
      formData.append('caption', caption);
    }

    if (user?.email) {
      formData.append('uploadedBy', user.email); // 👈 se añade el email del usuario autenticado
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falló la subida');
      }

      const result = await response.json();
      console.log('Subida exitosa:', result);

      toast({
        title: "¡Foto Subida!",
        description: "Tu coche ha sido añadido a la galería.",
      });

      form.reset();
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      router.refresh();

    } catch (error: any) {
      console.error('Error de subida:', error);
      toast({
        variant: 'destructive',
        title: 'Subida Fallida',
        description: error.message || 'No se pudo guardar la foto. Por favor, inténtalo de nuevo.',
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
          Comparte Tu Coche
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="image-upload">Foto</FormLabel>
                  <FormControl>
                    <Input
                      id="image-upload"
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(',')}
                      className="file:text-foreground"
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  {preview && (
                    <div className="mt-4 w-full aspect-video relative rounded-md overflow-hidden border">
                      <img src={preview} alt="Vista previa seleccionada" className="object-contain w-full h-full" />
                    </div>
                  )}
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cuéntanos sobre tu coche..."
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
              {isSubmitting ? 'Subiendo...' : 'Subir Foto'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
