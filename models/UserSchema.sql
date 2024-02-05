CREATE DATABASE chatter;
USE chat_app;

CREATE TABLE user (
    id integer PRIMARY KEY AUTO_INCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
)

INSERT INTO user (first_name, last_name, username, password)
VALUES
('petho', 'burr', 'pethoburr', 'burrburr')