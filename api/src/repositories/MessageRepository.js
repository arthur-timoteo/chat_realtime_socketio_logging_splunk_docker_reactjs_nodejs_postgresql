const database = require('../database/database_connection');

class MessageRepository {
    async create(fk_conversation, fk_member, content_text, dt_created = 'CURRENT_DATE') {
        let query = 'INSERT INTO message (fk_conversation, fk_member, content_text, sent_at) VALUES ($1, $2, $3, $4) RETURNING pk;';

        const result = await database.query(query, [fk_conversation, fk_member, content_text, dt_created]);

        return result.rows[0].pk;
    }

    async list(pk_conversation) {

        const result = await database.query(
            `SELECT
                mes.pk,
                mes.fk_member,
                mes.content_text,
                mes.sent_at,
                mem.first_name
            FROM message AS mes 
            INNER JOIN member AS mem 
            ON mes.fk_member = mem.pk
            WHERE mes.fk_conversation = $1
            ORDER BY mes.sent_at ASC`, 
            [pk_conversation]
        );
        
        return result.rows;
    }
}
  
module.exports = new MessageRepository();