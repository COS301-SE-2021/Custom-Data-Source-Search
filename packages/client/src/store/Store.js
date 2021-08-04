import {createStore} from 'vuex'

export default createStore({
    state:{
        users: [
            {
                name: 'Marike',
                email: 'exaple@funsail.co.za',
                backends: [
                    {
                        index: 1,
                        name: 'BIRDS',
                        active: 'true',
                        link: 'www.birdsOfEden/inventoryLink/23NSLud93nfskdj',
                        passKey: 'w489wdN49h$rKLJHF498Yuw9UE4ER89dHWIe4tdfg4REWGsfg'
                    }
                ]
            }
        ]
    },
    getters:{},
    mutations: {},
    actions:{}
})