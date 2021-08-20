import {createStore} from 'vuex'
import axios from "axios";
import {authenticator} from 'otplib';

const pbkdf2 = require('pbkdf2');
const aes = require('aes-js');

const store = createStore({
    state:{
        signedInUserId: null,
        signedIn : null,
        users: []
    },
    getters:{
        //User information related getters
        getNewAppStatus (state) {
            return state.users.length === 0;
        },
        getSignedIn(state){
            return state.signedIn;
        },
        getUserInfo: (state) => (id) => {
            return state.users.find(user => user.id === id).info;
        },
        getArrUserInfo(state) {
            let users = [];
            for (let x = 0; x < state.users.length; x++) {
                users.push(state.users[x].info);
            }
            return users;
        },
        getSignedInUserId(state){
            return state.signedInUserId;
        },
        getUserMasterEmailsArr(state) {
            let userNamesArr = [];
            for (let user of state.users) {
                userNamesArr.push(user.info.email);
            }
            return userNamesArr;
        },
        getMasterKeyObject(state) {
            return masterKeyObject;
        },
        //Signed in User's backends related getters
        getUserBackends: (state) => (id) => {
            return state.users.find(user => user.id === id).backends;
        },
        getSignedInUserBackend: (state, getters) => (id) => {
            return getters.getUserBackends(getters.getSignedInUserId).find(b => b.local.id === id)
        },
        getUserBackendNames: (state, getters) => {
          let backends = getters.getUserBackends(getters.getSignedInUserId);
          let backendsArr = [];
          for( let backend of backends){
              backendsArr.push(backend.local.name);
          }
          return backendsArr;
        },
        getUserAdminStatus: (state, getters) => (backendID) => {
            return getters.getSignedInUserBackend(backendID).receive.admin;
        },

        //Unconnected backend related getters
        unconnectedBackendNo: (state) => {
            return state.users[state.signedInUserId].backends
                .filter(backend => backend.connect.needsLogin === true).length;
        },
        unconnectedBackendObjects: (state) => {
            return state.users[state.signedInUserId].backends.filter(backend => backend.connect.needsLogin === true);
        },
        unconnectedBackendNames: (state, getters) => {
            let unconnectedBackends = getters.unconnectedBackendObjects;
            let unconnectedBackendNamesArr = [];
            for (let backend of unconnectedBackends) {
                unconnectedBackendNamesArr.push(backend.local.name);
            }
            return unconnectedBackendNamesArr;
        },
        unconnectedBackendBool: (state, getters) => {
            return getters.unconnectedBackendNo !== 0;
        },
        //idea: get the user backends -> find the backend which matches the name -> get the property isAdmin from that result
        //should return true or false
        //this would allow us to determine whether or not a data source can be edited/deleted by a user
        getBackendAdminStatus: (state) => (backendName) => {
            return state.users[state.signedInUserId].backends
                .find(backend => backend.local.name === backendName).receive.admin;
        },
        getBackendLinkUsingName: (state) => (backendName) => {
            return state.users[state.signedInUserId].backends
                .find(backend => backend.local.name === backendName).connect.link;
        },
        getBackendLink: (state, getters) => (id) => {
            return getters.getSignedInUserBackend(id).connect.link;
        },
        getBackendLinkViaName: (state, getters) => (name) => {
            return getters.getUserBackends(getters.getSignedInUserId)
                .find(b => b.local.name === name).connect.link;
        },
        getBackendJWTToken: (state, getters) => (id) => {
            return getters.getSignedInUserBackend(id).connect.keys.jwtToken;
        },
        getBackendRefreshToken: (state, getters) => (id) => {
          return getters.getSignedInUserBackend(id).connect.keys.refreshToken;
        },
        getBackendUserEmail: (state, getters) => (id) => {
          return getters.getSignedInUserBackend(id).connect.associatedEmail;
        },
        getBackendSecretPair: (state, getters) => (id) => {
            let pairObject = null;
            try {
                pairObject =  decryptJsonObject(
                    getters.getMasterKeyObject["key"],
                    getters.getSignedInUserBackend(id).connect.keys.secretPair
                );
            } catch (ignore) {}
            return pairObject;
        }
    },
    //synchronous changes to the store
    mutations: {
        //Initialise Store from local storage
        initialiseStore(state) {
            // Check if the ID exists
            if(localStorage.getItem('store')) {
                // Replace the state object with the stored item
                this.replaceState(
                    Object.assign(state, JSON.parse(localStorage.getItem('store')))
                );
            }
        },
        //Signed-in user backend related mutations
        //Action will call this specific mutation after password validation checks out
        signInUser: function (state, payload) {
            let thisUser = state.users[state.signedInUserId];
            thisUser.info.isActive = true;
        },
        signInAUser: function (state, payload) {
            //Payload: masterPassword, user { id, etc}
            let thisUser = state.users[payload.userID];
            let passCheck = decryptMasterKeyObject(
                thisUser.info.encryptedMasterKeyObject,
                payload.masterPassword,
                thisUser.info.email
            );
            if (passCheck) {
                state.users[payload.userID].info.isActive = true;
                state.signedInUserId = payload.userID;
                masterKeyObject = passCheck;
                return true;
            }
            else {
                return false;
            }
        },
        signInThisUser: function (state, payload) {
            //Payload: masterPassword
            let thisUser = state.users[state.signedInUserId];
            let passCheck = decryptMasterKeyObject(
                thisUser.info.encryptedMasterKeyObject,
                payload.masterPassword,
                thisUser.info.email
            );
            if (passCheck) {
                masterKeyObject = passCheck;
                state.users[state.signedInUserId].info.isActive = true;
                return true;
            }
            else {
                return false;
            }
        },
        signOutUser (state, payload) {
            // Payload: user { id, name, email, isActive, hasVault, encryptedMasterKey }
            masterKeyObject = null;
            state.users[payload.user.id].info.isActive = false;
            state.signedIn = false;
            for (let backend of state.users[payload.user.id].backends) {
                backend.connect.keys.sessionKey = null;
                backend.connect.keys.refreshToken = null;
            }
        },
        editBackend(state, payload) {
            let backend = state.users[payload.userIndex].backends[payload.backendIndex];
            // Local
            backend.local.id = payload.id;
            backend.local.name = payload.name;
            backend.local.active = payload.active;
            // Connect
            backend.connect.associatedEmail = payload.associatedEmail;
            backend.connect.link = payload.link;
            backend.connect.passKey = payload.passKey;
            // Receive
            backend.receive.admin = payload.admin;
            let l = state.users[state.signedInUserId].backends.length;
            for(let x = 0; x < l; x++) {
                state.users[state.signedInUserId].backends[x].local.id = x;
            }
        },
        addBackend(state, payload){
            //Payload: name, associatedEmail, link, secretPair, refreshToken
            let newBackend = {
                local: {
                    id: null,
                    name: '',
                    active: true,
                    color: '#41D6C5'
                },
                connect: {
                    associatedEmail: '',
                    link: '',
                    needsLogin: false,
                    keys: {
                        secretPair: null,
                        jwtToken: null,
                        refreshToken: null
                    }
                },
                receive: {
                    admin: null,
                    connected: false
                }
            };

            newBackend.local.name = payload.name;

            newBackend.connect.associatedEmail = payload.associatedEmail;
            newBackend.connect.link = payload.link;
            newBackend.connect.keys.secretPair = payload.secretPair;
            newBackend.connect.keys.refreshToken = payload.refreshToken;

            state.users[state.signedInUserId].backends.push(newBackend);
            state.signedIn = true;
            let l = state.users[state.signedInUserId].backends.length;
            for(let x = 0; x < l; x++) {
                state.users[state.signedInUserId].backends[x].local.id = x;
            }
        },
        deleteBackend(state, payload) {
            state.users[state.signedInUserId].backends.splice(payload,1);
            let l = state.users[state.signedInUserId].backends.length;
            for(let x = 0; x < l; x++) {
                state.users[state.signedInUserId].backends[x].local.id = x;
            }
        },

        //User management
        setSignedIn(state, payload){
            state.signedIn = payload;
            if (!payload) {
                masterKeyObject = null;
            }
        },
        setSignedInUserID(state, payload) {
            state.signedInUserId = payload.userID;
            if ( payload.userID != null ){
                state.users[payload.userID].info.isActive = payload.signedIn;
                state.signedIn = true;
            } else {
                state.signedIn = null;
            }
        },
        addUserToLocalList(state, payload) {
            //Payload: name, email, hasVault, passKey: { encryptedMasterKeyObject}
            let newUser = {
                id: null,
                info: {
                    id: null,
                    name: null,
                    email: null,
                    isActive: true,
                    hasVault: null,
                    encryptedMasterKeyObject: null
                },
                backends: [{
                    local: {
                        id: 0,
                        name: 'Local',
                        active: true,
                        color: '#41D6C5'
                    },
                    connect: {
                        associatedEmail: payload.email,
                        link: 'localhost:3001',
                        needsLogin: false,
                        keys: {
                            secretPair: null,
                            jwtToken: null,
                            refreshToken: null
                        }
                    },
                    receive: {
                        admin: null,
                        connected: false
                    }
                }]
            };

            newUser.info.name = payload.name;
            newUser.info.email = payload.email;
            newUser.info.isActive = true;
            newUser.info.hasVault = payload.hasVault;
            newUser.info.encryptedMasterKeyObject = payload.passKey.encryptedMasterKeyObject;

            state.users.push(newUser);

            let x = 0;
            for (let user of state.users) {
                user.id = x;
                user.info.id = x;
                x++;
            }

            state.signedInUserId = state.users.length-1;
            state.signedIn = true;
        },
        deleteUserFromLocalList (state, payload) {
            if (payload.deleteVault) {
                //Do some server side call to delete file on web
            }
            //Delete local
            state.users.splice(payload.user.id, 1);
            masterKeyObject = null;
            let x = 0;
            for (let user of state.users) {
                   user.info.id = x;
                   user.id = x++;
            }
        },
        setBackendLoginStatus(state, payload) {
            state.users[state.signedInUserId].backends
                .find(backend => backend.local.id === payload.id).connect.needsLogin = payload.needsLogin;
        },
        setRefreshToken(state, payload) {
            state.users[state.signedInUserId].backends
                .find(backend => backend.local.id === payload.id).connect.keys.refreshToken = payload.refreshToken;
        },
        setJWTToken(state, payload) {
            state.users[state.signedInUserId].backends
                .find(backend => backend.local.id === payload.id).connect.keys.jwtToken = payload.jwtToken
        }
    },
    //asynchronous actions that will result in mutations on the state being called -> once asynch. op. is done, you call the mutation to update the store
    actions : {
        //User management
        addNewUser: function ({commit}, payload) {
            //Payload: name, email, masterPassword, hasVault
            let newPassKey = generateMasterKey(payload.masterPassword, payload.email);
            commit('addUserToLocalList', {
                name: payload.name,
                email: payload.email,
                hasVault: payload.hasVault,
                passKey: {
                    masterKey: newPassKey.masterKey,
                    encryptedMasterKeyObject: newPassKey.encryptedMasterKeyObject
                }
            });
        },
        refreshJWTToken: async function ({dispatch, commit, getters}, payload) {
            const url = "http://" + getters.getBackendLink(payload.id) + "/users/generatetoken";
            const email = getters.getBackendUserEmail(payload.id);
            await axios
                .post(url, {email: email, refresh_token: getters.getBackendRefreshToken(payload.id)})
                .then((resp) => {
                    commit('setJWTToken', {
                        id: payload.id,
                        jwtToken: resp.data.jwt
                    })
                })
                .catch(async () => {
                    await dispatch("backendLogin", {id: payload.id})
                    await axios
                        .post(url, {email: email, refresh_token: getters.getBackendRefreshToken(payload.id)})
                        .then((resp) => {
                            commit('setJWTToken', {
                                id: payload.id,
                                jwtToken: resp.data.jwt
                            })
                        })
                        .catch((e) => {
                            console.error(e);
                        })
                });
        },
        backendLogin: async function ({commit, getters}, payload) {
            let secretPair = getters.getBackendSecretPair(payload.id);
            if(secretPair === null) {
                commit('setBackendLoginStatus', {
                    id: payload.id,
                    needsLogin: true
                })
                return;
            }
            await axios.post(
                "http://" + getters.getBackendLink(payload.id) + "/users/login",
                {
                        email: getters.getBackendUserEmail(payload.id),
                        pass_key: secretPair.backendKey,
                        otp: authenticator.generate(secretPair.seed)
                    }
                )
                .then((resp) => {
                    commit('setBackendLoginStatus', {
                        id: payload.id,
                        needsLogin: false
                    })
                    commit('setRefreshToken', {
                        id: payload.id,
                        refreshToken: resp.data.refresh_token
                    })
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        //Backend management
        addNewBackend: function ({commit, getters}, payload) {
            //Payload: name, associatedEmail, link, passKey, seed, refreshToken
            let masterKeyObject = getters.getMasterKeyObject;
            if(masterKeyObject === null) {
                return;
            }
            let encryptedPair = encryptJsonObject(
                masterKeyObject["key"],
                {backendKey: payload.passKey, seed: payload.seed}
            );
            commit('addBackend', {
                name: payload.name,
                associatedEmail: payload.associatedEmail,
                link: payload.link,
                secretPair: encryptedPair,
                refreshToken: payload.refreshToken
            });
        }
    }
});

// Subscribe to store updates
store.subscribe((mutation, state) => {
    // Store the state object as a JSON string
    localStorage.setItem('store', JSON.stringify(state));
});

function generateMasterKey(masterPassword, email) {
    let encryptionKey = pbkdf2.pbkdf2Sync(
        masterPassword,
        email,
        1000,
        256 / 8,
        'sha512'
    );

    // Generate random key to be encrypted by master key
    let masterKey = new Uint8Array(256 / 8);
    window.crypto.getRandomValues(masterKey);

    // Encrypt this random key
    let aesCtr = new aes.ModeOfOperation.ctr(encryptionKey);
    let masterKeyObject = aes.utils.utf8.toBytes(JSON.stringify({"key": aes.utils.hex.fromBytes(masterKey)}));
    let newEncryptedMasterKeyObject = aesCtr.encrypt(masterKeyObject);

    // Return Encrypted key
    return {
        masterKey: masterKey,
        encryptedMasterKeyObject: aes.utils.hex.fromBytes(newEncryptedMasterKeyObject)
    };
}

function decryptMasterKeyObject(encryptedMasterKeyObject, fedInPassword, email) {
    let decryptionKey = pbkdf2.pbkdf2Sync(
        fedInPassword,
        email,
        1000,
        256 / 8,
        'sha512'
    );
    let masterKeyEncrypted = aes.utils.hex.toBytes(encryptedMasterKeyObject);
    let easCtr = new aes.ModeOfOperation.ctr(decryptionKey);
    let decrypted = easCtr.decrypt(masterKeyEncrypted);
    try {
        return JSON.parse(aes.utils.utf8.fromBytes(decrypted));
    } catch (e) {
        return null;
    }
}

function encryptJsonObject(masterKey, jsonObject) {
    let aesCtr = new aes.ModeOfOperation.ctr(aes.utils.hex.toBytes(masterKey));
    let encryptedJsonObject = aesCtr.encrypt(aes.utils.utf8.toBytes(JSON.stringify(jsonObject)));
    return aes.utils.hex.fromBytes(encryptedJsonObject);
}

function decryptJsonObject(masterKey, jsonObject) {
    let encryptedJsonObject = aes.utils.hex.toBytes(jsonObject);
    let aesCtr = new aes.ModeOfOperation.ctr(aes.utils.hex.toBytes(masterKey));
    let decrypted = aesCtr.decrypt(encryptedJsonObject);
    return JSON.parse(aes.utils.utf8.fromBytes(decrypted));
}

let masterKeyObject = null;

export default store;
