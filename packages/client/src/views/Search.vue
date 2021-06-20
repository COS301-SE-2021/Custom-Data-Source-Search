<template>
  <div class="home">
    <SearchBar/>
  </div>
</template>

<script>
// @ is an alias to /src
import SearchBar from "../components/SearchBar";

export default {
  name: 'Search',
  components: {
    SearchBar
  }
}
</script>
