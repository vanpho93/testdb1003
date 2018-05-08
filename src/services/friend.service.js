const { User } = require('../models/user.model');
const { MyError } = require('../models/my-error.model');
const { checkObjectId } = require('../helpers/checkObjectId');

class FriendService {
    static async addFriend(idSender, idReceiver) {
        checkObjectId(idSender, idReceiver);
        const queryObject = {
            _id: { $eq: idSender, $ne: idReceiver },
            friends: { $ne: idReceiver },
            sentRequests: { $ne: idReceiver },
            incommingRequests: { $ne: idReceiver },
        }
        const sender = await User.findOneAndUpdate(queryObject, { $push: { sentRequests: idReceiver } });
        if (!sender) throw new MyError('CANNOT_FIND_USER', 404);
        const options = {
            new: true,
            fields: { name: 1 }
        };
        const updateObject = { $push: { incommingRequests: idSender } };
        const receiver = await User.findByIdAndUpdate(idReceiver, updateObject, options);
        if (!receiver) throw new MyError('CANNOT_FIND_USER', 404);
        return receiver;
    }
}

module.exports = { FriendService };
