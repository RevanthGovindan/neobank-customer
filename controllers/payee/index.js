import AddPayee from './AddPayee';
import DeletePayee from './DeletePayee';
import GetPayees from './GetPayees';

const payees = {
    addPayee(request, response) {
        const add = new AddPayee(request, response);
        add.doProcess();
    },
    deletePayee(request, response) {
        const dltPayee = new DeletePayee(request, response);
        dltPayee.doProcess();
    },
    getPayees(request, response) {
        const getPayees = new GetPayees(request, response);
        getPayees.doProcess();
    }
};

export default payees;