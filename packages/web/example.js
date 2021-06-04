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
            this.result = []
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
        getDataSources() {
            $.get(
                "http://localhost:3001/textdatasources/",
                (data) => {
                    let number = 0;
                    this.datasourceList = data
                    console.log(this.datasourceList)
                }
            )
        },
        addDataSource() {
            $.ajaxSetup(
                {headers: {'content-type': "application/json"}}
            );
            $.ajax({
                type: "POST",
                url: "http://localhost:3001/textdatasources/",
                data: JSON.stringify({"fileName" : this.filename, "filePath" : this.datasource}),
                success: (data) => {
                    alert(data.message)
                    console.log(data)
                    this.getDataSources()
                },
                error: () => {
                    alert("Could Not Add Datasource...")
                }
            });
        },
        deleteDataSource(idToDelete) {
            if (confirm("Are you sure you want to delete this datasource?")) {
                $.ajax({
                    type: "DELETE",
                    url: "http://localhost:3001/textdatasources/",
                    data: JSON.stringify({"id": idToDelete}),
                    success: () => {
                        this.getDataSources();
                        alert("Deleted Data Source...");
                    }
                })
            }
        }
    },
    beforeMount() {
        this.getDataSources()
    }
}

Vue.createApp(DataSource).mount("#data-sources")