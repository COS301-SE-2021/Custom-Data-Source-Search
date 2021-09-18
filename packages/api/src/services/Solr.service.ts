import FormData from "form-data";
import axios from "axios";
import {StatusMessage} from "../models/response/general.interfaces";
import {statusMessage} from "../general/generalFunctions";

class SolrService {
    /**
     * Post contents of a file to solr
     * @async
     *
     * @param {Buffer} content Content of document that needs to be posted
     * @param {string} id Id of datasource as stored in db
     * @param {string} sourceName
     * @param {string} type Specifies the datasource type
     * @return {Promise<[StatusMessage, StatusMessage]>}
     */
    async postToSolr(content: Buffer, id: string, sourceName: string, type: string)
        : Promise<[StatusMessage, StatusMessage]> {
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

    /**
     * Remove document associated with datasource from solr
     * @async
     *
     * @param {string} uuid
     * @return {Promise<[StatusMessage, StatusMessage]>}
     */
    async deleteFromSolr(uuid: string): Promise<[StatusMessage, StatusMessage]> {
        try {
            await axios.post(
                'http://localhost:' +
                process.env.SOLR_PORT +
                '/solr/files/update?commit=true',
                {
                    "delete": {
                        "query": "id:" + uuid
                    }
                }
            );
            return [statusMessage(204, "Successfully removed document from Solr"), null];
        } catch (e) {
            return [statusMessage(500, "Could not delete document from solr"), null];
        }
    }
}

const solrService = new SolrService();
export default solrService;