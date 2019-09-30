import Sessions from '../../models/Sessions';
import Customer from '../../models/Customer';
import CustomerAuthentication from '../../models/CustomerAuthentication';
import Response from '../../helpers/Response';
import ErrorHandler from '../../helpers/Errorhandler';
import uuid from 'uuid';
import { encrypt } from '../../helpers/Crypto';
import { infoId } from '../../common/constants';

export default class Login {
    constructor(request, httpResponse) {
        this.request = request;
        this.body = request.body.data;
        this.httpResponse = httpResponse;
        this.responseObj = new Response();
        this.errorObj = new ErrorHandler();
    }

    async userLogin() {
        CustomerAuthentication.findOne({
            customer_id: this.body.customer_id,
            mpin: this.body.mpin
        }).then((res) => {
            if (res && res.customer_id) {
                Customer.findOne({
                    customer_id: res.customer_id
                }).then(async (customerData) => {
                    if (customerData) {
                        let session_id = await this.createSession(customerData.customer_id);
                        let encAuth = encrypt({
                            session_id: session_id,
                            user_id: customerData.customer_id
                        });
                        let userData = {
                            session_id: encAuth,
                            customer_name: customerData.customer_name,
                            customer_email: customerData.customer_email,
                            customer_id: customerData.customer_id
                        }
                        this.responseObj.setInfoMsg = "Login Success";
                        this.responseObj.setData = userData;
                        this.responseObj.setInfoID = infoId.SUCCESS;
                        this.responseObj.send(this.httpResponse);
                    } else {
                        throw new Error("An error Occured");
                    }
                }).catch((error) => {
                    this.errorObj.setInfoID = infoId.UNAUTHORIZED;
                    this.errorObj.setStatus = 401;
                    this.errorObj.setInfoMsg = error.message;
                    this.errorObj.send(this.httpResponse);
                });
            } else {
                throw new Error("Invalid User");
            }
        }).catch((error) => {
            this.errorObj.setInfoID = infoId.UNAUTHORIZED;
            this.errorObj.setStatus = 401;
            this.errorObj.setInfoMsg = error.message;
            this.errorObj.send(this.httpResponse);
        });
    }

    async createSession(customer_id) {
        let session = await Sessions.updateOne(
            {
                user_id: customer_id
            },
            {
                session_id: uuid(),
                isActive: true
            },
            {
                upsert: true
            }
        ).then(async (result) => {
            return await Sessions.findOne({user_id : customer_id});
        }).catch((error) => {
            this.errorObj.setInfoID = infoId.UNAUTHORIZED;
            this.errorObj.setInfoMsg = error.message;
            this.errorObj.send(this.httpResponse);
        });
        return session.session_id;
    }
};