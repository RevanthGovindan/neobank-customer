import log from "./log4j";

export default class ErrorHandler {
    constructor() {
        this.status = 500;
        this.success = false;
        this.infoID = "001";
        this.infoMsg = "An Error Occured";
    }

    set setStatus(code) {
        this.status = code;
    }

    set setInfoID(code) {
        this.infoID = code;
    }

    set setInfoMsg(msg) {
        this.infoMsg = msg;
    }

    send(response) {
        let responseData = {
            infoID: this.infoID,
            infoMsg: this.infoMsg
        }
        log.debug(JSON.stringify(responseData))
        response.status(this.status);
        response.send(responseData);
    }
}