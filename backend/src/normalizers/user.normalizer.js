const BaseNormalizer = require("./base.normalizer");

class UserNormalizer extends BaseNormalizer {
    static normalize(user) {
        const obj = {
            deliveryType: user.deliveryType,
            firstName: user.firstName,
            lastName: user.lastName,
            fatherName: user.fatherName,
            phone: user.phone,
            email: user.email,
            paymentType: user.paymentType,
        };

        if (user.deliveryInfo) {
            if (user.deliveryInfo.street) {
                obj.street = user.deliveryInfo.street;
            }
            if (user.deliveryInfo.house) {
                obj.house = user.deliveryInfo.house;
            }
            if (user.deliveryInfo.apartment) {
                obj.apartment = user.deliveryInfo.apartment;
            }
            if (user.deliveryInfo.entrance) {
                obj.entrance = user.deliveryInfo.entrance;
            }
        }
        return obj;
    }
}

module.exports = UserNormalizer;