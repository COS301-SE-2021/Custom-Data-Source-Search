import userRepository from "../repositories/UserRepository";


class UserService {

    getAllUsers() {
        const [result, err] = userRepository.getAllUsers();
        if (err) {
            return {
                "code": err.code,
                "body": {
                    // @ts-ignore
                    "message": err.message
                }
            };
        }
        return {
            "code": result.code,
            "body": {
                "message": "Success",
                "data": result.results
            }
        };
    }

    addUser(users: { first_name: string; last_name: string; email: string; role: string }[]) {
        const [result, err] = userRepository.addUser(users);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                    // @ts-ignore
                    "users": err.users
                }
            };
        }
        return {
            "code": result.code,
            "body": {
                "message": result.message
            }
        };
    }

    removeUser(users: {uuid: string}[]) {
        const [result, err] = userRepository.removeUser(users);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                    // @ts-ignore
                    "users": err.users
                }
            };
        }
        return {
            "code": result.code,
            "body": {
                "message": result.message
            }
        };
    }

    setRole(body: {role: string; users: {uuid: string}[]}) {
        const [result, err] = userRepository.setRole(body);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                    // @ts-ignore
                    "users": err.users
                }
            };
        }
        return {
            "code": result.code,
            "body": {
                "message": result.message
            }
        };
    }

    logoutUser(users: { uuid: string; }[]) {
        const [result, err] = userRepository.logoutUser(users);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                    // @ts-ignore
                    "users": err.users
                }
            };
        }
        return {
            "code": result.code,
            "body": {
                "message": result.message
            }
        };
    }

    revokeUser(users: { uuid: string; }[]) {
        const [result, err] = userRepository.revokeUser(users);
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                    // @ts-ignore
                    "users": err.users
                }
            };
        }
        return {
            "code": result.code,
            "body": {
                "message": result.message
            }
        };
    }

    logoutAllUsers() {
        const [result, err] = userRepository.logoutAllUsers();
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                }
            };
        }
        return {
            "code": result.code,
            "body": {
                "message": result.message
            }
        };
    }

    revokeAllUsers() {
        const [result, err] = userRepository.revokeAllUsers();
        if (err) {
            return {
                "code": err.code,
                "body": {
                    "message": err.message,
                }
            };
        }
        return {
            "code": result.code,
            "body": {
                "message": result.message
            }
        };
    }
}

const userService = new UserService();
export default userService;