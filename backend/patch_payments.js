const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Payment = require('./models/Payment');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    const payments = await Payment.find({ generatedID: { $exists: false } }).sort({ date: 1 });
    
    // Find the current highest
    const lastRec = await Payment.findOne({ generatedID: /^PAY-/ }).sort({ _id: -1 });
    let payIdNum = 1000;
    if (lastRec && lastRec.generatedID) {
      const p = lastRec.generatedID.split('-');
      if (p.length === 2 && !isNaN(p[1])) {
        payIdNum = parseInt(p[1], 10);
      }
    }

    for (const payment of payments) {
      payIdNum++;
      payment.generatedID = `PAY-${payIdNum}`;
      await payment.save();
      console.log(`Updated payment ${payment._id} to ${payment.generatedID}`);
    }
    
    console.log(`Patched ${payments.length} old payment records.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
