import FormData from "form-data";
import axios from "axios";

class SolrService {
    /**
     * Post contents of a file to solr
     * @async
     *
     * @param {Buffer} content Content of document that needs to be posted
     * @param {string} id Id of datasource as stored in db
     * @param {string} sourceName
     * @param {string} type Specifies the datasource type
     * @return {Promise<[{ code: number, message: string }, { code: number, message: string }]>}
     */
    async postToSolr(content: Buffer, id: string, sourceName: string, type: string) {
        let formData = new FormData();
        formData.append("file", content, sourceName);
        try {
            await axios.post(
                'http://localhost:' +
                process.env.SOLR_PORT +
                '/solr/files/update/extract?literal.id=' +
                id +
                '&commit=true&literal.datasource_type=' +
                type,
                formData,
                {
                    headers: {
                        ...formData.getHeaders()
                    }
                });
        } catch (e) {
            console.error(e)
            return [null, {
                "code": 500,
                "message": "Could not post document to solr"
            }];
        }
        return [{
            "code": 200,
            "message": "Successfully posted document to Solr"
        }, null];
    }
}

const solrService = new SolrService();
export default solrService;