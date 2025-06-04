const database = require('../database/database_connection');

class MessageRepository {
    async create(fk_conversation, fk_member, content_text) {

        await database.query(
            'INSERT INTO message (fk_conversation, fk_member, content_text) VALUES ($1, $2, $3);', 
            [fk_conversation, fk_member, content_text]
        );
    }

    async list(pk_conversation) {

        const result = await database.query(
            `SELECT
                mes.pk,
                mes.fk_member,
                mes.content_text,
                mes.sent_at
            FROM message AS mes 
            WHERE mes.fk_conversation = $1
            ORDER BY mes.sent_at ASC`, 
            [pk_conversation]
        );
        
        return result.rows;
    }
}
  
module.exports = new MessageRepository();