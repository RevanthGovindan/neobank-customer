import Session from '../../helpers/SessionHandler';
import Response from '../../helpers/Response';
import ErrorHandler from '../../helpers/Errorhandler';
import Payee from '../../models/Payees';
import Bankaccount from '../../models/Bankaccounts';
import { infoId } from '../../common/constants';

export default class AddPayee extends Session {
    constructor(request, httpResponse) {
        super();
        this.request = request;
        this.httpResponse = httpResponse;
        this.body = request.body.data;
        this.responseObj = new Response();
        this.errorObj = new ErrorHandler();
    }

    controller() {
        this.addPayee();
    }

    addPayee() {
        Bankaccount.findOne({
            account_id: this.body.target_account_id
        }).then(targetAccountData => {
            try {
                if (targetAccountData) {
                    let newPayee = {
                        customerID: this.getUserId(),
                        targetAccountId: targetAccountData.account_id,
                        targetCustomerID: targetAccountData.customer_id,
                        targetCustomerName: targetAccountData.customer_name
                    };
                    Payee.create(
                        newPayee
                    ).then((result) => {
                        if (result) {
                            this.responseObj.setInfoID = infoId.SUCCESS;
                            this.responseObj.setStatus = 201;
                            this.responseObj.infoMsg = "Payee Added";
                            this.responseObj.send(this.httpResponse);
                        } else {
                            throw new Error("An error Occured");
                        }
                    }).catch((error) => {
                        this.errorObj.setInfoID = infoId.FAILED;
                        this.errorObj.setInfoMsg = error.message;
                        this.errorObj.send(this.httpResponse);
                    });
                } else {
                    throw new Error("Invalid account");
                }
            } catch (error) {
                this.errorObj.setInfoID = infoId.FAILED;
                this.errorObj.setInfoMsg = error.message;
                this.errorObj.send(this.httpResponse);
            }
        }).catch(error => {
            this.errorObj.setInfoID = infoId.FAILED;
            this.errorObj.setInfoMsg = error.message;
            this.errorObj.send(this.httpResponse);
        });
    }
}