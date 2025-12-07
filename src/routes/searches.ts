import { Router } from 'express';
import { getSearch } from '../controllers/searchesController';


const router = Router();


router.get('/', getSearch );


export default router;