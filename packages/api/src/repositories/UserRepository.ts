import {randomBytes} from "crypto";

const db = require("better-sqlite3")('../../data/datasleuth.db');


class UserRepository {

    getAllUsers() {
        return [{
            "code": 200,
            "results": db.prepare('SELECT * FROM user;').all()
        }, null];
    }

    addUser(users: { first_name: string; last_name: string; email: string; role: string }[]) {
        let failedUsers: any[] = [];
        for (let user of users) {
            if (UserRepository.permissionInvalid(user.role)) {
                return [null,{
                    "code": 400,
                    "message": "User permission is not of valid type"
                }];
            }
            try {
                db.prepare(
                    'INSERT INTO user (first_name, last_name, email, password_hash, role, otp_seed) VALUES (?,?,?,?,?,?);'
                ).run(
                    user.first_name,
                    user.last_name,
                    user.email,
                    "",
                    user.role,
                    randomBytes(16).toString("hex")
                );
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

    removeUser(users: { uuid: string; }[]) {
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
            "code": 200,
            "message": "Successfully deleted specified users"
        }, null];
    }

    setRole(body: { role: string; users: { uuid: string }[]; }) {
        if (UserRepository.permissionInvalid(body.role)) {
            return [null, {
                "code": 400,
                "message": "Invalid role",
                "users": body.users
            }]
        }
        let failedUsers: any[] = [];
        for (let user of body.users) {
            try {
                db.prepare("UPDATE user SET role = ? WHERE id = ?").run(body.role, parseInt(user.uuid));
            } catch (e) {
                console.error(e);
                failedUsers.push(user);
            }
        }
        if (failedUsers.length !== 0) {
            return [null, {
                "code": 400,
                "message": "Could not set role for all of specified users",
                "users": failedUsers
            }];
        }
        return [{
            "code": 200,
            "message": "Successfully set roles for specified users"
        }, null];
    }

    logoutUser(users: { uuid: string }[]) {
        let failedUsers: any[] = [];
        for (let user of users) {
            try {
                db.prepare(
                    "DELETE active_user FROM active_user INNER JOIN user ON email=email WHERE id = ?"
                ).run(parseInt(user.uuid));
            } catch (e) {
                console.error(e);
                failedUsers.push(user);
            }
        }
        // TODO refresh secret for jwt token
        if (failedUsers.length !== 0) {
            return [null, {
                "code": 400,
                "message": "Could not logout specified users",
                "users": failedUsers
            }];
        }
        return [{
            "code": 200,
            "message": "Successfully logged out specified users"
        }, null];
    }

    revokeUser(users: { uuid: string }[]) {
        let failedUsers: any[] = [];
        for (let user of users) {
            try {
                db.prepare("UPDATE user SET password_hash = '' WHERE id = ?").run(parseInt(user.uuid));
            } catch (e) {
                console.error(e);
                failedUsers.push(user);
            }
            try {
                db.prepare(
                    "DELETE active_user FROM active_user INNER JOIN user ON email=email WHERE id = ?"
                ).run(parseInt(user.uuid));
            } catch (e) {
                console.error(e);
            }
        }
        if (failedUsers.length !== 0) {
            return [null, {
                "code": 400,
                "message": "Could not revoke access for specified users",
                "users": failedUsers
            }];
        }
        return [{
            "code": 200,
            "message": "Successfully revoked access for specified users"
        }, null];
    }

    logoutAllUsers() {
        try {
            db.prepare("DELETE FROM active_user").all();
        } catch (e) {
            console.error(e);
            return [null, {
                "code": 500,
                "message": "Failed to logout all users",
            }];
        }
        return [{
            "code": 200,
            "message": "Successfully logged out all users"
        }, null];
    }

    revokeAllUsers() {
        try {
            db.prepare("UPDATE user SET password_hash = NULL").all();
        } catch (e) {
            console.error(e);
            return [null, {
                "code": 500,
                "message": "Failed to revoke access for all users",
            }];
        }
        return [{
            "code": 200,
            "message": "Successfully revoked access for all users"
        }, null];
    }

    validateUser(uuid: string, pass_key: string) {
        try {
            const user = db.prepare("SELECT * FROM user WHERE id = ?").all(uuid)[0];
            if (user["password_hash"] == pass_key) {
                return [{
                    "code": 200,
                    "message": "Success"
                }, null];
            }
            return [null, {
                "code": 403,
                "message": "Pass key is incorrect",
            }];
        } catch (e) {
            console.error(e);
            return [null, {
                "code": 404,
                "message": "User not found",
            }];
        }
    }

    generateRefreshToken(uuid: string) {
        try {
            const user = db.prepare('SELECT * FROM user WHERE id = ?').all(uuid)[0];
            db.prepare('DELETE FROM active_user WHERE email = ?').run(user["email"]);
            const refreshToken = randomBytes(16).toString("hex");
            const expirationTimeSeconds = 20;
            const newDate = new Date(new Date().getTime() + expirationTimeSeconds * 1000).getTime();
            db.prepare(
                'INSERT INTO active_user (email, refresh_token, valid_until) VALUES (?,?,?);'
            ).run(
                user["email"],
                refreshToken,
                newDate
            );
            return [refreshToken, null];
        } catch (e) {
            console.error(e);
            return [null, {
                "code": 500,
                "message": "Error while generating new refresh token"
            }];
        }
    }

    validateRefreshToken(uuid: string, refreshToken: string) {
        try {
            const user = db.prepare('SELECT * FROM user WHERE id = ?').all(uuid)[0];
            const activeUser = db.prepare('SELECT * FROM active_user WHERE refresh_token = ?').all(refreshToken)[0];
            if (activeUser === undefined) {
                return [null, {
                    "code": 400,
                    "message": "No active refresh token found"
                }];
            }
            const time: number = parseInt(activeUser["valid_until"]);
            if (time < new Date().getTime()) {
                return [null, {
                    "code": 400,
                    "message": "Time out of refresh token"
                }];
            }
            return [user, null];
        } catch (e) {
            console.error(e);
            return [null, {
                "code": 500,
                "message": "Error while validating refresh token"
            }];
        }
    }
}

const userRepository = new UserRepository();
export default userRepository;