import Session from '../../helpers/SessionHandler';
import Response from '../../helpers/Response';
import ErrorHandler from '../../helpers/Errorhandler';
import Bankaccount from '../../models/Bankaccounts';
import { infoId } from '../../common/constants';

export default class GetBankAccountDetails extends Session {
    constructor(request, httpResponse) {
        super();
        this.request = request;
        this.body = request.params;
        this.httpResponse = httpResponse;
        this.responseObj = new Response();
        this.errorObj = new ErrorHandler();
    }

    controller() {
        this.getBankAccountDetails();
    }

    getBankAccountDetails() {
        try {
            if (this.body.account_id) {
                Bankaccount.findOne({
                    account_id: this.body.account_id
                }).then((result) => {
                    if (result) {
                        this.responseObj.setInfoID = infoId.SUCCESS;
                        this.responseObj.setData = result;
                        this.responseObj.infoMsg = "Account Details";
                        this.responseObj.send(this.httpResponse);
                    } else {
                        throw new Error("No Data Available");
                    }
                }).catch((error) => {
                    this.errorObj.setStatus = 424;
                    this.errorObj.setInfoMsg = error.message;
                    this.errorObj.send(this.httpResponse);
                });
            } else {
                throw new Error("Account id required");
            }
        } catch (error) {
            this.errorObj.setStatus = 424;
            this.errorObj.setInfoID = infoId.FAILED;
            this.errorObj.setInfoMsg = error.message;
            this.errorObj.send(this.httpResponse);
        }
    }
}