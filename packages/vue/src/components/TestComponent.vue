<template>
    <div id="counter">
        <h1> {{ msg }}</h1>
        Counter: {{ counter }}
    </div>
    <div id="bind-attribute">
        <span v-bind:title="message">
            Has to be added for each component.
        </span>
    </div>
    <div id="event-handling">
        <p> {{ message }} </p>
        <button v-on:click="reverseMessage">Reverse Message</button>
    </div>
</template>

<script>
    export default {
        name: 'TestComponent',
        data() {
            return {
                message: 'Testing on' + new Date().toLocaleString(),
                counter: 0
            }
        },
        methods: {
            reverseMessage() {
                this.message = this.message
                .split('')
                .reverse()
                .join('')
            }
        },
        mounted() {
            setInterval(() => {
                this.counter++
                // console.log(this.counter)
            }, 1000)
        },
        props: {
            msg: String
        }
    }
</script>


