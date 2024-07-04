const database = require('../database/database_connection');
const participantRepository = require('../repositories/ParticipantRepository');

class ConversationRepository {
    async create(type_conversation, title, list_pk_member) {

        await database.query(
            'INSERT INTO conversation (type_conversation, title) VALUES ($1, $2);', 
            [type_conversation, title]
        );

        const pk_conversation = await database.query(
            'SELECT pk FROM conversation ORDER BY created_at DESC LIMIT 1'
        );

        for (let i = 0; i < list_pk_member.length; i++) {
            await participantRepository.add(pk_conversation.rows[0].pk, list_pk_member[i]);
        }
    }

    async list(pk_member) {

        const result = await database.query(
            `SELECT 
                con.*,
                (
                    SELECT mem.first_name FROM message AS mes INNER JOIN member AS mem ON mes.fk_member = mem.pk WHERE fk_conversation = con.pk ORDER BY sent_at DESC LIMIT 1
                ) AS last_message_sender,
                (
                    SELECT content_text FROM message WHERE fk_conversation = con.pk ORDER BY sent_at DESC LIMIT 1
                ) AS last_message_text
            FROM conversation AS con INNER JOIN participant AS par ON con.pk = par.fk_conversation WHERE par.fk_member = $1`, 
            [pk_member]
        );
        
        return result.rows;
    }
}
  
module.exports = new ConversationRepository();