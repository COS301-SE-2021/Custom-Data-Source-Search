import {createStore} from 'vuex'

const store = createStore({
    state:{
        signedInUserId: 2,
        signedIn : false,
        users: [
            {
                id: 0,
                info: {
                    id: 0,
                    name: 'Marike',
                    email: 'example@funsail.co.za',
                    isActive: true,
                },
                backends: [
                    {
                       local: {
                           id: 0,
                           name: 'BIRDS',
                           color: '#b34e47',
                           active: true
                       },
                        connect: {
                            associatedEmail: 'marike@funsail.co.za',
                            link: 'www.birdsOfEden/inventoryLink/23NSLud93nfskdj',
                            passKey: 'w489wdN49h$rKLJHF498Yuw9UE4ER89dHWIe4tdfg4REWGsfg'
                        },
                        receive: {
                            admin: true,
                            connected: true
                        }
                    },
                    {
                        local: {
                            id: 1,
                            name: 'LEGO',
                            color: '#21b312',
                            active: false
                        },
                        connect: {
                            associatedEmail: 'marike1@funsail.co.za',
                            link: 'www.justAnotherExample/LEGO/BACKEND',
                            passKey: 'new84lLKJREpassKD9e7edfjKey'
                        },
                        receive: {
                            admin: true,
                            connected: true
                        }
                    },
                    {
                        local: {
                            id: 2,
                            name: 'Fluffy',
                            color: '#41B3B2',
                            active: true
                        },
                        connect: {
                            associatedEmail: 'marike2@funsail.co.za',
                            link: 'www.fulffy&Bubbles/backend/link',
                            passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg'
                        },
                        receive: {
                            admin: true,
                            connected: true
                        }
                    }
                ]
            },
            {
                id: 1,
                info: {
                    id: 1,
                    name: 'Josh',
                    email: 'joshwalkerdev@gmail.com',
                    isActive: false
                },
                backends: [
                    {
                        local: {
                            id: 0,
                            name: 'CARS',
                            color: '#b30a8c',
                            active: true
                        },
                        connect: {
                            associatedEmail: 'josh1@gmail.com',
                            link: 'www.randomCarType/inventoryLink/23NSLud93nfskdj',
                            passKey: 'w489wdN49h$rKL_passKey_9dHWIe4tdfg4REWGsfg'
                        },
                       receive: {
                            admin: false,
                            connected: false
                       }
                    },
                    {
                        local: {
                            id: 1,
                            name: 'WINDOWS',
                            color: '#fdff23',
                            active: false
                        },
                        connect: {
                            associatedEmail: 'josh2@gmail.com',
                            link: 'www.justAnotherExample/windows/BACKEND',
                            passKey: 'new84lLKJREpassKD9e7edfjKey'
                        },
                        receive: {
                            admin: false,
                            connected: true
                        }
                    },
                    {
                        local: {
                            id: 2,
                            name: 'TEST',
                            color: '#41B3B2',
                            active: true
                        },
                        connect: {
                            associatedEmail: 'josh3@gmail.com',
                            link: 'www.doesnotmattermuch/backend/link',
                            passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg'
                        },
                        receive: {
                            admin: false,
                            connected: true
                        }
                    }
                ]
            },
            {
                id: 2,
                info: {
                    id: 2,
                    name: 'Lauren',
                    email: 'lauren@gmail.com',
                    isActive: true
                },
                backends: [
                    {
                        local: {
                            id: 0,
                            name: 'BIRDS',
                            color: '#25b313',
                            active: true
                        },
                        connect: {
                            associatedEmail: 'lauren1@gmail.com',
                            link: 'www.birdsOfEden/inventoryLink/23NSLud93nfskdj',
                            passKey: 'w489wdN49h$rKLJHF498Yuw9UE4ER89dHWIe4tdfg4REWGsfg'
                        },
                        receive: {
                            admin: false,
                            connected: false
                        }
                    },
                    {
                        local: {
                            id: 1,
                            name: 'LEGO',
                            color: '#1616b3',
                            active: false
                        },
                        connect: {
                            associatedEmail: 'lauren2@gmail.com',
                            link: 'www.justAnotherExample/LEGO/BACKEND',
                            passKey: 'new84lLKJREpassKD9e7edfjKey'
                        },
                        receive: {
                            admin: true,
                            connected: false
                        }
                    },
                    {
                        local: {
                            id: 2,
                            name: 'Fluffy',
                            color: '#b3100c',
                            active: true
                        },
                        connect: {
                            associatedEmail: 'lauren2@gmail.com',
                            link: 'www.fulffy&Bubbles/backend/link',
                            passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg'
                        },
                        receive: {
                            admin: true,
                            connected: false
                        }
                    }
                ]
            }
        ]
    },
    getters:{

        //User information related getters
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

        //Signed in User's backends related getters
        getUserBackend: (state) => (id) => {
            return state.users.find(user => user.id === id).backends;
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
        }
    },

    //synchronous changes to the store
    mutations: {
        editBackend(state, payload) {
            console.log ('PAYLOAD NAME: ' + payload.name);
            console.log ('PAYLOAD email: ' + payload.associatedEmail);

            state.users[payload.userIndex].backends[payload.backendIndex].local.id = payload.id;
            state.users[payload.userIndex].backends[payload.backendIndex].local.name = payload.name;
            state.users[payload.userIndex].backends[payload.backendIndex].local.active = payload.active;

            state.users[payload.userIndex].backends[payload.backendIndex].connect.associatedEmail = payload.associatedEmail;
            state.users[payload.userIndex].backends[payload.backendIndex].connect.link = payload.link;
            state.users[payload.userIndex].backends[payload.backendIndex].connect.passKey = payload.passKey;

            state.users[payload.userIndex].backends[payload.backendIndex].receive.admin = payload.admin;

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
                    passKey: ''
                },
                receive: {
                    admin: null,
                    connect: null
                }
            };

            newBackend.local.name = payload.name;
            newBackend.local.link = payload.link;

            newBackend.connect.associatedEmail = payload.associatedEmail;
            newBackend.connect.passKey = payload.passKey;
            newBackend.connect.active = payload.active;

            newBackend.receive.admin = payload.admin;

            state.users[payload.userIndex].backends.push(newBackend);
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

        //Sign in mutations
        setSignedIn(state, payload){
            state.signedIn = payload;
        },
        setSignedInUserID(state, payload) {
            state.signedInUserId = payload.userID;
            state.users[payload.userID].info.isActive = payload.signedIn;
            state.signedIn = true;
        }
    },

    //asynchronous actions that will result in mutations on the state being called -> once asynch. op. is done, you call the mutation to update the store
    actions : {
        //Information to be obtained for backend connected and admin status


    }
});

export default store;
