import mongoose from 'mongoose';

let Transaction = new mongoose.Schema({
    account_id: {
        type: String
    },
    target_account_id: {
        type: String
    },
    transaction_type: {
        type: String
    },
    action: {
        type: String
    },
    customerID: {
        type: String
    },
    transactionAt: {
        type: Date
    },
    amount: {
        type: Number
    },
    remarks: {
        type: String
    }
});

export default mongoose.model('transaction', Transaction);