import {createStore} from 'vuex'
const pbkdf2 = require('pbkdf2');
const aes = require('aes-js');

const store = createStore({
    state:{
        signedInUserId: null,
        signedIn : null,
        passKeyArr: [],
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
            // for (let key of state.passKeyArr) {
            //     console.log("PassKey: " + JSON.stringify(key.id) + ", has passKey: " + JSON.stringify(key.masterKey));
            // }
            let masterKey = state.passKeyArr[state.signedInUserId].masterKey
            console.log("Master Key: " + JSON.stringify(masterKey));
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
            let thisUserPassKey = state.passKeyArr.find(thisUser => thisUser.email === payload.email);
            thisUserPassKey.masterKey = generateMasterKey(payload.passWord, payload.email);
            let thisUser =  state.users.find( user => user.info.email === payload.email);
            thisUser.info.isActive = true;
        },

        signInThisUser: function (state, payload) {
            //Payload: masterPassword
            let thisUser = state.users[state.signedInUserId];
            let passCheck = decryptMasterKey(thisUser.info.encryptedMasterKey, payload.masterPassword, thisUser.info.email);
            if (passCheck) {
                state.passKeyArr[state.signedInUserId].masterKey = passCheck;
            }
        },
        signOutUser (state, payload) {
            state.passKeyArr[payload.user.id].masterKey = null;
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
            //Payload: name, email, hasVault, passKey: { masterKey, encryptedMasterKey}
            let newUser = {
                id: null,
                info: {
                    id: null,
                    name: null,
                    email: null,
                    isActive: true,
                    hasVault: null,
                    encryptedMasterKey: null
                },
                backends: []
            };

            newUser.info.name = payload.name;
            newUser.info.email = payload.email;
            newUser.info.isActive = true;
            newUser.info.hasVault = payload.hasVault;
            newUser.info.encryptedMasterKey = payload.passKey.encryptedMasterKey;

            state.users.push(newUser);
            state.passKeyArr.push({
                id: null,
                email: payload.email,
                masterKey: payload.passKey.masterKey
            });

            let x = 0;
            for (let user of state.users) {
                user.id = x;
                user.info.id = x;
                    state.passKeyArr[x].id = x;
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
            state.passKeyArr.splice(payload.user.id, 1);

            let x = 0;
            for (let user of state.users) {
                   user.info.id = x;
                   user.id = x++;
                   state.passKeyArr[x].id = x;
            }

        }

    },

    //asynchronous actions that will result in mutations on the state being called -> once asynch. op. is done, you call the mutation to update the store
    actions : {
        //User management

        addNewUser: function ({commit}, payload) {
            //Payload: name, email, masterPassword, hasVault
            console.log ("Adding a new user");

            let newPassKey = generateMasterKey(payload.masterPassword, payload.email);

            commit('addUserToLocalList', {
                name: payload.name,
                email: payload.email,
                hasVault: payload.hasVault,
                passKey: { masterKey: newPassKey.masterKey, encryptedMasterKey: newPassKey.encryptedMasterKey }
            });
        },

        //Backend management

        addNewBackend: function ({commit, getters}, payload) {
            //Payload:  name, associatedEmail, link, oneTimeKey, secret, masterPass
            console.log("Adding a new backend");

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

            //////_______[3]______Ask for sessionKey, refreshKeys and adminStatus from server
            //////__MOCK___//actual values to be obtained using __backendKey___
            let sessionKey = '23948uwodifjn3j498hd';
            let refreshKey = 'w34ior89o3i';
            let adminStatus = 'Editor';     //Default empty
            //if successful, continue, else fail here
            //-------------End [3]---------------////
            let masterKey = getters.getMasterKey;

            console.log("Problems");

            if(masterKey === null) {
                console.log ("No master Key");
                return false;
            }

            let encryptedPair = encryptBackendSecretPair(masterKey, newSecretPair);

            commit('addBackend', {
                name: payload.name,
                associatedEmail: payload.associatedEmail,
                link: payload.link,
                secretPair: encryptedPair,
                sessionKey: sessionKey,
                refreshKey: refreshKey,
                admin: adminStatus
            })


        },

        decryptBackendSecretPair(getters, payload) {
            let encrypted = getters.getBackendEncryptedData({id: payload.id, email: payload.email});
            let encryptedSecretPair = aes.utils.hex.toBytes(encrypted.secretPair);
            let aesCtr = new aes.ModeOfOperation.ctr(payload.masterKey);
            let stringPair = aesCtr.decrypt(encryptedSecretPair);
            let pairObject = stringPair.toJSON();
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
    //Payload: masterPassword, email

    console.log ("Generating masterKey");

    let encryptionKey = pbkdf2.pbkdf2Sync(
        JSON.stringify(masterPassword),
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
    let newEncryptedMasterKey = aesCtr.encrypt(masterKey);

    // Return Encrypted key
    return {
        masterKey: aes.utils.hex.fromBytes(masterKey),
        encryptedMasterKey: aes.utils.hex.fromBytes(newEncryptedMasterKey)
    };
}

function decryptMasterKey(encryptedmasterKey, fedInPassword, email) {
    //Parameters: encryptedmasterKey,
    let decryptionKey = pbkdf2.pbkdf2Sync(
        JSON.stringify(fedInPassword),
        email,
        1000,
        256 / 8,
        'sha512'
    );

    let masterKeyEncrypted = aes.utils.hex.toBytes(encryptedmasterKey);
    let easCtr = new aes.ModeOfOperation.ctr(decryptionKey);
    let masterKeyObject = aes.utils.hex.fromBytes(easCtr.decrypt(masterKeyEncrypted));
    if (!masterKeyObject["key"]) {
        masterKeyObject = null
    }
    return masterKeyObject;
}

function  encryptBackendSecretPair(masterKey, secretPair) {
    console.log("We encrypt again");
    let aesCtr = new aes.ModeOfOperation.ctr(aes.utils.hex.toBytes(masterKey));
    console.log("Middle of secret pair encryption");
    let encryptedSecretPair = aesCtr.encrypt(aes.utils.hex.toBytes(secretPair));
    console.log("ddd");
    return aes.utils.hex.fromBytes(encryptedSecretPair);
}


export default store;
