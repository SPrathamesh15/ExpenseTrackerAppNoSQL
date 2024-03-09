const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/user')
const dotenv = require('dotenv')
dotenv.config()

exports.isPremiumUser = async (req, res) => {
    try {
        const userDetails = await User.find({ _id: req.user._id });
        console.log('userdetail', userDetails)
        const premiumStatus = userDetails[0].isPremiumUser
        console.log('premiustatus', premiumStatus)
        res.status(200).json({ permuimStatus: premiumStatus });
        } catch (err) {
        res.status(500).json({ error: err });
        }
}

exports.purchasePremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 1500;
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {
                console.error('error 1', err);
                return res.status(500).json({ message: 'Internal server error', error: err });
            }

            try {
                const createdOrder = new Order({
                    userId: req.user._id,
                    orderId: order.id,
                    status: 'PENDING',
                    paymentId: 123
                })
                createdOrder.save()
                
                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (err) {
                console.error('error 2', err);
                return res.status(500).json({ message: 'Internal server error', error: err });
            }
        });
    } catch (err) {
        console.error('error 3', err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        console.log('req.body: ', req.body);
        const { payment_id, order_id } = req.body;
        console.log('paymentId and orderID', { payment_id, order_id });

        // Find the order by orderId
        const order = await Order.findOne({ orderId: order_id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status and paymentId
        order.paymentId = payment_id;
        order.status = 'SUCCESSFUL';
        await order.save();

        // Update the user to premium user
        req.user.isPremiumUser = true;
        await req.user.save();

        return res.status(202).json({ success: true, message: "Transaction Successful" });
    } catch (err) {
        console.error('updateTransaction',err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};


