import createPaypalJson from '../utils/createPaypalJson';
import processPaypalPayment from '../service/paypal';
import processBraintreePayment from '../service/braintree';

function outcomeBasedAction(outcome: string, formBody: any, res: any) {
    switch (outcome) {
        case "paypal": {
            const paymentJson = createPaypalJson(formBody);
            processPaypalPayment(paymentJson, formBody, res);
            break;
        }
        case "braintree": {
            processBraintreePayment(formBody, res);
            break;
        }
        default: {
            res.render('amex_error');
            break;
        }
    }
}

export default outcomeBasedAction;