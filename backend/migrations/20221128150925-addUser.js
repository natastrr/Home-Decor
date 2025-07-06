const crypto = require('crypto');

module.exports = {
    async up(db, client) {
        const salt = crypto.randomBytes(128).toString('base64');
        const passwordHash = crypto.pbkdf2Sync('12345678', salt, 1, 128, 'sha1').toString('base64');
        await db.collection('users').insertMany([{
            firstName: 'Тест',
            lastName: 'Тестов',
            fatherName: 'Тестовович',
            email: 'test@gmail.com',
            passwordHash: passwordHash,
            salt: salt,
            phone: '+375444445566',
        }]);
    },

    async down(db, client) {
    }
};
