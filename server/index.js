import express from 'express';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import authRoutes from  './routes/auth.js';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';
 

/*CONFIGURATON*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
app.use(morgan('common'));
app.use(bodyParser.json({limit : '30mb' , extended : true}));
app.use(cors());
app.use('/assets' , express.static(path.join(__dirname, 'public/assets')));


/*FILE STORAGE */

const strage = multer.diskStorage({
    destination : function (req , file , cb) {
        cb(null , 'public/assets');
    },
    filename : function(req , file , cb) {
        cb(null , file.originalname);
    }
});
const upload  =  multer({dest:'uploads/'});


/*ROUTES WITH FILES */
app.post('/auth/register' , upload.single('picture') , register  )

/*ROUTES*/

app.use("/auth" ,  authRoutes);


/*MONGOOSE SETUP*/ 

const PORT = process.env.PORT || 8001
mongoose.connect(process.env.MONGO_URL , {
    useNewUrlParser : true ,
    useUnifiedTopology : true,
}).then(() => {
    app.listen(PORT , () => console.log(`Server Port is running at ${PORT}`))
}).catch((error) => console.log(`${error} did not match`));
