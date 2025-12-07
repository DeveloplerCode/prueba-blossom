import { Router } from 'express';
import { getSearch } from '../controllers/searchesController';


const router = Router();


router.get('/:id',    getSearch );



export default router;