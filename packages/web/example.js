const SearchSystem = {
    data() {
        return {
            query: "",
            result: [],
            datasource: "",
            datasourceList: []
        }
    },
    methods: {
        search() {
            this.queryServer(this.query)
        },
        queryServer(query) {
            let serverQuery = `http://localhost:3001/textdatasources/search/string/${query}`;
            $.get(
                serverQuery,
                (data) => {
                    console.log(data);
                    this.result = data;
                }
            );
        }
    }
}

Vue.createApp(SearchSystem).mount("#search-system")
let nextId = 1
const DataSource = {

    data() {
        return {
            datasource: "",
            datasourceList: []
        }
    },
    methods: {
        addDataSource() {
            if (!this.datasourceList.includes(this.datasource)) {
                this.datasourceList.push({id: nextId++, info: this.datasource})
            }
        },
        deleteDataSource(idToDelete) {
            this.datasourceList = this.datasourceList.filter(item => {
                return item.id !== idToDelete
            })
        }
    }
}

Vue.createApp(DataSource).mount("#data-sources")