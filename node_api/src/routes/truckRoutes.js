const express = require('express');
const {
    addTruck,
    getTrucks,
    updateTruck,
    deleteTruck
} = require('../controllers/truckController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All truck routes require authentication

/**
 * @swagger
 * /api/trucks:
 *   get:
 *     summary: Get all trucks (scoped by user role)
 *     tags: [Trucks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trucks
 */
router.route('/')
    .get(getTrucks)
    /**
     * @swagger
     * /api/trucks:
     *   post:
     *     summary: Add a new truck
     *     tags: [Trucks]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               numberPlate:
     *                 type: string
     *               fuelType:
     *                 type: string
     *                 enum: [diesel, electric, LNG]
     *               avgFuelBurnRate:
     *                 type: number
     *     responses:
     *       201:
     *         description: Truck created
     */
    .post(addTruck);

router.route('/:id')
    .put(updateTruck)
    .delete(deleteTruck);

module.exports = router;
