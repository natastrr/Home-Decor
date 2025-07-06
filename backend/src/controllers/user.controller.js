const UserModel = require("../models/user.model");
const UserNormalizer = require("../normalizers/user.normalizer");
const ValidationUtils = require("../utils/validation.utils");

class UserController {
    static async getUserInfo(req, res) {
        let user = await UserModel.findOne({_id: req.user.id});
        res.json(UserNormalizer.normalize(user));
    }

    static async updateUserInfo(req, res) {
        const {error} = ValidationUtils.updateUserValidation(req.body);
        if (error) {
            console.log(error.details);
            return res.status(400).json({error: true, message: error.details[0].message});
        }

        const objToUpdate = {
            firstName: req.body.firstName ? req.body.firstName : '',
            lastName: req.body.lastName ? req.body.lastName : '',
            fatherName: req.body.fatherName ? req.body.fatherName : '',
            email: req.body.email ? req.body.email : '',
            phone: req.body.phone ? req.body.phone : '',
            deliveryInfo: {
                street: req.body.street ? req.body.street : '',
                house: req.body.house ? req.body.house : '',
                apartment: req.body.apartment ? req.body.apartment : '',
                entrance: req.body.entrance ? req.body.entrance : '',
            },
            paymentType: req.body.paymentType ? req.body.paymentType : '',
            deliveryType: req.body.deliveryType ? req.body.deliveryType : '',
        };

        let result = await UserModel.updateOne({_id: req.user.id}, objToUpdate);
        if (!result.modifiedCount) {
            console.log(result);
            return res.status(500).json({error: true, message: 'Произошла ошибка'});
        }

        res.json({error: false, message: "Успешно обновлено"});
    }
}

module.exports = UserController;