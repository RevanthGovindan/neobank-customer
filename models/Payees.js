import mongoose from 'mongoose';

let Payees = new mongoose.Schema({
    customerID: {
        type: String
    },
    targetAccountId: {
        type: String
    },
    targetCustomerID: {
        type: String
    },
    targetCustomerName:{
        type: String
    }
});

export default mongoose.model('payee', Payees);