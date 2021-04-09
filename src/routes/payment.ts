import * as express from "express";
import paypal from 'paypal-rest-sdk';
import validationRule from "../utils/validationRule";
import Transaction from '../repo/Transaction';
import outcomeBasedAction from '../factory/paymentProcessor';

export const register = ( app: express.Application ) => {

    app.post( `/payment`, async ( req: any, res ) => {
            const formBody = req.body;
            const outcome = validationRule(formBody);
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