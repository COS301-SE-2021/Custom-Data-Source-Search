const SearchSystem = {
    data() {
        return {
            query: "",
            result: {},
            cache:  [
                {
                    title: "file.txt",
                    snippet: "Assign the requirements to subsystems. in Figure 1. For each concrete use case a use case diagram with the required\n" +
                        "functionality in the form of includes and extends relationships to lower level use cases. Use <<include>> to specify\n" +
                        "sub-functionality for a given functionality and <<extend>> if the sub-functionality is optional. Show the required\n" +
                        "functionality within a system boundary as actions (ovals). The actors (stick figures) are people or other systems\n" +
                        "requesting or delivering services (labels on the connection line between an actor and an action). ",
                    dir: "C:\\Users\\Laurens-PC\\Documents\\Portia"
                },
                {
                    title: "anotherfile.txt",
                    snippet: "a short snippet for now",
                    dir: "C:\\Users\\Laurens-PC\\Documents\\Another one"
                }
            ]
        }
    },
    methods: {
        search() {
            this.result = this.cache;
        }
    }
}


const MockAddedDataSources = {
    tempMessage : '',
    dataSources: [
        { filePath: 'C:\\Users\\User\\Downloads\\Telegram Desktop'},
        { filePath: 'C:\\Users\\Laurens-PC\\Documents\\Another one'},
        { filePath: 'C:\\Users\\Laurens-PC\\Documents\\Portia'}
    ],
    method: { //add and view these mock dataSources
        add() {
            this.dataSources.push({filePath: this.tempMessage});
        }
    }
}

Vue.createApp(SearchSystem).mount("#search-system");
Vue.createApp(MockAddedDataSources).mount("#mock-added-data-sources");