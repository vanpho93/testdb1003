const { hash, compare } = require('bcrypt');
const faker = require('faker');
const { sign, verify } = require('../helpers/jwt');
const { User } = require('../models/user.model');
const { MyError } = require('../models/my-error.model');

class UserService {
    static async signUp(email, plainPassword, name) {
        if (!plainPassword) throw new MyError('INVALID_PASSWORD', 400);
        const password = await hash(plainPassword, 8);
        try {
            const user = new User({ name, email, password });
            await user.save();
            const userInfo = user.toObject();
            delete userInfo.password;
            return userInfo;
        } catch (error) {
            if (error.name === 'ValidationError') throw new MyError('INVALID_USER_INFO', 400);
            throw new MyError('EMAIL_EXISTED', 400);
        }
    }

    static async signIn(email, plainPassword) {
        const user = await User.findOne({ email });
        if (!user) throw new MyError('INVALID_USER_INFO', 400);
        const same = await compare(plainPassword, user.password);
        if (!same) throw new MyError('INVALID_USER_INFO', 400);
        const userInfo = user.toObject();
        delete userInfo.password;
        userInfo.token = await sign({ _id: user._id });
        return userInfo;
    }

    static async check(idUser) {
        const user = await User.findById(idUser);
        if (!user) throw new MyError('CANNOT_FIND_USER', 404);
        const userInfo = user.toObject();
        delete userInfo.password;
        userInfo.token = await sign({ _id: user._id });
        return userInfo;      
    }
}

module.exports = { UserService };

// for(let i = 0; i < 20; i++) {
//     const name = faker.name.findName();
//     const email = faker.internet.email(name);
//     UserService.signUp(email, '123', name);
// }
