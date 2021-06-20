<template>
  <div>
    <input v-model="query" v-on:keyup.enter="search" placeholder="Sleuth...">
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      query: ""
    }
  },
  methods: {
    search() {
      alert(this.query)
    }
  }
}
</script>

<style scoped>

div {
  vertical-align: center;
}

input {
  height: 20px;
  padding-left: 7px;
  padding-right: 7px;
  width: 400px;
  background-color: rgba(211, 211, 211, 0.87);
  margin-top: -3px;
  border-radius: 5px;
  border: none;
}

input::placeholder {
  color: black;
}

.search-button {
  cursor: pointer;
  margin-top: 4px;
  padding-left: 10px;
}

</style>