const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./src/routes/category.routes');
const typeRoutes = require('./src/routes/type.routes');
const productRoutes = require('./src/routes/product.routes');
const cartRoutes = require('./src/routes/cart.routes');
const authRoutes = require('./src/routes/auth.routes');
const favoriteRoutes = require('./src/routes/favorite.routes');
const orderRoutes = require('./src/routes/order.routes');
const userRoutes = require('./src/routes/user.routes');
const MongoDBConnection = require("./src/utils/common/connection");
const config = require("./src/config/config");
const session = require('express-session');
const path = require('path');
const {v4: uuidv4} = require('uuid');
const passport = require('passport');
const UserModel = require("./src/models/user.model");
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

MongoDBConnection.getConnection((error, connection) => {
    if (error || !connection) {
        console.log('Db connection error', error);
        return;
    }
    const app = express();

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());
    app.use(cors({credentials: true, origin: true}));

    app.use(session({
        genid: function (req) {
            return uuidv4();
        },
        secret: '0SddfAS9fAdFASASSFwdVCXLZJKHfss',
        resave: false,
        saveUninitialized: true,
    }));

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
        secretOrKey: config.secret,
        algorithms: ["HS256"],
    }, async (payload, next) => {

        if (!payload.id) {
            return next(new Error('Не валидный токен'));
        }

        let user = null;
        try {
            user = await UserModel.findOne({_id: payload.id});
        } catch (e) {
            console.log(e);
        }

        if (user) {
            return  next(null, payload);
        }

        next(new Error('Пользователь не найден'));
    }));

    app.use(passport.initialize());

    app.use("/api", authRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/types", typeRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/favorites", favoriteRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/user", userRoutes);

    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.use(function (err, req, res, next) {
        res.status(err.statusCode || 500).send({error: true, message: err.message});
    });

    app.listen(config.port, () =>
        console.log(`Server started`)
    );
})

