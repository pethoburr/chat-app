USE chatter;

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT,
    room_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES user(id),
    FOREIGN KEY (receiver_id) REFERENCES user(id),
    FOREIGN KEY (room_id) REFERENCES room(id)
);