function createPaypalJson(body: any) {
    return {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:8080/success",
            "cancel_url": "http://localhost:8080/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": body.cardname,
                    "sku": "001",
                    "price": body.amount,
                    "currency": body.currency,
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": body.currency,
                "total": body.amount
            },
            "description": "Test Vamstar Assessment"
        }]
    };
}

export default createPaypalJson;