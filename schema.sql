CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username varchar(255) NOT NULL UNIQUE,
    email varchar(255) DEFAULT NULL,
    password varchar(512) NOT NULL,
    active boolean DEFAULT TRUE,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    auth_token varchar(255) UNIQUE DEFAULT NULL,
    latitude double precision DEFAULT NULL,
    longitude double precision DEFAULT NULL,
    description text DEFAULT NULL,
    first_name varchar(255),
    last_name varchar(255)
);



CREATE TABLE photos(
    id SERIAL PRIMARY KEY,
    creator integer REFERENCES users(id),
    absolute_path text,
    uuid varchar(255),
    description text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);



CREATE TABLE likes(
    id SERIAL PRIMARY KEY,
    liker integer REFERENCES users(id),
    likee integer REFERENCES users(id),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


CREATE TABLE meetups(
    id SERIAL PRIMARY KEY,
    creator integer REFERENCES users(id),
    description text DEFAULT NULL,
    title varchar(255),
    start timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


CREATE TABLE invites(
    id SERIAL PRIMARY KEY,
    invitee integer REFERENCES users(id),
    creator integer REFERENCES users(id),
    message text DEFAULT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone    

);



