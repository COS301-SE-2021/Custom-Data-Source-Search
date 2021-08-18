import {createStore} from 'vuex'
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
        getMasterKey(state) {
            return masterKey;
        },


        //Signed in User's backends related getters

        getUserBackend: (state) => (id) => {
            return state.users.find(user => user.id === id).backends;
        },
        getUserBackendNames: (state, getters) => {
          let backends = getters.getUserBackend(getters.getSignedInUserId);
          let backendsArr = [];
          for( let backend of backends){
              backendsArr.push(backend.local.name);
          }
          return backendsArr;
        },
        getUserAdminStatus: (state) => (backendID) => {
            return state.users[state.signedInUserId].backends.find(backend => backend.local.id === backendID).receive.admin;
        },


        //Unconnected backend related getters

        unconnectedBackendNo: (state) => {
            return state.users[state.signedInUserId].backends.filter(backend => backend.receive.connected === false).length;
        },
        unconnectedBackendObjects: (state) => {
            return state.users[state.signedInUserId].backends.filter(backend => backend.receive.connected === false);
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
            return state.users[state.signedInUserId].backends.find(backend => backend.local.name === backendName).receive.admin;
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

        signInThisUser: function (state, payload) {
            //Payload: masterPassword
            let thisUser = state.users[state.signedInUserId];
            let passCheck = decryptMasterKey(thisUser.info.encryptedMasterKeyObject, payload.masterPassword, thisUser.info.email);
            if (passCheck) {
                masterKey = passCheck;
                return true;
            }
            else {
                return false;
            }
        },
        signOutUser (state, payload) {
            masterKey = null;
            state.users[payload.user.id].info.isActive = false;
            for (let backend of state.users[payload.user.id].backends) {
                backend.connect.keys.sessionKey = null;
                backend.connect.keys.refreshKey = null;
            }
        },

        editBackend(state, payload) {
            let backend = state.users[payload.userIndex].backends[payload.backendIndex];
            backend.local.id = payload.id;
            backend.local.name = payload.name;
            backend.local.active = payload.active;

            backend.connect.associatedEmail = payload.associatedEmail;
            backend.connect.link = payload.link;

            backend.connect.passKey = payload.passKey;

            backend.receive.admin = payload.admin;

            let l = state.users[state.signedInUserId].backends.length;
            for(let x = 0; x < l; x++) {
                state.users[state.signedInUserId].backends[x].local.id = x;
            }
        },
        addBackend(state, payload){
            let newBackend = {
                local: {
                    id: null,
                    name: '',
                    active: null,
                },
                connect: {
                    associatedEmail: '',
                    link: '',
                    keys: {
                        secretPair: null,
                        sessionKey: null,
                        refreshKey: null
                    }
                },
                receive: {
                    admin: null,
                    connected: false
                }
            };

            newBackend.local.name = payload.name;
            newBackend.local.active = payload.active;

            newBackend.connect.associatedEmail = payload.associatedEmail;
            newBackend.connect.link = payload.link;
            newBackend.connect.keys.secretPair = payload.secretPair;
            newBackend.connect.keys.sessionKey = payload.sessionKey;
            newBackend.connect.keys.refreshKey = payload.refreshKey;

            newBackend.receive.admin = payload.admin; //Changed to a string

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
        },
        setSignedInUserID(state, payload) {
            state.signedInUserId = payload.userID;
            state.users[payload.userID].info.isActive = payload.signedIn;
            state.signedIn = true;
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
                backends: []
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
            masterKey = null;

            let x = 0;
            for (let user of state.users) {
                   user.info.id = x;
                   user.id = x++;
            }

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
                passKey: { masterKey: newPassKey.masterKey, encryptedMasterKeyObject: newPassKey.encryptedMasterKeyObject }
            });
            masterKey = newPassKey.masterKey;
        },

        //Backend management

        addNewBackend: function ({commit, getters}, payload) {
            //Payload:  name, associatedEmail, link, oneTimeKey, secret, masterPass

            //____[1]____ >>>>>>Use link to get partial_seed and partial_backendKey from wherever it comes from
            // let promise = new Promise((resolve , reject) => {
            //     fetch(payload.link)
            //         .then((res) => {
            //             // successfully got data => ie, data returned: { p_sessionKey: String, p_seed: String } (or whatever types they are)
            //             resolve(res);
            //         })
            //         .catch((err) => {
            //             // an error occurred
            //
            //             reject(err);
            //         });
            // });


            //For now, just mock the async function:
            ////___[1]___Mock Connection to retrieve partial_pair_______/////////
            let partialSecretPair = null;
            let followLinkSuccess = true;
            if (followLinkSuccess) {
                partialSecretPair = {
                    p_backendKey: 'slkj4ewodf9jlwk4j09fdw4jslef49',
                    p_seed: '3984729829r83'
                }
            }
            else {
                console.log ("OneTimeKey did not work");
                return false;
            }
            //////______End [1]_______//////


            /////_____[2]_____Get full secret pair using secret:
            /// Some kind of hash should be used, mocking for now:
            let newSecretPair = {
                backendKey:  'slkj39osdijf3w49usjdiwe',    //get by using payload.secret with partialSecretPair.p_backendKey
                seed: '34t34329238i4'                     //get by using payload.secret with partialSecretPair.p_seed
            };
            //-----------End [2]-----------////

            //Generate OTP from seed. For now, equate
            let oneTimePin = newSecretPair.seed;


            //User log in to backend
            let promise = new Promise((resolve , reject) => {
                fetch("localhost:3001/users/login", {             //Should be more general? Eg: payload.link + "/login"
                    method: 'POST',
                    body: { "email": payload.email,
                        "pass_key": newSecretPair.backendKey,
                        "otp": oneTimePin},
                    'Content-type': 'Object'
                })
                    .then((res) => {
                        // successfully got data => ie, data returned: { p_sessionKey: String, p_seed: String }

                        resolve(res);
                    })
                    .catch((err) => {
                        // an error occurred

                        reject(err);
                    });
            });



            //////_______[3]______Ask for sessionKey, refreshKeys and adminStatus from server
            //////__MOCK___//actual values to be obtained using __backendKey___
            let sessionKey = '23948uwodifjn3j498hd';
            let refreshKey = 'w34ior89o3i';
            let adminStatus = 'Editor';     //Default empty
            //if successful, continue, else fail here
            //-------------End [3]---------------////
            let masterKey = getters.getMasterKey;

            if(masterKey === null) {
                return false;
            }

            let encryptedPair = encryptJsonObject(masterKey, newSecretPair);

            commit('addBackend', {
                name: payload.name,
                associatedEmail: payload.associatedEmail,
                link: payload.link,
                secretPair: encryptedPair,
                sessionKey: sessionKey,
                refreshKey: refreshKey,
                admin: adminStatus
            });

            return true;

        },

        decryptBackendSecretPair(getters, payload) {
            let encrypted = getters.getBackendEncryptedData({id: payload.id, email: payload.email});
            let pairObject = decryptJsonObject(payload.masterKey, encrypted);
            if (!pairObject["passkey"] || !pairObject["secret"]) {
                pairObject = null;
            }
            return  {
                id: payload.id,
                email: payload.email,
                secretPair: pairObject,
            }
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
        masterKey: aes.utils.hex.fromBytes(masterKey),
        encryptedMasterKeyObject: aes.utils.hex.fromBytes(newEncryptedMasterKeyObject)
    };
}

function decryptMasterKey(encryptedMasterKeyObject, fedInPassword, email) {
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
    let masterKeyObject = JSON.parse(aes.utils.utf8.fromBytes(decrypted));
    if (!masterKeyObject["key"]) {
        return null
    } else {
        return masterKeyObject["key"];
    }
}

function encryptJsonObject(masterKey, jsonObject) {
    let aesCtr = new aes.ModeOfOperation.ctr(aes.utils.hex.toBytes(masterKey));
    let encryptedJsonObject = aesCtr.encrypt(aes.utils.utf8.toBytes(JSON.stringify(jsonObject)));
    return aes.utils.hex.fromBytes(encryptedJsonObject);
}

function decryptJsonObject(masterKey, jsonObject) {
    let encryptedJsonObject = aes.utils.hex.toBytes(jsonObject);
    let aesCtr = new aes.ModeOfOperation.ctr(masterKey);
    let decrypted = aesCtr.decrypt(encryptedJsonObject);
    return JSON.parse(aes.utils.utf8.fromBytes(decrypted));
}

let masterKey = null;

export default store;
