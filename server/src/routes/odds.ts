import { Router } from 'express'
import { oddsController } from '../controllers/OddsController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/:sport', authMiddleware, oddsController.getOdds)
router.get('/stored/:sport', authMiddleware, oddsController.getStoredOdds)

export default router