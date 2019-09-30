import Session from '../../helpers/SessionHandler';
import Response from '../../helpers/Response';
import ErrorHandler from '../../helpers/Errorhandler';
import Payee from '../../models/Payees';
import { infoId } from '../../common/constants';

export default class DeletePayee extends Session {
    constructor(request, httpResponse) {
        super();
        this.request = request;
        this.httpResponse = httpResponse;
        this.body = request.params;
        this.responseObj = new Response();
        this.errorObj = new ErrorHandler();
    }
    
    controller() {
        this.deletePayee();
    }

    deletePayee() {
        try {
            Payee.deleteOne(
                {
                    customerID: this.getUserId(),
                    targetCustomerID : this.body.target_customer_id
                }
            ).then((result) => {
                if (result.deletedCount !== 0) {
                    this.responseObj.setInfoID = infoId.SUCCESS;
                    this.responseObj.infoMsg = "Payee deleted";
                    this.responseObj.send(this.httpResponse);
                } else {
                    throw new Error("Invalid account number");
                }
            }).catch((error) => {
                this.errorObj.setInfoID = infoId.FAILED;
                this.errorObj.setInfoMsg = error.message;
                this.errorObj.send(this.httpResponse);
            });
        } catch (error) {
            this.errorObj.setInfoID = infoId.FAILED;
            this.errorObj.setInfoMsg = error.message;
            this.errorObj.send(this.httpResponse);
        }
    }
}