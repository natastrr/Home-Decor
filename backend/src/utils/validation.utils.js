const Joi = require("@hapi/joi");
const config = require("../config/config");

class ValidationUtils {
    static signupValidation(data) {
        const schema = Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string(),
            fatherName: Joi.string(),
            phone: Joi.string(),
            email: Joi.string().min(6).required().email()
                .messages({
                    'string.empty': `Необходимо заполнить "E-mail"`,
                    'string.email': `"E-mail" неверный`,
                    'string.min': `"E-mail" неверный`,
                    'any.required': `Необходимо заполнить "E-mail"`
                }),
            password: Joi.string().min(6).required()
                .messages({
                    'string.empty': `Необходимо заполнить "Пароль"`,
                    'string.min': `"Пароль" должен иметь минимум 6 символов`,
                    'any.required': `Необходимо заполнить "Пароль"`
                }),
            passwordRepeat: Joi.any().equal(Joi.ref('password'))
                .required()
                .messages({
                    'string.empty': `Необходимо заполнить "Повторение пароля"`,
                    'string.min': `"Повторение пароля" должен иметь минимум 6 символов`,
                    'any.required': `Необходимо заполнить "Повторение пароля"`,
                    'any.only': 'Пароли не совпадают'
                })
        });
        return schema.validate(data);
    }

    static loginValidation(data) {
        const schema = Joi.object({
            email: Joi.string().min(6).required().email()
                .messages({
                    'string.empty': `Необходимо заполнить "E-mail"`,
                    'string.email': `"E-mail" неверный`,
                    'string.min': `"E-mail" неверный`,
                    'any.required': `Необходимо заполнить "E-mail"`
                }),
            password: Joi.string().min(6).required()
                .messages({
                    'string.empty': `Необходимо заполнить "Пароль"`,
                    'string.min': `"Пароль" должен иметь минимум 6 символов`,
                    'any.required': `Необходимо заполнить "Пароль"`
                }),
            rememberMe: Joi.boolean().default(false),
        });
        return schema.validate(data);
    }

    static refreshTokenValidation(data) {
        const schema = Joi.object({
            refreshToken: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "Токен"`,
                    'any.required': `Необходимо заполнить "Токен"`
                }),
        });
        return schema.validate(data);
    }

    static updateCartValidation(data) {
        const schema = Joi.object({
            quantity: Joi.number().required().integer()
                .messages({
                    'number.base': `"Количество" должно быть числом`,
                    'number.integer': `"Количество" должно быть целым числом`,
                    'any.required': `Необходимо заполнить "Количество"`
                }),
            productId: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "ID продукта"`,
                    'any.required': `Необходимо заполнить "ID продукта"`
                }),
        });
        return schema.validate(data);
    }

    static addFavoriteValidation(data) {
        const schema = Joi.object({
            productId: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "ID продукта"`,
                    'any.required': `Необходимо заполнить "ID продукта"`
                }),
        });
        return schema.validate(data);
    }

    static removeFavoriteValidation(data) {
        const schema = Joi.object({
            productId: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "ID продукта"`,
                    'any.required': `Необходимо заполнить "ID продукта"`
                }),
        });
        return schema.validate(data);
    }

    static createOrderValidation(data) {
        const schema = Joi.object({
            deliveryType: Joi.string().required().valid(...Object.values(config.deliveryTypes))
                .messages({
                    'string.empty': `Необходимо заполнить "Тип доставки"`,
                    'any.only': `Тип доставки может быть только: ` + Object.values(config.deliveryTypes).join(','),
                    'any.required': `Необходимо заполнить "Тип доставки"`
                }),
            firstName: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "Имя"`,
                    'any.required': `Необходимо заполнить "Имя"`
                }),
            lastName: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "Фамилия"`,
                    'any.required': `Необходимо заполнить "Фамилия"`
                }),
            phone: Joi.string().required()
                .messages({
                    'string.base': `"Телефон" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Телефон"`,
                    'any.required': `Необходимо заполнить "Телефон"`
                }),
            paymentType: Joi.string().required().valid(...Object.values(config.paymentTypes))
                .messages({
                    'string.empty': `Необходимо заполнить "Способ оплаты"`,
                    'any.only': `Способ оплаты может быть только: ` + Object.values(config.paymentTypes).join(','),
                    'any.required': `Необходимо заполнить "Способ оплаты"`
                }),
            email: Joi.string().min(6).required().email()
                .messages({
                    'string.empty': `Необходимо заполнить "E-mail"`,
                    'string.email': `"E-mail" неверный`,
                    'string.min': `"E-mail" неверный`,
                    'any.required': `Необходимо заполнить "E-mail"`
                }),
            street: Joi
                .when('deliveryType', {
                    is: config.deliveryTypes.delivery,
                    then: Joi.string().required(),
                    otherwise: Joi.string()
                })
                .messages({
                    'string.base': `"Улица" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Улица"`,
                    'any.required': `Необходимо заполнить "Улица"`
                }),
            house: Joi
                .when('deliveryType', {
                    is: config.deliveryTypes.delivery,
                    then: Joi.string().required(),
                    otherwise: Joi.string()
                })
                .messages({
                    'string.base': `"Дом" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Дом"`,
                    'any.required': `Необходимо заполнить "Дом"`
                }),
            entrance: Joi.string()
                .messages({
                    'string.base': `"Подъезд" должен быть строкой`,
                }),
            apartment: Joi.string()
                .messages({
                    'string.base': `"Квартира" должен быть строкой`,
                }),
            comment: Joi.string()
                .messages({
                    'string.base': `"Комментарий" должен быть строкой`,
                }),
            fatherName: Joi.string()
                .messages({
                    'string.base': `"Отчество" должен быть строкой`,
                }),
        });
        return schema.validate(data);
    }

    static updateUserValidation(data) {
        const schema = Joi.object({
            deliveryType: Joi.string().valid(...Object.values(config.deliveryTypes))
                .messages({
                    'string.base': `"Тип доставки" должен быть строкой`,
                    'any.only': `Тип доставки может быть только: ` + Object.values(config.deliveryTypes).join(','),
                }),
            firstName: Joi.string()
                .messages({
                    'string.base': `"Имя" должен быть строкой`,
                }),
            lastName: Joi.string()
                .messages({
                    'string.base': `"Фамилия" должен быть строкой`,
                }),
            phone: Joi.string()
                .messages({
                    'string.base': `"Телефон" должен быть строкой`,
                }),
            paymentType: Joi.string().valid(...Object.values(config.paymentTypes))
                .messages({
                    'string.base': `"Способ оплаты" должен быть строкой`,
                    'any.only': `Способ оплаты может быть только: ` + Object.values(config.paymentTypes).join(','),
                }),
            email: Joi.string().min(6).email()
                .messages({
                    'string.base': `"E-mail" должен быть строкой`,
                    'string.email': `"E-mail" неверный`,
                    'string.min': `"E-mail" неверный`,
                }),
            street: Joi.string()
                .messages({
                    'string.base': `"Улица" должен быть строкой`,
                }),
            house: Joi.string()
                .messages({
                    'string.base': `"Дом" должен быть строкой`,
                }),
            entrance: Joi.string()
                .messages({
                    'string.base': `"Подъезд" должен быть строкой`,
                }),
            apartment: Joi.string()
                .messages({
                    'string.base': `"Квартира" должен быть строкой`,
                }),
            fatherName: Joi.string()
                .messages({
                    'string.base': `"Отчество" должен быть строкой`,
                }),
        });
        return schema.validate(data);
    }

}

module.exports = ValidationUtils;