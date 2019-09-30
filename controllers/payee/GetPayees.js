import Session from '../../helpers/SessionHandler';
import Response from '../../helpers/Response';
import ErrorHandler from '../../helpers/Errorhandler';
import Payee from '../../models/Payees';
import { infoId } from '../../common/constants';

export default class GetPayees extends Session {
    constructor(request, httpResponse) {
        super();
        this.request = request;
        this.httpResponse = httpResponse;
        this.body = request.params;
        this.responseObj = new Response();
        this.errorObj = new ErrorHandler();
    }

    controller() {
        this.getPayees();
    }

    getPayees() {
        try {
            Payee.find({
                customerID: this.getUserId()
            }).then((payees) => {
                if (payees && payees.length > 0) {
                    let payeesList = payees.map((payee) => {
                        return {
                            targetCustomerID: payee.targetCustomerID,
                            targetCustomerName: payee.targetCustomerName
                        }
                    })
                    this.responseObj.setInfoID = infoId.SUCCESS;
                    this.responseObj.setData = payeesList;
                    this.responseObj.infoMsg = "Payees";
                    this.responseObj.send(this.httpResponse);
                } else {
                    throw new Error("No data available");
                }
            }).catch((error) => {
                this.errorObj.setInfoID = infoId.FAILED;
                this.errorObj.setInfoMsg = error.message;
                this.errorObj.send(this.httpResponse);
            })
        } catch (error) {
            this.errorObj.setInfoID = infoId.FAILED;
            this.errorObj.setInfoMsg = error.message;
            this.errorObj.send(this.httpResponse);
        }
    }
}