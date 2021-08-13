import {randomBytes} from "crypto";

const db = require("better-sqlite3")('../../data/datasleuth.db');


class UserRepository {

    getAllUsers() {
        return [db.prepare('SELECT * FROM user;').all(), null];
    }

    addUser(user: { name: string; surname: string; email: string; permission: string }) {
        if (UserRepository.permissionInvalid(user.permission)) {
            return [null,{
                "code": 400,
                "message": "User permission is not of valid type"
            }]
        }
        try {
            db.prepare(
                'INSERT INTO user (first_name, last_name, email, password_hash, role, otp_seed) VALUES (?,?,?,?,?,?);'
            ).run(
                user.name,
                user.surname,
                user.email,
                "",
                user.permission,
                randomBytes(16).toString("hex"));
        } catch (e) {
            return [null, {
                "code": 400,
                "message": "User with same email already exists"
            }]
        }
        return [{
            "code": 200,
            "message": "Successfully added new user"
        }, null];
    }

    private static permissionInvalid(permission: string) {
        const allowed: string[] = ["viewer", "editor", "admin", "super"];
        return allowed.indexOf(permission) == -1;
    }
}

const userRepository = new UserRepository();
export default userRepository;