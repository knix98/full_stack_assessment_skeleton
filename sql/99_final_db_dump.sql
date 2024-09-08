USE home_db;
DROP TABLE IF EXISTS user_home_relation;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS home;

CREATE TABLE user (
  id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  username varchar(100) UNIQUE NOT NULL,
  email varchar(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE home (
  id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  street_address varchar(255) UNIQUE NOT NULL,
  state varchar(50) DEFAULT NULL,
  zip varchar(10) DEFAULT NULL,
  sqft float UNSIGNED DEFAULT NULL,
  beds int UNSIGNED DEFAULT NULL,
  baths int UNSIGNED DEFAULT NULL,
  list_price float UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_home_relation (
  id int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id int(11) UNSIGNED NOT NULL,
  home_id int(11) UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY user_home_idx (user_id, home_id),
  FOREIGN KEY (user_id) REFERENCES user (id),
  FOREIGN KEY (home_id) REFERENCES home (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO user (username, email)
SELECT DISTINCT username, email FROM user_home;

INSERT INTO home (street_address, state, zip, sqft, beds, baths, list_price)
SELECT DISTINCT street_address, state, zip, sqft, beds, baths, list_price FROM user_home;

INSERT INTO user_home_relation (user_id, home_id)
SELECT user.id, home.id FROM user_home
JOIN user ON user_home.username = user.username
JOIN home ON user_home.street_address = home.street_address;

-- Can drop the original table also (if needed)
-- DROP TABLE IF EXISTS user_home;