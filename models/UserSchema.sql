CREATE DATABASE chatter;
USE chatter;

CREATE TABLE user (
    id integer PRIMARY KEY AUTO_INCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)

INSERT INTO user (first_name, last_name, username, password)
VALUES
('petho', 'burr', 'pethoburr', 'burrburr')
