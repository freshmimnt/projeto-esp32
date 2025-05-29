CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES users (id) ON DELETE CASCADE,
    driving_mode TEXT NOT NULL
);

CREATE TABLE sensors (
    id SERIAL PRIMARY KEY,
    id_vehicle INT REFERENCES vehicles (id) ON DELETE CASCADE,
    speed INT NOT NULL,
    battery INT NOT NULL,
    inclination INT NOT NULL,
    distance_to_obstacle INT NOT NULL
);

-- Insert for users table
INSERT INTO
    users (name, email, password)
VALUES (
        'Alice',
        'alice@example.com',
        'password1'
    ),
    (
        'Maria',
        'maria@example.com',
        'password2'
    ),
    (
        'Jorge',
        'jorge@example.com',
        'password3'
    );