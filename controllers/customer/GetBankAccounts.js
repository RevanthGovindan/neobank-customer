import Session from '../../helpers/SessionHandler';
import Response from '../../helpers/Response';
import ErrorHandler from '../../helpers/Errorhandler';
import Bankaccount from '../../models/Bankaccounts';
import { infoId } from '../../common/constants';

export default class GetBankAccounts extends Session {
    constructor(request, httpResponse) {
        super();
        this.request = request;
        this.httpResponse = httpResponse;
        this.responseObj = new Response();
        this.errorObj = new ErrorHandler();
    }

    controller() {
        this.getBankAccounts();
    }

    getBankAccounts() {
        Bankaccount.find({
            customer_id: this.getUserId()
        }).then((result) => {
            if (result) {
                let accounts = [];
                result.map((account) => {
                    accounts.push(
                        {
                            account_id: account.account_id
                        }
                    );
                });
                this.responseObj.setInfoID = infoId.SUCCESS;
                this.responseObj.setData = accounts;
                this.responseObj.infoMsg = "Accounts";
                this.responseObj.send(this.httpResponse);
            } else {
                throw new Error("No Data Available");
            }
        }).catch((error) => {
            this.errorObj.setInfoID = infoId.FAILED;
            this.errorObj.setStatus = 424;
            this.errorObj.setInfoMsg = error.message;
            this.errorObj.send(this.httpResponse);
        });
    }
}