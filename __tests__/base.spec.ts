import paypal from "../src/service/paypal";
import braintree from "../src/service/braintree";
import createPaypalJson from '../src/utils/createPaypalJson';

describe("Payment processor test", () => {
    test("Check Paypal", () => {
        const body = {
            fullname: 'ashish',
            currency: 'USD',
            amount: '10',
            cardname: 'ashish',
            cardnumber: '4111111111111',
            expmonth: '09',
            expyear: '22',
            cvv: '400'
          }
        const formBody = createPaypalJson(body);
        const res = {}
        expect(paypal(formBody, body, res)).toBe("success")
    });
    test("Check Braintree", () => {
        const body = {
            fullname: 'ashish',
            currency: 'USD',
            amount: '10',
            cardname: 'ashish',
            cardnumber: '4111111111111',
            expmonth: '09',
            expyear: '22',
            cvv: '400'
          }
          const res = {}
        expect(braintree(body, res)).toBe("success");
    });

});