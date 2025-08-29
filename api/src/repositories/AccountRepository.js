const database = require('../database/database_connection');
const sendToSplunk = require('../service/splunk_hec');

class AccountRepository {
    async create(member, ip_address) {
        const { first_name, email, password_signin } = member;

        if(await !this.checkIfMemberAlreadyExists(email))
        {
            await sendToSplunk('Member already exists', 'WARN', 'AR-C_0', {first_name, email, ip_address}, 'api', null);
            return false;
        }

        try{
            await database.query(
                'INSERT INTO member (first_name, email, password_signin, ip_address) VALUES ($1, $2, $3, $4);', 
                [first_name, email, password_signin, ip_address]
            );
        }
        catch(error){
            await sendToSplunk('Error to try check if member already exists', 'ERROR', 'AR-C_1', {error, data: {first_name, email, password_signin, ip_address}}, 'api', null);
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
            await sendToSplunk('Error to try check if member already exists', 'ERROR', 'AR-CIMAE_0', {error, data: {email}}, 'api', null);
            return 0;
        }
    }

    async signIn(email, password_signin, ip_address) {

        if(!await this.checkIfMemberAlreadyExists(email))
        {
            await sendToSplunk('Member do not exists', 'WARN', 'AR-SI_0', {email, ip_address}, 'api', null);
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

        return result.rows[0];
    }

    async findByPk(pk) {

        try{
            const result = await database.query(
                'SELECT pk, first_name, email, created_at FROM member WHERE pk = $1', 
                [pk]
            );

            return result.rows[0];
        }
        catch(error){
            await sendToSplunk('Error to try check if member already exists', 'ERROR', 'AR-FBP_0', {error, data: {pk}}, 'api', null);
        }
    }
}
  
module.exports = new AccountRepository();