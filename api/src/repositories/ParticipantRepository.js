const database = require('../database/database_connection');

class ParticipantRepository {
    async add(fk_conversation, fk_member) {

        await database.query(
            'INSERT INTO participant (fk_conversation, fk_member) VALUES ($1, $2);', 
            [fk_conversation, fk_member]
        );
    }

    async listAllParticipantsFromOneConversation(fk_conversation) {

        const result = await database.query(
            'SELECT fk_member FROM participant WHERE fk_conversation = $1;', 
            [fk_conversation]
        );

        return result.rows;
    }
}
  
module.exports = new ParticipantRepository();