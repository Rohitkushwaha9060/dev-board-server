import multer from 'multer';
import { utilsService } from '@/services';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        file.originalname =
            String(utilsService.generateOTP()) +
            '.' +
            file.mimetype.split('/')[1];
        cb(null, 'public/temp');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

export const multerMiddleware = multer({ storage });
