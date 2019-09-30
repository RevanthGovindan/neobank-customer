import Session from '../../helpers/SessionHandler';
import Response from '../../helpers/Response';
import ErrorHandler from '../../helpers/Errorhandler';
import Transaction from '../../models/Transactions';
import { infoId } from '../../common/constants';

export default class GetTransactions extends Session {
    constructor(request, httpResponse) {
        super();
        this.request = request;
        this.httpResponse = httpResponse;
        this.body = request.params;
        this.responseObj = new Response();
        this.errorObj = new ErrorHandler();
    }

    controller() {
        this.getTransactions();
    }

    getTransactions() {
        Transaction.find({
            customerID: this.getUserId()
        }).then((transactions) => {
            if(transactions && transactions.length > 0){
                this.responseObj.setInfoID = infoId.SUCCESS;
                this.responseObj.setData = transactions;
                this.responseObj.infoMsg = "Transfers";
                this.responseObj.send(this.httpResponse);
            } else {
                throw new Error("No Data Available");
            }
        }).catch((error) => {
            this.errorObj.setInfoID = infoId.FAILED;
            this.errorObj.setInfoMsg = error.message;
            this.errorObj.send(this.httpResponse);
        });
    }

}