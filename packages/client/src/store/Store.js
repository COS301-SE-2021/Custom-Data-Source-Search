import {createStore} from 'vuex'

const store = createStore({
    state:{
        signedIn : true,
        users: [
            {
                name: 'Marike',
                email: 'exaple@funsail.co.za',
                backends: [
                    {
                        index: 0,
                        name: 'BIRDS',
                        active: true,
                        link: 'www.birdsOfEden/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKLJHF498Yuw9UE4ER89dHWIe4tdfg4REWGsfg'
                    },
                    {
                        index: 0,
                        name: 'LEGO',
                        active: false,
                        link: 'www.justAnotherExample/LEGO/BACKEND',
                        passKey: 'new84lLKJREpassKD9e7edfjKey'
                    },
                    {
                        index: 0,
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
        getUserBackend(state, payload){
            return state.users[payload].backends;
        }
    },
    mutations: {
        editBackend(state, payload) {
            console.log ('Payload name: ' + payload.name);
            state.users[payload.userIndex].backends[payload.backendIndex].name = payload.name;
            state.users[payload.userIndex].backends[payload.backendIndex].link = payload.link;
            state.users[payload.userIndex].backends[payload.backendIndex].passKey = payload.passKey;

        },
        setSignedIn(state, payload){
            state.signedIn = payload;
        }
    },
    actions:{}
});

export default store;
