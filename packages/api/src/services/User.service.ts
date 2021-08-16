import userRepository from "../repositories/UserRepository";


class UserService {

    getAllUsers() {
        const [result, err] = userRepository.getAllUsers();
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message
                }
            }
        }
        return {
            "code": 200,
            "body": {
                "message": "Success",
                "data": result
            }
        };
    }

    addUser(users: { name: string; surname: string; email: string; permission: string }[]) {
        const [, err] = userRepository.addUser(users);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                    // @ts-ignore
                    "users": err.users
                }
            }
        }
        return {
            "code": 200,
            "body": {
                "message": "Success",
            }
        };
    }

    removeUser(users: {uuid: string}[]) {
        const [, err] = userRepository.removeUser(users);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                    // @ts-ignore
                    "users": err.users
                }
            }
        }
        return {
            "code": 204,
            "message": "Successfully deleted specified users"
        }
    }

    setRole(body: {role: string; users: {uuid: string}[]}) {
        const [, err] = userRepository.setRole(body);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                    // @ts-ignore
                    "users": err.users
                }
            }
        }
        return {
            "code": 204,
            "message": "Successfully set roles of specified users"
        }
    }

    logoutUser(users: { uuid: string; }[]) {
        const [, err] = userRepository.logoutUser(users);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                    // @ts-ignore
                    "users": err.users
                }
            }
        }
        return {
            "code": 204,
            "message": "Successfully logged out specified users"
        }
    }

    revokeUser(users: { uuid: string; }[]) {
        const [, err] = userRepository.revokeUser(users);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                    // @ts-ignore
                    "users": err.users
                }
            }
        }
        return {
            "code": 204,
            "message": "Successfully revoked access for specified users"
        }
    }
}

const userService = new UserService();
export default userService;