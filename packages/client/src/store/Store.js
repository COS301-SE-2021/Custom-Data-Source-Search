import {createStore} from 'vuex'

const store = createStore({
    state: {
        signedIn : false,
        name: null,
        email: null,
        signedInUserId: 1,
        users: [
            {
                id: 0,
                info: {
                    name: 'Marike',
                    email: 'example@funsail.co.za',
                    admin: true
                },
                backends: [
                    {
                        id: 0,
                        name: 'BIRDS',
                        active: true,
                        link: 'www.birdsOfEden/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKLJHF498Yuw9UE4ER89dHWIe4tdfg4REWGsfg',
                        isAdmin: true
                    },
                    {
                        id: 1,
                        name: 'LEGO',
                        active: false,
                        link: 'www.justAnotherExample/LEGO/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey',
                        isAdmin: false
                    },
                    {
                        id: 2,
                        name: 'Fluffy',
                        active: true,
                        link: 'www.fulffy&Bubbles/backend/link',
                        passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg',
                        isAdmin: false
                    }
                ]
            },
            {
                id: 1,
                info: {
                    name: 'Josh',
                    email: 'newExample@email.co.za',
                    admin: false
                },
                backends: [
                    {
                        id: 0,
                        name: 'CARS',
                        active: true,
                        link: 'www.randomCarType/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKL_passKey_9dHWIe4tdfg4REWGsfg',
                        isAdmin: true
                    },
                    {
                        id: 1,
                        name: 'WINDOWS',
                        active: false,
                        link: 'www.justAnotherExample/windows/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey',
                        isAdmin: false
                    },
                    {
                        id: 2,
                        name: 'TEST',
                        active: true,
                        link: 'www.doesnotmattermuch/backend/link',
                        passKey: '_Funny_w489wdN_Pass_498Yuw9UE4ER89_Random_4REWGsfg',
                        isAdmin: true
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
        },
        getName(state){
            return state.name;
        },
        getEmail(state){
            return state.email;
        },
        //idea: get the user backends -> find the backend which matches the name -> get the property isAdmin from that result
        //should return true or false
        //this would allow us to determine whether or not a data source can be edited/deleted by a user
        getBackendAdminStatus: (state, getters) => (backendName) => {
            return getters.getUserBackend(state.signedInUserId).find(backend => backend.name === backendName).isAdmin
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
            for (let i = 0; i < state.users[payload.userIndex].backends.length; i++) {
                console.log("name: " + state.users[payload.userIndex].backends[i].name);
                console.log("link: " + state.users[payload.userIndex].backends[i].link);
                console.log("passKey: " + state.users[payload.userIndex].backends[i].passKey);
                console.log("active: " + state.users[payload.userIndex].backends[i].active);
            }
        },
         deleteBackend(state, payload) {
           state.users[state.signedInUserId].backends.splice(payload,1);
           let l = state.users[state.signedInUserId].backends.length;
           for(let x = 0; x < l; x++) {
               state.users[state.signedInUserId].backends[x].id = x;
           }
        },
        setSignedIn(state, payload){
            state.signedIn = payload;
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
