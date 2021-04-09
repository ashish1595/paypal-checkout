import pool from '../dbconfig/dbconnector';

class Transaction {

    public async get(paymentId: string) {
        try {
            // const client = await pool.connect();
            const sql = "SELECT * FROM transaction where payment_id='"+paymentId+"';";
            console.log("sql is "+sql);
            const { rows } = await pool.query(sql);
            return rows;
        } catch (error) {
            console.log(error);
        }
    }

    public async insert(request: any) {
        try {
            const sql = "INSERT INTO transaction (user_id, payment_id, amount, status, card_number, currency)"+
             "VALUES (1, '"+request.paymentId+"', "+request.amount+", '1', '"+request.cardNumber+"', '"+request.currency+"');";
             console.log("sql is "+sql);
             pool.query(sql, (err, res) => {
                console.log(err, res);
              }
            );
        } catch (error) {
            console.log(error);
        }
    }
}

export default Transaction;