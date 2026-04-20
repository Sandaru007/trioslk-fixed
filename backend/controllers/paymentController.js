const Payment = require('../models/Payment');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error });
  }
};

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const paymentData = { ...req.body };
    if (req.file) {
      paymentData.receiptUrl = req.file.path; // Set by Cloudinary
    }

    // Auto-generate STU-XXXX if not provided or is New Student
    if (!paymentData.studentId || paymentData.studentId === 'New Student') {
      const Student = require('../models/Student');
      
      const lastStudent = await Student.findOne({ studentId: /^STU-/ }).sort({ createdAt: -1 });
      const lastPayment = await Payment.findOne({ studentId: /^STU-/ }).sort({ date: -1 });

      let maxIdNum = 1000; // Start at 1000

      if (lastStudent && lastStudent.studentId) {
        const parts = lastStudent.studentId.split('-');
        if (parts.length === 2 && !isNaN(parts[1])) {
          maxIdNum = Math.max(maxIdNum, parseInt(parts[1], 10));
        }
      }

      if (lastPayment && lastPayment.studentId) {
        const parts = lastPayment.studentId.split('-');
        if (parts.length === 2 && !isNaN(parts[1])) {
          maxIdNum = Math.max(maxIdNum, parseInt(parts[1], 10));
        }
      }

      paymentData.studentId = `STU-${maxIdNum + 1}`;
    }

    // Auto-generate generatedID for the payment record itself (PAY-XXXX)
    const lastRec = await Payment.findOne({ generatedID: /^PAY-/ }).sort({ date: -1 });
    let payIdNum = 1000;
    if (lastRec && lastRec.generatedID) {
      const p = lastRec.generatedID.split('-');
      if (p.length === 2 && !isNaN(p[1])) {
        payIdNum = parseInt(p[1], 10);
      }
    }
    paymentData.generatedID = `PAY-${payIdNum + 1}`;

    const payment = new Payment(paymentData);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};

// Update payment
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error });
  }
};
