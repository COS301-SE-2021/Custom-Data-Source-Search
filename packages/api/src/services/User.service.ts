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
                    "message": err.message
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
                    "message": err.message
                }
            }
        }
        return {
            "code": 204,
            "message": "Successfully deleted specified users"
        }
    }
}

const userService = new UserService();
export default userService;