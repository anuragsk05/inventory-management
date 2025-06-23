-- 1. sql table and class table must match each other
-- 2. then use sqlalchemy to load data to table
CREATE TABLE items (
    id INTEGER PRIMARY KEY,
    item_name TEXT,
    brand TEXT,
    date_added TEXT,
    quantity INTEGER,
    user_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)  --users(id) operates as a column the id falls under the user_id
);
