-- Drops table
DROP TABLE IF EXISTS transaction;
DROP TABLE IF EXISTS users;


-- Creates table
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , name varchar(50) NOT NULL
    , email varchar(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , user_id INT NOT NULL
    , payment_id varchar(50) NOT NULL
    , amount varchar(50) NOT NULL
    , currency varchar(50) NOT NULL
    , card_number varchar(50) NOT NULL
    , status INT NOT NULL
    , created_date varchar(50) NULL
);