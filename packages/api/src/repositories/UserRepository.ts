import {randomBytes} from "crypto";

const db = require("better-sqlite3")('../../data/datasleuth.db');
import {createHmac} from 'crypto';


class UserRepository {

    private static formatUsersForAdmin(user: any) {
        let regStatus: string = "registered";
        if (user.password_hash === "") {
            regStatus = "unregistered"
        }
        let loggedIn: boolean = false;
        try {
            if (db.prepare("SELECT * FROM active_user WHERE email = ?").all(user.email)[0] !== undefined) {
                loggedIn = true;
            }
        } catch (e) {
        }
        let regKey: string = ""
        try {
            let pendingUser = db.prepare("SELECT * FROM pending_user WHERE email = ?").all(user.email)[0];
            if (pendingUser !== undefined) {
                regKey = pendingUser["reg_key"];
            }
        } catch (e) {
        }
        return {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "uuid": user.id,
            "role": user.role,
            "reg_status": regStatus,
            "logged_in": loggedIn,
            "reg_key": regKey
        }
    }

    private static formatUser(user: any) {
        return {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "uuid": user.id,
            "role": user.role,
        }
    }

    getAllUsers() {
        return [{
            "code": 200,
            "results": db.prepare('SELECT * FROM user;').all().map(UserRepository.formatUsersForAdmin)
        }, null];
    }

    addUser(users: { first_name: string; last_name: string; email: string; role: string }[]) {
        let failedUsers: any[] = [];
        for (let user of users) {
            if (UserRepository.permissionInvalid(user.role)) {
                return [null, {
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

    validateUser(email: string, pass_key: string) {
        try {
            const user = db.prepare("SELECT * FROM user WHERE email = ?").all(email)[0];
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

    generateRefreshToken(email: string) {
        try {
            db.prepare('DELETE FROM active_user WHERE email = ?').run(email);
            const refreshToken = randomBytes(16).toString("hex");
            const expirationTimeSeconds = 20;
            const newDate = new Date(new Date().getTime() + expirationTimeSeconds * 1000).getTime();
            db.prepare(
                'INSERT INTO active_user (email, refresh_token, valid_until) VALUES (?,?,?);'
            ).run(
                email,
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

    validateRefreshToken(email: string, refreshToken: string): [any, { code: number; message: string; }] {
        try {
            const user = db.prepare('SELECT * FROM user WHERE email = ?').all(email)[0];
            const activeUser = db.prepare('SELECT * FROM active_user WHERE refresh_token = ?').all(refreshToken)[0];
            if (activeUser === undefined) {
                return [null, {
                    "code": 400,
                    "message": "Refresh token is not active"
                }];
            }
            const time: number = parseInt(activeUser["valid_until"]);
            if (time < new Date().getTime()) {
                return [null, {
                    "code": 400,
                    "message": "Time out of refresh token"
                }];
            }
            return [UserRepository.formatUser(user), null];
        } catch (e) {
            console.error(e);
            return [null, {
                "code": 500,
                "message": "Error while validating refresh token"
            }];
        }
    }


    generateRegistrationKey(users: { uuid: string }[]) {
        let failedUsers: any[] = [];
        for (let userId of users) {
            let user;
            try {
                user = db.prepare('SELECT * FROM user WHERE id = ?').all(userId["uuid"])[0];
                if (user === undefined) {
                    failedUsers.push(userId);
                    continue;
                }
                try {
                    db.prepare(
                        'INSERT INTO pending_user (email, single_use_registration_token, secret) VALUES (?,?,?);'
                    ).run(
                        user["email"],
                        randomBytes(16).toString("hex"),
                        randomBytes(16).toString("hex")
                    );
                } catch (e) {
                    db.prepare(
                        'UPDATE pending_user SET single_use_registration_token = ? WHERE email = ?'
                    ).run(
                        randomBytes(16).toString("hex") + '.' + randomBytes(16).toString("hex"),
                        user["email"]
                    );
                }
            } catch (e) {
                console.error(e);
                failedUsers.push(userId);
            }
        }
        if (failedUsers.length !== 0) {
            return [null, {
                "code": 400,
                "message": "Could not generate registration keys for specified users",
                "users": failedUsers
            }];
        }
        return [{
            "code": 200,
            "message": "Successfully generated registration keys for specified users"
        }, null];
    }

    getUsers(users: { uuid: string }[]) {
        let result: any[] = [];
        for (let userId of users) {
            let user;
            try {
                user = db.prepare('SELECT * FROM user WHERE id = ?').all(userId["uuid"])[0];
                if (user !== undefined) {
                    result.push(user);
                }
            } catch (e) {
                console.error(e);
            }
        }
        return result;
    }

    getPendingUsers(users: any[]) {
        let result: any[] = [];
        for (let user of users) {
            let pendingUser;
            try {
                pendingUser = db.prepare('SELECT * FROM pending_user WHERE email = ?').all(user["email"])[0];
                if (pendingUser !== undefined) {
                    result.push(pendingUser);
                }
            } catch (e) {
                console.error(e);
            }
        }
        return result;
    }

    validateRegistration(body: { email: string; single_use_registration_token: string }) {
        try {
            let pendingUser = db.prepare(
                'SELECT * FROM pending_user WHERE email = ? AND single_use_registration_token = ?'
            ).all(
                body.email,
                body.single_use_registration_token
            )[0];
            db.prepare('DELETE FROM pending_user WHERE email = ?').run(body.email);
            if (pendingUser !== undefined) {
                return [pendingUser, null];
            }
        } catch (e) {
            console.error(e);
        }
        return [null, {
            "message": "Failed to validate user"
        }];
    }

    setSeedAndPassKey(email: string, partialPassKey: string, partialSeed: string, secret: string) {
        const fullPassKey: string = UserRepository.applyHmac(partialPassKey, secret);
        const fullSeed: string = UserRepository.applyHmac(partialSeed, secret);
        try {
            db.prepare("UPDATE user SET password_hash = ? WHERE email = ?").run(fullPassKey, email);
            db.prepare("UPDATE user SET otp_seed = ? WHERE email = ?").run(fullSeed, email);
        } catch (e) {
            console.error(e);
        }
    }

    private static applyHmac(key: string, secret: string) {
        let hmac = createHmac('sha512', secret);
        return hmac.update(key).digest('hex');
    }
}

const userRepository = new UserRepository();
export default userRepository;