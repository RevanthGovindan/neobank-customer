import express from 'express';
import Customer from '../controllers/customer';
import Payee from '../controllers/payee';
import Transaction from '../controllers/transactions';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
});

router.post('/api/customer/login', (req, res) => {
    Customer.login(req, res);
});

router.get('/api/customer/logout', (req, res) => {
    Customer.customerLogout(req, res);
});

router.get('/api/customer/getbankaccounts', (req, res) => {
    Customer.getBankAccounts(req, res);
});

router.get('/api/customer/getbankaccountdetails/:account_id', (req, res) => {
    Customer.getBankAccountDetails(req, res);
});

router.post('/api/customer/addpayee', (req, res) => {
    Payee.addPayee(req, res);
});

router.get('/api/customer/getpayees', (req, res) => {
    Payee.getPayees(req, res);
});

router.delete('/api/customer/deletepayee/:target_customer_id', (req, res) => {
    Payee.deletePayee(req, res);
});

router.post('/api/customer/fundtransfer', (req, res) => {
    Transaction.transferAmount(req, res);
});

router.get('/api/customer/gettransactions', (req, res) => {
    Transaction.getTransactions(req, res);
});

export default router;