const database = require('../database/database_connection');

class AccountRepository {
    async create(member) {
        const { first_name, email, password_signin, ip_address } = member;

        if(await this.checkIfMemberAlreadyExists(email))
        {
            return false;
        }

        await database.query(
            'INSERT INTO member (first_name, email, password_signin, ip_address) VALUES ($1, $2, $3, $4);', 
            [first_name, email, password_signin, ip_address]
        );

        return true;
    }

    async checkIfMemberAlreadyExists(email) {

        const result = await database.query(
            'SELECT COUNT(*) FROM member WHERE email = $1', 
            [email]
        );

        return result.rows[0].count;
    }

    async signIn(email, password_signin, ip_address) {

        if(!await this.checkIfMemberAlreadyExists(email))
        {
            return false;
        }

        const result = await database.query(
            'SELECT pk FROM member WHERE email = $1 AND password_signin = $2', 
            [email, password_signin]
        );
        
        if(result.rows.length == 0)
        {
            return false;
        }

        await this.logSignInHistory(result.rows[0].pk, ip_address);
        
        return result.rows[0].count == 0 ? false : true;
    }

    async logSignInHistory(fk_member, ip_address) {

        await database.query(
            'INSERT INTO log_in_history (fk_member, ip_address) VALUES ($1, $2);', 
            [fk_member, ip_address]
        );

    }
}
  
module.exports = new AccountRepository();