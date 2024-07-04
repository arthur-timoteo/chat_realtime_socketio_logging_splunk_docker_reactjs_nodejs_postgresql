const database = require('../database/database_connection');

class ContactRepository {
    async add(pk_member, pk_member_contact) {

        await database.query(
            'INSERT INTO contact (fk_member, fk_member_contact) VALUES ($1, $2);', 
            [pk_member, pk_member_contact]
        );

    }

    async list(pk_member) {

        const result = await database.query(
            'SELECT pk FROM contact AS c INNER JOIN member AS m ON c.fk_member_contact = m.pk WHERE c.fk_member = $1', 
            [pk_member]
        );
        
        return result.rows;
    }
}
  
module.exports = new ContactRepository();