import Transfer from './Transfer';
import GetTransactions from './GetTransactions';

const transfer = {
    transferAmount(request, response) {
        const transfer = new Transfer(request, response);
        transfer.doProcess();
    },
    getTransactions(request, response) {
        const transactions = new GetTransactions(request,response);
        transactions.doProcess();
    }
};

export default transfer;