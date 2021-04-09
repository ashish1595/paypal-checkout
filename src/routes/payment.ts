import * as express from "express";
import paypal from 'paypal-rest-sdk';
import validationRule from "../utils/validationRule";
import Transaction from '../repo/Transaction'
import createPaypalJson from '../utils/createPaypalJson'
import braintree from 'braintree'

export const register = ( app: express.Application ) => {

    app.post( `/payment`, async ( req: any, res ) => {
            const formBody = req.body;
            const outcome = validationRule(formBody);
            console.log("outcome "+outcome);
            outcomeBasedAction(outcome, formBody, res);
    });


    app.get('/success', (req, res) => {
        const payerId = req.query.PayerID as string;
        const paymentId = req.query.paymentId as string;
        const txn = new Transaction().get(paymentId)
        txn.then((result) => {
            const paymentJson = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": result[0].currency,
                        "total": result[0].amount
                    }
                }]
              };
              paypal.payment.execute(paymentId, paymentJson,  (error, payment) => {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    console.log(JSON.stringify(payment));
                    res.render('success');
                }
            });
        });
      });

      app.get('/cancel', (req, res) => {
        const token = req.query.token as string;
        // TODO: save token in db
        res.render('cancel');
      });

};

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

function processBraintreePayment(formBody: any, res: any) {
    const gateway = new braintree.BraintreeGateway({
        environment: braintree.Environment.Sandbox,
        merchantId: process.env.MERCHANT_ID,
        publicKey: process.env.PUBLIC_KEY,
        privateKey: process.env.PRIVATE_KEY
    });

    gateway.customer.create({
        firstName: formBody.fullname,
        lastName: "Smith",
        company: "Braintree",
        email: "jen@example.com",
        phone: "312.555.1234",
        fax: "614.555.5678",
        website: "www.example.com"
      }).then(result => {
        const creditCardParams = {
            customerId: result.customer.id,
            number: formBody.cardnumber,
            expirationDate: formBody.expmonth + "/" + formBody.expyear,
            cvv: formBody.cvv
        };
        gateway.creditCard.create(creditCardParams).then(response => {
            console.log("braintree resp ", response);
            const transaction = new Transaction();
            transaction.insert({
                "paymentId": "braintree",
                "amount": formBody.amount,
                "cardNumber": formBody.cardnumber,
                "currency": formBody.currency
            });
            if (response.success === false)
                res.render('error')
            else
                res.render('success');
        });
      });


}

function processPaypalPayment(paymentJson: any, formBody: any, res: any) {
    paypal.payment.create(paymentJson, (error, payment) => {
        if (error) {
            throw error;
        } else {
            for (const row of payment.links) {
                if (row.rel === 'approval_url') {
                    const transaction = new Transaction();
                    transaction.insert({
                        "paymentId": payment.id,
                        "amount": formBody.amount,
                        "cardNumber": formBody.cardnumber,
                        "currency": formBody.currency
                    });
                    res.redirect(row.href);
                }
            }
        }
    });
}