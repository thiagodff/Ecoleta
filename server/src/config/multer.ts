import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// podemos utilizar um fileFilter para criar filtros de arquivos
// ex: extensoes permitidas, tamanho maximo de arquivo, etc

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(request, file, callback) {
      const hash = crypto.randomBytes(6).toString('hex');

      const fileName = `${hash}-${file.originalname}`;

      callback(null, fileName);
    },
  })
};
