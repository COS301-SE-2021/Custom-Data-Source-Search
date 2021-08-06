import {createStore} from 'vuex'

const store = createStore({
    state:{
        signedIn : false,
        users: [
            {
                id: 0,
                info: {
                    name: 'Marike',
                    email: 'exaple@funsail.co.za'
                },
                backends: [
                    {
                        name: 'BIRDS',
                        active: true,
                        link: 'www.birdsOfEden/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKLJHF498Yuw9UE4ER89dHWIe4tdfg4REWGsfg'
                    },
                    {
                        name: 'LEGO',
                        active: false,
                        link: 'www.justAnotherExample/LEGO/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey'
                    },
                    {
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
                    name: 'Josh',
                    email: 'newExample@email.co.za'
                },
                backends: [
                    {
                        name: 'CARS',
                        active: true,
                        link: 'www.randomCarType/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKL_passKey_9dHWIe4tdfg4REWGsfg'
                    },
                    {
                        name: 'WINDOWS',
                        active: false,
                        link: 'www.justAnotherExample/windows/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey'
                    },
                    {
                        name: 'TEST',
                        active: true,
                        link: 'www.doesnotmattermuch/backend/link',
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
        getUserBackend: (state) => (id) => {
            return state.users.find(user => user.id === id).backends;
        },
        getUserBackendSize: (state, getters) => {
            return getters.users[0].backends.length;
        }
    },
    mutations: {
        editBackend(state, payload) {
            console.log ('Payload name: ' + payload.name);
            state.users[payload.userIndex].backends[payload.backendIndex].name = payload.name;
            state.users[payload.userIndex].backends[payload.backendIndex].link = payload.link;
            state.users[payload.userIndex].backends[payload.backendIndex].passKey = payload.passKey;
        },
        addBackend(state, payload){
            console.log ('Payload name: ' + payload.name);
            let newBackend = {
                name: '',
                active: null,
                link: '',
                passKey: ''
            };
            state.users[payload.userIndex].backends.push(newBackend);

            //Console.log results to check
            for (let i = 0; i < state.users[0].backends.length; i++) {
                console.log("name: " + state.users[0].backends[i].name);
                console.log("link: " + state.users[0].backends[i].link);
                console.log("passKey: " + state.users[0].backends[i].passKey);
            }
        },
        setSignedIn(state, payload){
            state.signedIn = payload;
        }
    }
});

export default store;
