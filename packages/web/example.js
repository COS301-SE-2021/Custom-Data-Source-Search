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
            filename: "",
            datasource: "",
            datasourceList: []
        }
    },
    methods: {
        addDataSource() {
            $.ajaxSetup(
                {headers: {'content-type': "application/json"}}
            );
            $.ajax({
                type: "POST",
                url: "http://localhost:3001/textdatasources/",
                data: JSON.stringify({"fileName" : this.filename, "filePath" : this.datasource}),
                success: (data) => {
                    alert(data)
                    console.log(data.message)
                    $.get(
                        "http://localhost:3001/textdatasources/",
                        (data) => {
                            console.log(data)
                            this.datasourceList = data;
                        }
                    )
                },
                error: (data) => {
                    alert("Could Not Add Datasource")
                }
            });
        },
        deleteDataSource(idToDelete) {
            this.datasourceList = this.datasourceList.filter(item => {
                return item.data !== idToDelete
            })
        }
    }
}

Vue.createApp(DataSource).mount("#data-sources")