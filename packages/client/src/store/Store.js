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
                        id: 0,
                        name: 'BIRDS',
                        associatedEmail: 'marike@funsail.co.za',
                        active: true,
                        link: 'www.birdsOfEden/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKLJHF498Yuw9UE4ER89dHWIe4tdfg4REWGsfg',
                        admin: true,
                        connected: true,
                        color: '#b34e47'
                    },
                    {
                        id: 1,
                        name: 'LEGO',
                        associatedEmail: 'marike1@funsail.co.za',
                        active: false,
                        link: 'www.justAnotherExample/LEGO/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey',
                        admin: true,
                        connected: true,
                        color: '#21b312'
                    },
                    {
                        id: 2,
                        name: 'Fluffy',
                        associatedEmail: 'marike2@funsail.co.za',
                        active: true,
                        link: 'www.fulffy&Bubbles/backend/link',
                        passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg',
                        admin: true,
                        connected: true,
                        color: '#41B3B2'
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
                        id: 0,
                        name: 'CARS',
                        associatedEmail: 'josh1@gmail.com',
                        active: true,
                        link: 'www.randomCarType/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKL_passKey_9dHWIe4tdfg4REWGsfg',
                        admin: false,
                        connected: false,
                        color: '#b30a8c'
                    },
                    {
                        id: 1,
                        name: 'WINDOWS',
                        associatedEmail: 'josh2@gmail.com',
                        active: false,
                        link: 'www.justAnotherExample/windows/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey',
                        admin: false,
                        connected: true,
                        color: '#fdff23'
                    },
                    {
                        id: 2,
                        name: 'TEST',
                        associatedEmail: 'josh3@gmail.com',
                        active: true,
                        link: 'www.doesnotmattermuch/backend/link',
                        passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg',
                        admin: false,
                        connected: true,
                        color: '#41B3B2'
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
                        id: 0,
                        name: 'BIRDS',
                        associatedEmail: 'lauren1@gmail.com',
                        active: true,
                        link: 'www.birdsOfEden/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKLJHF498Yuw9UE4ER89dHWIe4tdfg4REWGsfg',
                        admin: false,
                        connected: false,
                        color: '#25b313'
                    },
                    {
                        id: 1,
                        name: 'LEGO',
                        associatedEmail: 'lauren2@gmail.com',
                        active: false,
                        link: 'www.justAnotherExample/LEGO/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey',
                        admin: true,
                        connected: true,
                        color: '#1616b3'
                    },
                    {
                        id: 2,
                        name: 'Fluffy',
                        associatedEmail: 'lauren2@gmail.com',
                        active: true,
                        link: 'www.fulffy&Bubbles/backend/link',
                        passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg',
                        admin: true,
                        connected: true,
                        color: '#b3100c'
                    }
                ]
            }
        ]
    },
    getters:{
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
        getUserBackend: (state) => (id) => {
            return state.users.find(user => user.id === id).backends;
        },
        getSignedInUserId(state){
            return state.signedInUserId;
        },
        getUserAdminStatus: (state) => (backendID) => {
            return state.users[state.signedInUserId].backends.find(backend => backend.id === backendID).admin;
        },
        unconnectedBackendNo: (state) => {
            return state.users[state.signedInUserId].backends.filter(backend => backend.connected === false).length;
        },
        unconnectedBackendNames: (state) => {
            return state.users[state.signedInUserId].backends.filter(backend => backend.connected === false);
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

            state.users[payload.userIndex].backends[payload.backendIndex].name = payload.name;
            state.users[payload.userIndex].backends[payload.backendIndex].associatedEmail = payload.associatedEmail;
            state.users[payload.userIndex].backends[payload.backendIndex].link = payload.link;
            state.users[payload.userIndex].backends[payload.backendIndex].passKey = payload.passKey;
            state.users[payload.userIndex].backends[payload.backendIndex].active = payload.active;
            state.users[payload.userIndex].backends[payload.backendIndex].id = payload.id;
            state.users[payload.userIndex].backends[payload.backendIndex].admin = payload.admin;

            let l = state.users[state.signedInUserId].backends.length;
            for(let x = 0; x < l; x++) {
                state.users[state.signedInUserId].backends[x].id = x;
            }
        },
        addBackend(state, payload){

            let newBackend = {
                id: null,
                name: '',
                active: null,
                link: '',
                passKey: '',
                associatedEmail: ''
            };

            newBackend.name = payload.name;
            newBackend.link = payload.link;
            newBackend.passKey = payload.passKey;
            newBackend.active = payload.active;
            newBackend.associatedEmail = payload.associatedEmail;
            newBackend.admin = payload.admin;

            state.users[payload.userIndex].backends.push(newBackend);
            let l = state.users[state.signedInUserId].backends.length;
            for(let x = 0; x < l; x++) {
                state.users[state.signedInUserId].backends[x].id = x;
            }

        },
        setSignedIn(state, payload){
            state.signedIn = payload;
        },
        setSignedInUserID(state, payload) {
            state.signedInUserId = payload.userID;
            state.users[payload.userID].info.isActive = payload.signedIn;
            state.signedIn = true;
        },
        deleteBackend(state, payload) {
            state.users[state.signedInUserId].backends.splice(payload,1);
            let l = state.users[state.signedInUserId].backends.length;
            for(let x = 0; x < l; x++) {
                state.users[state.signedInUserId].backends[x].id = x;
            }
        },
        setCurrentUserName(state, payload){
            state.name = payload;
        },
        setCurrentUserEmail(state, payload){
            state.email = payload;
        }
    },

    //asynchronous actions that will result in mutations on the state being called -> once asynch. op. is done, you call the mutation to update the store
    actions : {

    }
});

export default store;
