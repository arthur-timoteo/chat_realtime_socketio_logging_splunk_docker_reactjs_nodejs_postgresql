const database = require('../database/database_connection');

class ParticipantRepository {
    async add(fk_conversation, fk_member) {

        await database.query(
            'INSERT INTO participant (fk_conversation, fk_member) VALUES ($1, $2);', 
            [fk_conversation, fk_member]
        );
    }
}
  
module.exports = new ParticipantRepository();