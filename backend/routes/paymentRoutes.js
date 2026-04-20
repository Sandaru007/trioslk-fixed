const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const upload = require('../utils/uploadConfig');

router.get('/', paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/', upload.single('receipt'), paymentController.createPayment);
router.put('/:id', paymentController.updatePayment);
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
