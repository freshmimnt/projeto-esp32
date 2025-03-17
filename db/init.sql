CREATE TYPE STATUS AS ENUM ('idle', 'moving', 'completed', 'failed', '');
CREATE TYPE TYPE AS ENUM ('walls', 'ramp', 'irregular_suface');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE vehicles(
    id SERIAL PRIMARY KEY,
    id_users INT REFERENCES users(id) ON DELETE CASCADE,
    vehicle_status STATUS NOT NULL,
    self_driving BOOLEAN NOT NULL
);

CREATE TABLE deliveries(
    id SERIAL PRIMARY KEY,
    id_vehicles INT REFERENCES vehicles(id) ON DELETE CASCADE,
    deliveries_status STATUS NOT NULL,
    speed_avg FLOAT NOT NULL,
    battery_avg FLOAT NOT NULL,
    distance_travelled FLOAT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);

CREATE TABLE obstacles(
    id SERIAL PRIMARY KEY,
    id_vehicles INT REFERENCES vehicles(id) ON DELETE CASCADE,
    obstacle_type TYPE NOT NULL,
    reaction_time INT NOT NULL,
    distance_to_obstacle FLOAT NOT NULL
);