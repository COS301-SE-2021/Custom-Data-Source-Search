import { createStore } from 'vuex'

const store = createStore({
    state: {
        signedIn : false,
        name: null,
        email: null
    },
    mutations: {
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
    getters: {
        getSignedIn(state){
            return state.signedIn;
        },
        getName(state){
            return state.name;
        },
        getEmail(state){
            return state.email;
        }
    }

})

export default store;