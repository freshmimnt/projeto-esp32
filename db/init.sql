CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE vehicles(
    id SERIAL PRIMARY KEY,
    id_user INT REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL,
    self_driving BOOLEAN NOT NULL,
    distance_travelled INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);

CREATE TABLE sensors(
    id SERIAL PRIMARY KEY,
    id_vehicle INT REFERENCES vehicles(id) ON DELETE CASCADE,
    speed INT NOT NULL,
    battery INT NOT NULL,
    distance_to_obstacle INT NOT NULL,
);

-- Insert for users table
INSERT INTO users (name, email, password)
VALUES 
  ('Alice', 'alice@example.com', 'password1'),
  ('Maria', 'maria@example.com', 'password2'),
  ('Jorge', 'jorge@example.com', 'password3');

-- Inserts for vehicles table
INSERT INTO vehicles (id_user, is_active, self_driving, distance_travelled, start_time, end_time)
VALUES 
  (1, FALSE, TRUE, 20, '2025-05-06 07:30:00', '2025-05-06 08:30:00'),
  (2, TRUE, FALSE, 10,'2025-05-06 07:30:00', '2025-05-06 08:30:00'),
  (3, TRUE, TRUE, 0,'2025-05-06 06:00:00', '2025-05-06 07:00:00');

-- Insert for sensorsData table
INSERT INTO sensors_data (id_vehicle, speed, battery, distance_to_obstacle)
VALUES 
  (1, 35, 76, 10),
  (2, 0, 82, 1),
  (3, 22, 65, 5);
