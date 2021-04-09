import paypal from 'paypal-rest-sdk';
import Transaction from '../repo/Transaction'

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

export default processPaypalPayment;