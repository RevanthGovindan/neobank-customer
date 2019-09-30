import Login from './Login';
import GetBankAccounts from './GetBankAccounts';
import GetBankAccountDetails from './GetBankAccountDetails';
import Logout from './Logout';

const Customer = {
    login(request, response) {
        const login = new Login(request, response);
        login.userLogin();
    },
    getBankAccounts(request, response) {
        const banks = new GetBankAccounts(request,response);
        banks.doProcess();
    },
    getBankAccountDetails(request, response) {
        const accountDetail = new GetBankAccountDetails(request,response);
        accountDetail.doProcess();
    },
    customerLogout(request,response){
        const logout = new Logout(request,response);
        logout.doProcess();
    }
};

export default Customer;