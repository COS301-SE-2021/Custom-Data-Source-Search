<template>
  <div class="search-div">
    <input v-model="query" v-on:keyup.enter="search" placeholder="Sleuth...">
  </div>
  <div>
    <TextResultCard
        v-for="(r,i) in searchResults"
        :key="i"
        :source="r.source"
        :type="r.type"
        :occurrences="r.occurrences"
    />
  </div>
</template>

<script>
import TextResultCard from "../components/results/TextResultCard";

export default {
  name: "SearchBar",
  data() {
    return {
      notDeleted: true,
      query: "",
      searchResults: [
        {
          type: "webpage",
          source: "stackoverflow/result/a/how-do-you-do-this",
          occurrences: [
            {occurrenceString: "one result"},
             {occurrenceString: "something else in the same file"},
             {occurrenceString: "another thing!"}
          ]
        },
        {
          type: "text",
          source: "some/folder/lewis.txt",
          occurrences: [
               {occurrenceString: "When the whole world is running towards a cliff, he who is running in the opposite direction appears to have lost his mind."},
              "something else in the same file",
               {occurrenceString: "Of all tyrannies, a tyranny sincerely exercised for the good of its victims may be the most oppressive. It would be better to live under robber barons than under omnipotent moral busybodies. The robber baron's cruelty may sometimes sleep, his cupidity may at some point be satiated; but those who torment us for our own good will torment us without end for they do so with the approval of their own conscience."}
          ]
        },
        {
          type: "folder",
          source: "some/folder/lewis.txt",
          occurrences: [
             {occurrenceString: "Humility is not thinking less of yourself, it's thinking of yourself less."}
          ]
        },
        {
          type: "folder",
          source: "some/folder/lewis.txt",
          occurrences: [
             {occurrenceString: "When the whole world is running towards a cliff, he who is running in the opposite direction appears to have lost his mind."},
            "something else in the same file",
             {occurrenceString: "Of all tyrannies, a tyranny sincerely exercised for the good of its victims may be the most oppressive. It would be better to live under robber barons than under omnipotent moral busybodies. The robber baron's cruelty may sometimes sleep, his cupidity may at some point be satiated; but those who torment us for our own good will torment us without end for they do so with the approval of their own conscience."}
          ]
        }
      ]
    }
  },
  methods: {
    search(message) {
      alert(message)
    }
  },
  components: {
    TextResultCard
  }
}
</script>

<style scoped>

.search-div {
  vertical-align: center;
}

input {
  height: 28px;
  font-size: 1em;
  padding-left: 7px;
  padding-right: 7px;
  margin-bottom: 8px;
  width: 600px;
  background-color: rgba(211, 211, 211, 0.87);
  margin-top: -3px;
  border-radius: 10px;
  border: none;
}

input::placeholder {
  color: black;
}

</style>