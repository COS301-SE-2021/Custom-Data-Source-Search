import {randomBytes} from "crypto";

const db = require("better-sqlite3")('../../data/datasleuth.db');


class UserRepository {

    getAllUsers() {
        return [db.prepare('SELECT * FROM user;').all(), null];
    }

    addUser(users: { name: string; surname: string; email: string; permission: string }[]) {
        let failedUsers: any[] = [];
        for (let user of users) {
            if (UserRepository.permissionInvalid(user.permission)) {
                return [null,{
                    "code": 400,
                    "message": "User permission is not of valid type"
                }];
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
                    randomBytes(16).toString("hex"))
            } catch (e) {
                failedUsers.push(user);
            }
        }
        if (failedUsers.length !== 0) {
            return [null, {
                "code": 400,
                "message": "Some users could not be deleted",
                "users": users
            }];
        }
        return [{
            "code": 200,
            "message": "Successfully added new users"
        }, null];
    }

    private static permissionInvalid(permission: string) {
        const allowed: string[] = ["viewer", "editor", "admin", "super"];
        return allowed.indexOf(permission) == -1;
    }

    removeUser(users: { uuid: string }[]) {
        let failedUsers: any[] = [];
        for (let user of users) {
            try {
                db.prepare("DELETE FROM user WHERE id = ?").run(parseInt(user.uuid));
            } catch (e) {
                failedUsers.push(user);
            }
        }
        if (failedUsers.length !== 0) {
            return [null, {
                "code": 400,
                "message": "Could not delete all of specified users",
                "users": failedUsers
            }];
        }
        return [{
            "code": 204,
            "message": "Successfully deleted specified users"
        }, null];
    }
}

const userRepository = new UserRepository();
export default userRepository;