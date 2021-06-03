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
            $.get(
                `http://localhost:3001/general/${query}`,
                (data) => {
                    this.result = data["hello.txt"];
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