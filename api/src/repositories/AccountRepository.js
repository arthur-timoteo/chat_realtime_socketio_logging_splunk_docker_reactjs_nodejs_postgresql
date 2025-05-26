const database = require('../database/database_connection');

class AccountRepository {
    async create(member) {
        const { first_name, email, password_signin, ip_address } = member;

        if(await !this.checkIfMemberAlreadyExists(email))
        {
            console.log('aaaaaaaa');
            return false;
        }

        try{
            console.log('insert member');
            await database.query(
                'INSERT INTO member (first_name, email, password_signin, ip_address) VALUES ($1, $2, $3, $4);', 
                [first_name, email, password_signin, ip_address]
            );
        }
        catch(error){
            console.log(error);
            return false;
        }

        return true;
    }

    async checkIfMemberAlreadyExists(email) {

        try{
            const result = await database.query(
                'SELECT COUNT(*) FROM member WHERE email = $1', 
                [email]
            );

            return result.rows[0].count;
        }
        catch(error){
            console.log(error);
            return 0;
        }
    }

    async signIn(email, password_signin, ip_address) {

        if(!await this.checkIfMemberAlreadyExists(email))
        {
            return null;
        }

        const result = await database.query(
            'SELECT pk FROM member WHERE email = $1 AND password_signin = $2', 
            [email, password_signin]
        );
        
        if(result.rows.length == 0)
        {
            return null;
        }

        await this.logSignInHistory(result.rows[0].pk, ip_address);
        
        return result.rows[0];
    }

    async logSignInHistory(fk_member, ip_address) {

        await database.query(
            'INSERT INTO log_in_history (fk_member, ip_address) VALUES ($1, $2);', 
            [fk_member, ip_address]
        );

    }
}
  
module.exports = new AccountRepository();