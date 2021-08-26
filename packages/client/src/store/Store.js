import {createStore} from 'vuex'
import axios from "axios";
import {authenticator} from 'otplib';
import {randomBytes, createCipheriv, createDecipheriv, pbkdf2Sync} from 'crypto'

const aes = require('aes-js');

/**
 * @typedef {Object} Backend
 * @property {number} id
 * @property {string} name
 * @property {boolean} active
 * @property {number} userIndex
 * @property {number} backendIndex
 * @property {string} associatedEmail
 * @property {string} link
 * @property {Object} passKey
 * @property {string} admin
 */

const store = createStore({

    state: {
        signedInUserId: null,
        signedIn : null,
        users: []
    },

    getters: {
    /*
    User information related getters
    ================================
     */
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

        getMasterKey() {
            return masterKey;
        },

    /*
    Signed in User's backends related getters
    =========================================
    */
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

    /*
    Unconnected backend related getters
    ===================================
     */
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
                    getters.getMasterKey,
                    getters.getSignedInUserBackend(id).connect.keys.encryptedSecretPair
                );
            } catch (ignore) {}
            return pairObject;
        }
    },

    mutations: {
        initialiseStore(state) {
            if(localStorage.getItem('store')) {
                this.replaceState(
                    Object.assign(state, JSON.parse(localStorage.getItem('store')))
                );
            }
        },

    /*
    Signed-in user backend related mutations
    ========================================
     */
        signInUser: function (state) {
            state.users[state.signedInUserId].info.isActive = true;
        },

        /**
         * Check hash of a specified user master key. Return true on success.
         *
         * Save masterKey to global variable that will not be persisted on close of app.
         *
         * @param state
         * @param {{userID: number, masterPassword: string}} payload
         * @return {boolean}
         */
        signInAUser: function (state, payload) {
            const thisUser = state.users[payload.userID];
            const candidateKey = generateMasterKey(payload.masterPassword, thisUser.info.email);
            try {
                decryptJsonObject(
                    candidateKey,
                    thisUser.backends.find(b => b.local.id === 0).connect.keys.encryptedSecretPair
                )
            } catch (e) {
                console.log(e)
                return false;
            }
            state.users[payload.userID].info.isActive = true;
            state.signedInUserId = payload.userID;
            masterKey = candidateKey;
            return true;
        },

        /**
         * Call signInAUser with the currently signed in user id
         *
         * @param state
         * @param payload
         */
        signInThisUser: function (state, payload) {
            payload.userID = state.signedInUserId;
            this.commit("signInAUser", payload);
        },

        /**
         * Sign out the specified user; delete all their decrypted keys from store.
         *
         * @param state
         * @param {{userID: number}} payload
         */
        signOutUser (state, payload) {
            masterKey = null;
            state.users[payload.userID].info.isActive = false;
            state.signedIn = false;
            for (let backend of state.users[payload.userID].backends) {
                backend.connect.keys.sessionKey = null;
                backend.connect.keys.refreshToken = null;
            }
        },

        /**
         * @param state
         * @param {Backend} payload
         */
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
            //
            let l = state.users[state.signedInUserId].backends.length;
            for(let x = 0; x < l; x++) {
                state.users[state.signedInUserId].backends[x].local.id = x;
            }
        },


        /**
         * @param state
         * @param {{
         *      name: string,
         *      associatedEmail: string,
         *      link: string,
         *      secretPair: Object,
         *      refreshToken: string
         *  }} payload
         */
        addBackend(state, payload){
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
                        encryptedSecretPair: null,
                        jwtToken: null,
                        refreshToken: null
                    }
                },
                receive: {
                    admin: null,
                    connected: false
                }
            };
            // Local
            newBackend.local.name = payload.name;
            // Connect
            newBackend.connect.associatedEmail = payload.associatedEmail;
            newBackend.connect.link = payload.link;
            newBackend.connect.keys.secretPair = payload.secretPair;
            newBackend.connect.keys.refreshToken = payload.refreshToken;
            //
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

    /*
    User management
    ===============
     */
        /**
         * @param state
         * @param {boolean} signedIn
         */
        setSignedIn(state, signedIn){
            state.signedIn = signedIn;
            if (!signedIn) {
                masterKey = null;
            }
        },

        /**
         * @param state
         * @param {{userID: number, signedIn: boolean}} payload
         */
        setSignedInUserID(state, payload) {
            state.signedInUserId = payload.userID;
            if (payload.userID != null) {
                state.users[payload.userID].info.isActive = payload.signedIn;
                state.signedIn = true;
            } else {
                state.signedIn = null;
            }
        },

        /**
         * @param state
         * @param {{name: string, email: string, hasVault: boolean, localEncryptedSecretPair: Object}} payload
         */
        addUserToLocalList(state, payload) {
            let newUser = {
                id: null,
                info: {
                    id: null,
                    name: null,
                    email: null,
                    isActive: true,
                    hasVault: null,
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
                            encryptedSecretPair: payload.localEncryptedSecretPair,
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

        /**
         * @param state
         * @param {{deleteVault: boolean, user: Object}} payload
         */
        deleteUserFromLocalList (state, payload) {
            if (payload.deleteVault) {
                //Do some server side call to delete file on web
            }
            //Delete local
            state.users.splice(payload.user.id, 1);
            masterKey = null;
            let x = 0;
            for (let user of state.users) {
                   user.info.id = x;
                   user.id = x++;
            }
        },

    /*
    User Backend Token Management
    =============================
     */
        /**
         * @param state
         * @param {{id: number, needsLogin: boolean}} payload
         */
        setBackendLoginStatus(state, payload) {
            state.users[state.signedInUserId].backends
                .find(backend => backend.local.id === payload.id).connect.needsLogin = payload.needsLogin;
        },

        /**
         * @param state
         * @param {{id: number, refreshToken: string}} payload
         */
        setRefreshToken(state, payload) {
            state.users[state.signedInUserId].backends
                .find(backend => backend.local.id === payload.id).connect.keys.refreshToken = payload.refreshToken;
        },

        /**
         * @param state
         * @param {{id: number, jwtToken: string}} payload
         */
        setJWTToken(state, payload) {
            state.users[state.signedInUserId].backends
                .find(backend => backend.local.id === payload.id).connect.keys.jwtToken = payload.jwtToken
        }
    },

    actions : {
    /*
    User management
    ===============
     */
        /**
         * @param commit
         * @param {{masterPassword: string, email: string, name: string, hasVault: boolean}} payload
         */
        addNewUser: function ({commit}, payload) {
            commit('addUserToLocalList', {
                name: payload.name,
                email: payload.email,
                hasVault: payload.hasVault,
                localEncryptedSecretPair: encryptJsonObject(
                    generateMasterKey(payload.masterPassword, payload.email),
                    {
                        passKey: randomBytes(32).toString('hex'),
                        seed: randomBytes(32).toString('hex')
                    }
                )
            });
        },

    /*
    User Backend Token Management
    =============================
         */
        /**
         * A function that attempts to refresh the JWT token of the specified backend. Returns true on success.
         *
         * If the refresh token has expired the backendLogin function will be called to get a new refresh token (if
         * this is possible) and a second attempt at refreshing the JWT token will be made.
         *
         * @param dispatch
         * @param commit
         * @param getters
         * @param {{id: number}} payload
         * @returns {Promise<void>}
         */
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

        /**
         * @param commit
         * @param getters
         * @param {{id: number}} payload
         * @return {Promise<void>}
         */
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

        /**
         * @param commit
         * @param getters
         * @param {{
         *      seed: string,
         *      name: string,
         *      associatedEmail: string,
         *      link: string,
         *      refreshToken: string,
         *      passKey: string
         * }} payload
         */
        addNewBackend: function ({commit, getters}, payload) {
            let masterKey = getters.getMasterKey;
            if(masterKey === null) {
                return;
            }
            let encryptedPair = encryptJsonObject(
                masterKey,
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

store.subscribe((mutation, state) => {
    localStorage.setItem('store', JSON.stringify(state));
});

/*
Helper Cryptography Functions
=============================
 */
/**
 * Derive a master key from master password, email and pepper.
 *
 * @param masterPassword
 * @param email
 * @return {string}
 */
function generateMasterKey(masterPassword, email) {
    return pbkdf2Sync(
        masterPassword,
        email + PEPPER,
        1000000,
        32,
        'sha512'
    ).toString('hex');
}

/**
 * @param masterKey
 * @param jsonObject
 * @return {{authTag: string, data: string}}
 */
function encryptJsonObject(masterKey, jsonObject) {
    const iv = randomBytes(16);
    const cipher = createCipheriv(
        'aes-256-gcm',
        Buffer.from(masterKey, 'hex'),
        iv
    )
    let encryptedJsonObject = cipher.update(JSON.stringify(jsonObject), 'utf-8', 'hex');
    encryptedJsonObject += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    console.log(authTag)
    return {
        iv: iv.toString('hex'),
        authTag: authTag,
        data: encryptedJsonObject
    };
}

/**
 * @param masterKey
 * @param encryptedJsonObject
 * @return {Object|error}
 */
function decryptJsonObject(masterKey, encryptedJsonObject) {
    const decipher = createDecipheriv(
        'aes-256-gcm',
        Buffer.from(masterKey, 'hex'),
        Buffer.from(encryptedJsonObject.iv, 'hex')
    )
    let decrypted = decipher.update(encryptedJsonObject.data, 'hex', 'utf-8');
    console.log(encryptedJsonObject.authTag);
    decipher.setAuthTag(Buffer.from(encryptedJsonObject.authTag, 'hex'));
    decrypted += decipher.final('utf-8');
    return JSON.parse(decrypted);
}

// masterKey is stored like this to ensure it is thrown away upon closing of app.
let masterKey = null;
const PEPPER = "11 f3 f5 72 e8 25 d8 79 ec e9 e5 4a a8 3c 8b 66";

export default store;
