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

    addUser(user: { name: string; surname: string; email: string; permission: string }) {
        const [, err] = userRepository.addUser(user);
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
}

const userService = new UserService();
export default userService;