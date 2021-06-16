<template>
<div class="grid">
    <h1> {{ msg }}</h1>
<!--    Declarative Rendering-->
    <div id="counter">
        Counter: {{ counter }}
    </div>
    <div id="bind-attribute">
        <span v-bind:title="message">
            Hover message test
        </span>
    </div>

<!--    Handling User Input-->
    <div id="event-handling">
        <p> {{ message }} </p>
        <button v-on:click="reverseMessage">Reverse Message</button>
    </div>
    <div id="two-way-binding">
        <p> {{message }} </p>
        <input v-model="message" />
    </div>

<!--    Conditionals and Loops-->
    <div id="conditional-rendering">
        <span v-if="seen">Now you see me</span>
    </div>
    <div id="list-rendering">       <!--Having trouble with the lists-->
        <ol>
            <li v-for="todo in todos">
                {{ todo.text }}
            </li>
        </ol>
    </div>
    <div></div>
</div>
</template>

<script>
    export default {
        name: 'TestComponent',
        data() {
            return {
                todos: [
                    { text: 'Learn JavaScript' },
                    { text: 'Learn Vue' },
                    { text: 'Build something awesome' }
                ],
                seen: true,
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

<style scoped lang="scss">
    h3 {
        margin: 40px 0 0;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
    span {
        padding: 10px;
        background-color: #212121;
    }
    .grid {
        display: grid;
        grid-template-rows: repeat(12, 1fr);
        color: #18B495;
    }
    div {
        justify-content: center;
        align-items: center;
    }
    button {
        background-color: #10DBB3;
    }
    input {
        background-color: #363636;
        border-radius: 15px;
        padding: 5px;
        color: #18B495;
    }
</style>