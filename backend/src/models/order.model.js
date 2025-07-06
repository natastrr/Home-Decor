const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less then 1.']
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true,
    },
});

const DeliveryInfoSchema = new mongoose.Schema({
    street: {
        type: String,
    },
    house: {
        type: String,
    },
    entrance: {
        type: String,
    },
    apartment: {
        type: String,
    },
});

const OrderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    sessionId: {
        type: String,
    },
    items: [ItemSchema],
    deliveryCost: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    deliveryType: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    fatherName: String,
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    deliveryInfo: DeliveryInfoSchema,
    paymentType: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
    },
    status: {
        type: String,
    },
}, {
    timestamps: true
})

// CartSchema.methods.calculateTotalAmount = function () {
//     this.subTotal = this.items.reduce((accumulator, item) => {
//         return accumulator + (item.quantity * item.price);
//     }, 0);
// };

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;