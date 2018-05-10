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

    static async acceptFriendRequest(idReceiver, idSender) {
        checkObjectId(idSender, idReceiver);
        const queryObjectReceiver = {
            _id: idReceiver,
            incommingRequests: idSender
        };
        const updateObjectReceiver = {
            $pull: { incommingRequests: idSender },
            $push: { friends: idSender }
        };
        const receiver = await User.findOneAndUpdate(queryObjectReceiver, updateObjectReceiver);
        if (!receiver) throw new MyError('CANNOT_FIND_USER', 404);
        const queryObjectSender = {
            _id: idSender,
            sentRequests: idReceiver
        };
        const updateObjectSender = {
            $pull: { sentRequests: idReceiver },
            $push: { friends: idReceiver }
        };
        const options = {
            new: true,
            fields: { name: 1 }
        };
        const sender = await User.findOneAndUpdate(queryObjectSender, updateObjectSender, options);
        if (!sender) throw new MyError('CANNOT_FIND_USER', 404);
        return sender;
    }

    static async declineFriendRequest(idReceiver, idSender) {
        checkObjectId(idSender, idReceiver);
        const queryObjectReceiver = {
            _id: idReceiver,
            incommingRequests: idSender
        };
        const updateObjectReceiver = {
            $pull: { incommingRequests: idSender }
        };
        const receiver = await User.findOneAndUpdate(queryObjectReceiver, updateObjectReceiver);
        if (!receiver) throw new MyError('CANNOT_FIND_USER', 404);
        const queryObjectSender = {
            _id: idSender,
            sentRequests: idReceiver
        };
        const updateObjectSender = {
            $pull: { sentRequests: idReceiver }
        };
        const options = {
            new: true,
            fields: { name: 1 }
        };
        const sender = await User.findOneAndUpdate(queryObjectSender, updateObjectSender, options);
        if (!sender) throw new MyError('CANNOT_FIND_USER', 404);
        return sender;
    }

    static async removeFriendRequest(idSender, idReceiver) {
        checkObjectId(idSender, idReceiver);
        const queryObjectReceiver = {
            _id: idReceiver,
            incommingRequests: idSender
        };
        const updateObjectReceiver = {
            $pull: { incommingRequests: idSender }
        };
        const options = {
            new: true,
            fields: { name: 1 }
        };
        const receiver = await User.findOneAndUpdate(queryObjectReceiver, updateObjectReceiver, options);
        if (!receiver) throw new MyError('CANNOT_FIND_USER', 404);
        const queryObjectSender = {
            _id: idSender,
            sentRequests: idReceiver
        };
        const updateObjectSender = {
            $pull: { sentRequests: idReceiver }
        };
        const sender = await User.findOneAndUpdate(queryObjectSender, updateObjectSender);
        if (!sender) throw new MyError('CANNOT_FIND_USER', 404);
        return receiver;
    }

    static async removeFriend(idUser, idFriend) {
        checkObjectId(idUser, idFriend);
        const queryObjectUser = {
            _id: idUser,
            friends: idFriend
        };
        const updateObjectUser = {
            $pull: { friends: idFriend }
        };
        const user = await User.findOneAndUpdate(queryObjectUser, updateObjectUser);
        if (!user) throw new MyError('CANNOT_FIND_USER', 404);
        const queryObjectFriend = {
            _id: idFriend,
            friends: idUser
        };
        const updateObjectFriend = {
            $pull: { friends: idUser }
        };
        const options = {
            new: true,
            fields: { name: 1 }
        };
        const friend = await User.findOneAndUpdate(queryObjectFriend, updateObjectFriend, options);
        if (!friend) throw new MyError('CANNOT_FIND_USER', 404);
        return friend;
    }
}

module.exports = { FriendService };
