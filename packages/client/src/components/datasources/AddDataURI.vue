<template>
  <div>
    <input :placeholder="placeholderPath" v-model="dataSourceURI" v-on:keyup.enter="message">
    <button @click="message">Add</button>
  </div>
</template>

<script>

export default {
  name: "AddDataURI",
  props: {
    placeholderPath: String
  },
  data() {
    return {
      dataSourceURI: ""
    }
  },
  methods: {
    message() {
      alert(this.dataSourceURI)
    }
  }
}
</script>

<style scoped>

div {
  padding: 15px;
}

input {
  background-color: #929292;
  padding: 3px;
  border-radius: 8px;
  border: none;
  min-width: 680px;
}

input::placeholder {
  color: black;
  padding-left: 10px;
}

button {
  background-color: #26C6DA;
  border: none;
  border-radius: 12px;
  margin-left: 45px;
  padding: 6px;
  cursor: pointer;
}

</style>