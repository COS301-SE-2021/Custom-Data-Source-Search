<template>
    <div class="gridTest">
        <div></div>
    <div id="TodoApp">
        <h1>To-Do List</h1>
        <ul>
            <li>
                <to-do-item label="First to-do" v-bind:done="true"></to-do-item>
                <to-do-item label="Second to-do" v-bind:done="false"></to-do-item>
                <to-do-item label="Third to-do" v-bind:done="false"></to-do-item>
                <to-do-item label="Fourth to-do" v-bind:done="false"></to-do-item>
            </li>
        </ul>
    </div>
    </div>
</template>


<script>
    import ToDoItem from "../components/TestComponents/ToDoItem";

    // const g = {
    //     data() {
    //         return {
    //             groceryList: [
    //                 { id: 0, text: 'Vegetables' },
    //                 { id: 1, text: 'Cheese' },
    //                 { id: 2, text: 'Whatever else humans are supposed to eat' }
    //             ]
    //         }
    //     }
    // }

    export default {
        name: 'TodoApp',
        components: {
            ToDoItem
        }
    }
</script>

<style>
    div {
        color: #18B495;
    }
    .gridTest {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(12, 1fr);
        text-align: left;
    }
</style>