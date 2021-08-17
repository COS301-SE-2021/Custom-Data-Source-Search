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
        getUserHashCorrect: (state) => (payload) => {
            let pw = state.users[payload.id].info.hash;
            let h = 0, l = pw.length, i = 0;
            if ( l > 0 )
                while (i < l)
                    h = (h << 5) - h + pw.charCodeAt(i++) | 0;

            return h === payload.hash;

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
            thisUserPassKey.masterPassKey = generateMasterKey(payload.passWord, payload.email);
            let thisUser =  state.users.find( user => user.info.email === payload.email);
            thisUser.info.isActive = true;
        },

        signOutUser (state, payload) {
            state.passKeyArr[payload.user.id].masterPassKey = null;
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
            newBackend.connect.passKey = payload.passKey;

            newBackend.receive.admin = payload.admin; //Include, because we will have the result by now

            state.users[payload.userIndex].backends.push(newBackend);
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
            //Payload: name, email, hasVault, passKey: { masterPassKey, encryptedMasterPassKey}
            let newUser = {
                id: null,
                info: {
                    id: null,
                    name: null,
                    email: null,
                    isActive: true,
                    hasVault: null,
                    masterPassKey: null
                },
                backends: []
            };

            newUser.info.name = payload.name;
            newUser.info.email = payload.email;
            newUser.info.isActive = true;
            newUser.info.hasVault = payload.hasVault;
            newUser.info.encryptedMasterPassKey = payload.passKey.masterPassKey;

            state.users.push(newUser);
            state.passKeyArr.push({
                id: null,
                email: payload.email,
                masterPassKey: payload.passKey.masterPassKey
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

            commit('addUserToLocalList', {name: payload.name, email: payload.email, hasVault: payload.hasVault, passKey: newPassKey});
        },

        //Backend management

        addNewBackend: function ({commit}, payload) {
            //Payload: name, active, associatedEmail, link, oneTimeKey, secret, userIndex, send: admin

        },


        encryptAndSaveBackendSecretPair(commit, payload) {
            let aesCtr = new aes.ModeOfOperation.ctr(payload.masterKey);
            let encryptedSecretPair = aesCtr.encrypt(payload.secretPair.toBytes());
            commit.saveEncryptedBackendSecretPair({
                id: payload.id,
                email: payload.email,
                secretPair: aes.utils.hex.fromBytes(encryptedSecretPair),
            });
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

    console.log ("Generating masterPassKey");

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
        masterPassKey: masterKey,
        encryptedMasterKey: aes.utils.hex.fromBytes(newEncryptedMasterKey)
    };
}

function decryptMasterKey(encryptedMasterPassKey, fedInPassword, email) {
    //Parameters: encryptedMasterPassKey,
    let decryptionKey = pbkdf2.pbkdf2Sync(
        JSON.stringify(fedInPassword),
        email,
        1000,
        256 / 8,
        'sha512'
    );

    let masterKeyEncrypted = aes.utils.hex.toBytes(encryptedMasterPassKey);
    let easCtr = new aes.ModeOfOperation.ctr(decryptionKey);
    let masterKeyObject = aes.utils.hex.fromBytes(easCtr.decrypt(masterKeyEncrypted));
    if (!masterKeyObject["key"]) {
        masterKeyObject = null
    }
    return masterKeyObject;
}


export default store;
