CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE vehicles(
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES users(id) ON DELETE CASCADE,
    self_driving BOOLEAN NOT NULL
);

CREATE TABLE sensors(
    id SERIAL PRIMARY KEY,
    id_vehicle INT REFERENCES vehicles(id) ON DELETE CASCADE,
    speed FLOAT NOT NULL,
    battery FLOAT NOT NULL,
    distance_travelled FLOAT NOT NULL,
    distance_to_obstacle FLOAT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);
