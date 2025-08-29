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
                con.pk,
                CASE
                	WHEN con.title IS NULL THEN (SELECT first_name FROM member WHERE pk = (SELECT fk_member FROM participant WHERE fk_conversation = con.pk AND fk_member <> $1))
                	ELSE con.title
               	END AS title,
                (
                    SELECT mem.pk FROM message AS mes INNER JOIN member AS mem ON mes.fk_member = mem.pk WHERE fk_conversation = con.pk ORDER BY sent_at DESC LIMIT 1
                ) AS last_message_sender_pk,
                (
                    SELECT mem.first_name FROM message AS mes INNER JOIN member AS mem ON mes.fk_member = mem.pk WHERE fk_conversation = con.pk ORDER BY sent_at DESC LIMIT 1
                ) AS last_message_sender,
                (
                    SELECT content_text FROM message WHERE fk_conversation = con.pk ORDER BY sent_at DESC LIMIT 1
                ) AS last_message_text,
                (
                    SELECT sent_at FROM message WHERE fk_conversation = con.pk ORDER BY sent_at DESC LIMIT 1
                ) AS last_message_time,
                type_conversation
            FROM conversation AS con 
            INNER JOIN participant AS par 
            ON con.pk = par.fk_conversation 
            WHERE par.fk_member = $1
            ORDER BY last_message_time DESC`, 
            [pk_member]
        );
        
        return result.rows;
    }

    async findOne(type_conversation, pk_member_list, title) {
        var query = `SELECT 
            con.pk
            FROM conversation AS con`;

        for (let i = 0; i < pk_member_list.length; i++) {
            query += `\n INNER JOIN participant AS par${i} 
            ON con.pk = par${i}.fk_conversation`;
        }

        query += `\n WHERE con.type_conversation = ${type_conversation === 0 ? 'false' : 'true'}`;

        for (let i = 0; i < pk_member_list.length; i++) {
            query += `\n AND par${i}.fk_member = '${pk_member_list[i]}'`;
        }

        if (title != null && title != '' && title != undefined) 
            query += `\n AND con.title = '${title}' ORDER BY con.created_at DESC LIMIT 1`;
        
        const result = await database.query(query);
        
        return result.rows;
    }

    formatPkMemberList(list_pk_member) {
        if (list_pk_member == null || list_pk_member.length === 0) {
            return '';
        }

        return list_pk_member.map(pk => `'${pk}'`).join(',');
    }

    async findOneByPk(pk) {

        const result = await database.query(
            'SELECT * FROM conversation WHERE pk = $1', 
            [pk]
        );
        
        return result.rows[0];
    }
}
  
module.exports = new ConversationRepository();