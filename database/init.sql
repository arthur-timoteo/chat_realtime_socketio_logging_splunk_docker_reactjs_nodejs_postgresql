-- Instalar a extensão uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE MEMBER (
    Pk UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    First_Name VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password_Signin VARCHAR(60) NOT NULL,
    Ip_Address VARCHAR(39) NOT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE CONTACT (
    Fk_Member UUID NOT NULL,
    Fk_Member_Contact UUID NOT NULL,
    Added_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT cnstnt_contact_fk_user 
        FOREIGN KEY(Fk_Member) 
        REFERENCES MEMBER(Pk),
    CONSTRAINT cnstnt_contact_fk_user_contact 
        FOREIGN KEY(Fk_Member_Contact) 
        REFERENCES MEMBER(Pk)
);

CREATE TABLE CONVERSATION (
    Pk UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    Type_Conversation BOOLEAN NOT NULL,
    Title VARCHAR(50) NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PARTICIPANT (
    Fk_Conversation UUID NOT NULL,
    Fk_Member UUID NOT NULL,
    Joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT cnstnt_participant_fk_conversation 
        FOREIGN KEY(Fk_Conversation) 
        REFERENCES CONVERSATION(Pk),
    CONSTRAINT cnstnt_participant_fk_user 
        FOREIGN KEY(Fk_Member) 
        REFERENCES MEMBER(Pk)
);

CREATE TABLE MESSAGE (
    Pk UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    Fk_Conversation UUID NOT NULL,
    Fk_Member UUID NOT NULL,
    Content_Text VARCHAR(250) NOT NULL,
    Sent_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT cnstnt_message_fk_conversation 
        FOREIGN KEY(Fk_Conversation) 
        REFERENCES CONVERSATION(Pk),
    CONSTRAINT cnstnt_message_fk_user 
        FOREIGN KEY(Fk_Member) 
        REFERENCES MEMBER(Pk)
);