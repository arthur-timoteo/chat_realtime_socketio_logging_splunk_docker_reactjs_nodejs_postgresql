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
            'SELECT m.pk, m.first_name FROM contact AS c INNER JOIN member AS m ON c.fk_member_contact = m.pk WHERE c.fk_member = $1', 
            [pk_member]
        );
        
        return result.rows;
    }

    async listWithoutConversation(pk_member) {

        const result = await database.query(
            `SELECT tbmem.pk, tbmem.first_name FROM contact AS tbcont
            INNER JOIN member AS tbmem
            ON tbcont.fk_member_contact = tbmem.pk
            WHERE fk_member = $1
            AND fk_member_contact NOT IN(
                SELECT part.fk_member
                FROM participant AS part
                WHERE part.fk_member <> $1
                AND fk_conversation IN(
                    SELECT con.pk
                    FROM conversation AS con 
                    INNER JOIN participant AS par 
                    ON con.pk = par.fk_conversation 
                    WHERE par.fk_member = $1
                    AND con.type_conversation = false
                )
            )`, 
            [pk_member]
        );
        
        return result.rows;
    }

    async delete(pk_member, pk_member_contact) {

        await database.query(
            'DELETE FROM contact WHERE fk_member = $1 AND fk_member_contact = $2;', 
            [pk_member, pk_member_contact]
        );

    }
}
  
module.exports = new ContactRepository();