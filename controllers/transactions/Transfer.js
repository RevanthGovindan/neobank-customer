import Session from '../../helpers/SessionHandler';
import Response from '../../helpers/Response';
import ErrorHandler from '../../helpers/Errorhandler';
import Transaction from '../../models/Transactions';
import Bankaccount from '../../models/Bankaccounts';
import { transactionTypes } from '../../common/constants';
import { infoId } from '../../common/constants';

export default class Tranfer extends Session {
    constructor(request, httpResponse) {
        super();
        this.request = request;
        this.httpResponse = httpResponse;
        this.body = request.body.data;
        this.responseObj = new Response();
        this.errorObj = new ErrorHandler();
    }

    controller() {
        this.transferAmount();
    }

    transferAmount() {
        Bankaccount.findOne({
            account_id: this.body.source_account_id
        }).then((account) => {
            if (account) {
                if (account.balance > this.body.amount) {
                    let deductedAmt = account.balance - this.body.amount;
                    Bankaccount.updateOne(
                        {
                            account_id: this.body.source_account_id
                        }, {
                            balance: deductedAmt
                        }
                    ).then((updatedDebit) => {
                        if (updatedDebit.nModified !== 0) {
                            Bankaccount.updateOne(
                                {
                                    account_id: this.body.target_account_id
                                }, {
                                    $inc: { balance: this.body.amount }
                                }
                            ).then((updatedCredit) => {
                                if (updatedCredit.nModified !== 0) {
                                    this.createTransactionLog();
                                } else {
                                    throw new Error("An error occured");
                                }
                            }).catch((error) => {
                                this.errorObj.setInfoID = infoId.FAILED;
                                this.errorObj.setInfoMsg = error.message;
                                this.errorObj.send(this.httpResponse);
                            });
                        } else {
                            throw new Error("An error occured");
                        }
                    }).catch((error) => {
                        this.errorObj.setInfoID = infoId.FAILED;
                        this.errorObj.setInfoMsg = error.message;
                        this.errorObj.send(this.httpResponse);
                    });
                } else {
                    throw new Error("Insufficient funds");
                }
            } else {
                throw new Error("Invalid Account number");
            }
        }).catch((error) => {
            this.errorObj.setInfoID = infoId.FAILED;
            this.errorObj.setInfoMsg = error.message;
            this.errorObj.send(this.httpResponse);
        });
    }

    createTransactionLog() {
        let transActionDate = new Date;
        Bankaccount.findOne({
            account_id: this.body.target_account_id
        }).then((targetAccount) => {
            if (targetAccount) {
                Transaction.insertMany([{
                    account_id: this.body.target_account_id,
                    target_account_id: this.body.source_account_id,
                    transaction_type: this.body.transaction_type,
                    transactionAt: transActionDate,
                    customerID: targetAccount.customer_id,
                    amount: this.body.amount,
                    remarks: this.body.remarks,
                    action: transactionTypes.CREDIT
                },
                {
                    account_id: this.body.source_account_id,
                    target_account_id: this.body.target_account_id,
                    transaction_type: this.body.transaction_type,
                    transactionAt: transActionDate,
                    customerID: this.getUserId(),
                    amount: this.body.amount,
                    remarks: this.body.remarks,
                    action: transactionTypes.DEBIT
                }]).then((result) => {
                    if (result) {
                        this.responseObj.setInfoID = infoId.SUCCESS;
                        this.responseObj.infoMsg = "Transfer successful";
                        this.responseObj.send(this.httpResponse);
                    } else {
                        throw new Error("Error Occured");
                    }
                }).catch((error) => {
                    this.errorObj.setInfoID = infoId.FAILED;
                    this.errorObj.setInfoMsg = error.message;
                    this.errorObj.send(this.httpResponse);
                });
            } else {
                throw new Error("Error Occured");
            }
        }).catch((error) => {
            this.errorObj.setInfoID = infoId.FAILED;
            this.errorObj.setInfoMsg = error.message;
            this.errorObj.send(this.httpResponse);
        });
    }
}