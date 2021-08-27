class GeneralService {

    test(id: String){
        return {
            code : 200,
            body : {
                message : id
            }
        }
    }

}

const generalService = new GeneralService();
export default generalService;