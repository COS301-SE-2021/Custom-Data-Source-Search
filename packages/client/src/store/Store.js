import {createStore} from 'vuex'

const store = createStore({
    state:{
        signedInUserId: 1,
        signedIn : false,
        users: [
            {
                id: 0,
                info: {
                    id: 0,
                    name: 'Marike',
                    email: 'example@funsail.co.za',
                    admin: true,
                    isActive: true
                },
                backends: [
                    {
                        id: 0,
                        name: 'BIRDS',
                        active: true,
                        link: 'www.birdsOfEden/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKLJHF498Yuw9UE4ER89dHWIe4tdfg4REWGsfg'
                    },
                    {
                        id: 1,
                        name: 'LEGO',
                        active: false,
                        link: 'www.justAnotherExample/LEGO/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey'
                    },
                    {
                        id: 2,
                        name: 'Fluffy',
                        active: true,
                        link: 'www.fulffy&Bubbles/backend/link',
                        passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg'
                    }
                ]
            },
            {
                id: 1,
                info: {
                    id: 1,
                    name: 'Josh',
                    email: 'joshwalkerdev@gmail.com',
                    admin: false,
                    isActive: false
                },
                backends: [
                    {
                        id: 0,
                        name: 'CARS',
                        active: true,
                        link: 'www.randomCarType/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKL_passKey_9dHWIe4tdfg4REWGsfg'
                    },
                    {
                        id: 1,
                        name: 'WINDOWS',
                        active: false,
                        link: 'www.justAnotherExample/windows/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey'
                    },
                    {
                        id: 2,
                        name: 'TEST',
                        active: true,
                        link: 'www.doesnotmattermuch/backend/link',
                        passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg'
                    }
                ]
            },
            {
                id: 2,
                info: {
                    id: 2,
                    name: 'Lauren',
                    email: 'lauren@gmail.com',
                    admin: true,
                    isActive: true
                },
                backends: [
                    {
                        id: 0,
                        name: 'BIRDS',
                        active: true,
                        link: 'www.birdsOfEden/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKLJHF498Yuw9UE4ER89dHWIe4tdfg4REWGsfg'
                    },
                    {
                        id: 1,
                        name: 'LEGO',
                        active: false,
                        link: 'www.justAnotherExample/LEGO/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey'
                    },
                    {
                        id: 2,
                        name: 'Fluffy',
                        active: true,
                        link: 'www.fulffy&Bubbles/backend/link',
                        passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg'
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
        getUserBackendSize: (state, getters) => {
            return getters.users[0].backends.length;
        },
        getSignedInUserId(state){
            return state.signedInUserId;
        },
        getUserAdminStatus(state){
            return state.users[state.signedInUserId].info.admin
        }
    },

    //synchronous changes to the store
    mutations: {
        editBackend(state, payload) {
            console.log ('PAYLOAD NAME: ' + payload.name);
            console.log ('PAYLOAD ACTIVE: ' + payload.active);

            state.users[payload.userIndex].backends[payload.backendIndex].name = payload.name;
            state.users[payload.userIndex].backends[payload.backendIndex].link = payload.link;
            state.users[payload.userIndex].backends[payload.backendIndex].passKey = payload.passKey;
            state.users[payload.userIndex].backends[payload.backendIndex].active = payload.active;
        },
        addBackend(state, payload){

            let newBackend = {
                id: null,
                name: '',
                active: null,
                link: '',
                passKey: ''
            };

            newBackend.name = payload.name;
            newBackend.link = payload.link;
            newBackend.passKey = payload.passKey;
            newBackend.active = payload.active;

            state.users[payload.userIndex].backends.push(newBackend);

            //Console.log results to check
            for (let i of state.users[payload.userIndex].backends) {
                console.log("name: " + i.name);
                console.log("link: " + i.link);
                console.log("passKey: " + i.passKey);
                console.log("active: " + i.active);
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
        }
    },

    //asynchronous actions that will result in mutations on the state being called -> once asynch. op. is done, you call the mutation to update the store
    actions : {

    }
});

export default store;
