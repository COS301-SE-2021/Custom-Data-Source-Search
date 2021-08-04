import { createStore } from 'vuex'

const store = createStore({
    state: {
     signedIn : false,
    },
    mutations: {
        setSignedIn(state, payload){
            state.signedIn = payload;
        }
    },
    getters: {
        getSignedIn(state){
            return state.signedIn;
        }
    }

})

export default store;