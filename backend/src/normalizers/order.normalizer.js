const BaseNormalizer = require("./base.normalizer");

class OrderNormalizer extends BaseNormalizer {
    static normalize(order) {
        return {
            items: order.items.map(item => {
                return {
                    id: item.id,
                    name: item.productName,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total,
                }
            }),
            deliveryCost: order.deliveryCost,
            totalAmount: order.totalAmount,
            deliveryType: order.deliveryType,
            firstName: order.firstName,
            lastName: order.lastName,
            fatherName: order.fatherName,
            phone: order.phone,
            email: order.email,
            deliveryInfo: order.deliveryInfo,
            paymentType: order.paymentType,
            comment: order.comment,
            status: order.status,
            createdAt: order.createdAt,
        }
    }
}

module.exports = OrderNormalizer;