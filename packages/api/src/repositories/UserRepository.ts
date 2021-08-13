const db = require("better-sqlite3")('../../data/datasleuth.db');


class UserRepository {

    getAllUsers() {
        return [db.prepare('SELECT * FROM user').all(), null];
    }
}

const userRepository = new UserRepository();
export default userRepository;