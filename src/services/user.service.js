const { hash, compare } = require('bcrypt');
const { User } = require('../models/user.model');

class UserService {
    static async signUp(email, plainPassword, name) {
        const password = await hash(plainPassword, 8);
        const user = new User({ name, email, password });
        return user.save();
    }

    static async signIn(email, plainPassword) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Cannot find user');
        const same = await compare(plainPassword, user.password);
        if (!same) throw new Error('Invalid password');
        return user;        
    }
}

module.exports = { UserService };
