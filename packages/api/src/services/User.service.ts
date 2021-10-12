import userRepository from "../repositories/UserRepository";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import {generateUUID} from "../general/generalFunctions";
import fs from "fs";

class UserService {

    addInitialUser() {
        if (userRepository.getAllUsers()[0]["results"].length === 0) {
            const user = JSON.parse(fs.readFileSync(__dirname + "/initialUser.json").toString());
            console.log(this.addUser([user]));
            console.log(userRepository.getAllUsers()[0]["results"]);
            const uuid: string = userRepository.getAllUsers()[0]["results"][0]["uuid"];
            this.generateRegistrationKey([{uuid: uuid}]);
            this.sendEncodedRegistrationKeyToUser([{uuid: uuid}]);
        }
    }

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

    removeUser(users: { uuid: string }[]) {
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

    setRole(body: { role: string; users: { uuid: string }[] }) {
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

    login(body: { email: string; pass_key: string; otp: string;}) {
        const [, validateErr] = userRepository.validateUser(body.email, body.pass_key, body.otp);
        if (validateErr) {
            return {
                "code": validateErr.code,
                "body": {
                    "message": validateErr.message
                }
            };
        }
        const [tokenResult, tokenErr] = userRepository.generateRefreshToken(body.email);
        if (tokenErr) {
            return {
                "code": 500,
                "body": {
                    "message": "Unknown error when trying to generate refresh token"
                }
            };
        }
        return {
            "code": 200,
            "body": {
                "message": "Successfully logged in",
                "refresh_token": tokenResult
            }
        };
    }

    generateToken(body: { email: string; refresh_token: string; }) {
        const [validateResult, validateErr] = userRepository.validateRefreshToken(body.email, body.refresh_token);
        if (validateErr) {
            return {
                "code": validateErr.code,
                "body": {
                    "message": validateErr.message
                }
            };
        }
        let secret: string = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(validateResult, secret);
        return {
            "code": 200,
            "body": {
                "message": "Successfully generated jwt token",
                "jwt": token
            }
        };
    }

    generateRegistrationKey(users: { uuid: string; }[]) {
        const [result, err] = userRepository.generateRegistrationKey(users);
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

    sendEncodedRegistrationKeyToUser(users: { uuid: string; }[]) {
        const userResult: any[] = userRepository.getUsers(users);
        const pendingUsers = userRepository.getPendingUsers(userResult);
        for (let pendingUser of pendingUsers) {
            let encodedRegistrationKey: string = UserService.encodeRegistrationKey(
                pendingUser["email"],
                process.env.BACKEND_URL,
                pendingUser["single_use_registration_token"],
                pendingUser["secret"]
            );
            this.sendEmail(
                pendingUser["email"],
                encodedRegistrationKey,
                userResult.find(user => user["email"] === pendingUser["email"])["first_name"]
            );
        }
        if (pendingUsers.length !== users.length) {
            return {
                "code": 400,
                "body": {
                    "message": "Could not send email to all specified users"
                }
            };
        }
        return {
            "code": 200,
            "body": {
                "message": "Email sent to users"
            }
        };
    }

    private sendEmail(address: string, registrationToken: string, name: string) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: address,
            subject: 'Registration key for DataSleuth',
            text: `Dear ${name},\n\nPlease find below your registration token for the DataSleuth app:\n` +
                registrationToken +
                `\n\nYou can simply copy the token into the "Registration String" field in the app and click connect.` +
                `\n\nHappy Sleuthing!!\nDataSleuth Team`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    private static encodeRegistrationKey(email: string, BACKEND_URL: string, token: string, secret: string) {
        const emailBuffer = Buffer.from(email, 'utf-8');
        const backendBuffer = Buffer.from(BACKEND_URL, 'utf-8');
        const tokenBuffer = Buffer.from(token, 'utf-8');
        const secretBuffer = Buffer.from(secret, 'utf-8');

        const encodedEmail = emailBuffer.toString('base64');
        const encodedBackend = backendBuffer.toString('base64');
        const encodedToken = tokenBuffer.toString('base64');
        const encodedSecret = secretBuffer.toString('base64');

        return (
            encodedEmail + '.' +
            encodedBackend + '.' +
            encodedToken + '.' +
            encodedSecret
        );
    }

    register(body: { email: string; single_use_registration_token: string; }) {
        const [secret, err] = userRepository.validateRegistration(body);
        if (err) {
            return {
                "code": 400,
                "body": {
                    "message": "Invalid registration token"
                }
            };
        }
        const partialPassKey: string = generateUUID();
        const partialSeed: string = generateUUID();
        userRepository.setSeedAndPassKey(body.email, partialPassKey, partialSeed, secret);
        const [refreshToken, tokenErr] = userRepository.generateRefreshToken(body.email);
        if (tokenErr) {
            return {
                "code": 500,
                "body": {
                    "message": "Unknown error when trying to register"
                }
            };
        }
        return {
            "code": 200,
            "body": {
                "partial_pass_key": partialPassKey,
                "partial_seed": partialSeed,
                "refresh_token": refreshToken
            }
        }
    }
}

const userService = new UserService();
export default userService;