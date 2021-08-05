import {createStore} from 'vuex'

export default createStore({
    state:{
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
                    }
                ]
            }
        ]
    },
    getters:{},
    mutations: {
        editBackend(state, payload) {
            console.log ('Payload name: ' + payload.name);
            state.users[payload.userIndex].backends[payload.backendIndex].name = payload.name;
            state.users[payload.userIndex].backends[payload.backendIndex].link = payload.link;
            state.users[payload.userIndex].backends[payload.backendIndex].passKey = payload.passKey;

        }
    },
    actions:{}
})