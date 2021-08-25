class GeneralService {

    test(id: Number){
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