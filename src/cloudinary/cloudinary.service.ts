import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async subirImagen(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      // Configuraciones de subida
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'clinica/perfiles', // Organiza tus archivos en carpetas dentro de Cloudinary
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
          transformation: [{ width: 500, height: 500, crop: 'limit' }], // Opcional: Redimensiona para ahorrar espacio
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new Error('No se pudo obtener respuesta de Cloudinary'),
            );
          resolve(result);
        },
      );

      // Convierte el búfer de memoria de NestJS en stream y lo envía
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async eliminarImagen(urlCompleta: string): Promise<any> {
    try {
      if (urlCompleta.includes('cloudinary.com')) {
        const partesUrl = urlCompleta.split('/');
        const nombreArchivoConExtension = partesUrl.pop();
        const carpetaContenedora = partesUrl
          .slice(partesUrl.indexOf('upload') + 2)
          .join('/');

        const publicId = `${carpetaContenedora}/${nombreArchivoConExtension?.split('.')[0]}`;

        return await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error(
        'No se pudo borrar la imagen anterior de Cloudinary:',
        error,
      );
    }
  }
}
