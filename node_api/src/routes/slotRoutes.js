const express = require('express');
const {
    createSlot,
    getSlots,
    getCongestionPrediction,
    bookSlot
} = require('../controllers/slotController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/slots:
 *   get:
 *     summary: Get upcoming slots
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of slots
 */
router.route('/')
    .get(getSlots)
    /**
     * @swagger
     * /api/slots:
     *   post:
     *     summary: Create a new time slot
     *     tags: [Slots]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               startTime:
     *                 type: string
     *                 format: date-time
     *               endTime:
     *                 type: string
     *                 format: date-time
     *               maxTrucks:
     *                 type: number
     *     responses:
     *       201:
     *         description: Slot created
     */
    .post(authorize('admin'), createSlot);

/**
 * @swagger
 * /api/slots/{id}/congestion:
 *   get:
 *     summary: Get congestion prediction for a specific slot
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Congestion prediction results
 */
router.get('/:id/congestion', getCongestionPrediction);

/**
 * @swagger
 * /api/slots/{id}/book:
 *   post:
 *     summary: Book a slot for a truck
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               truckId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking successful
 *       400:
 *         description: Slot full or overbooked
 */
router.post('/:id/book', authorize('admin', 'operator', 'driver'), bookSlot);

module.exports = router;
