COPY schools FROM '/docker-entrypoint-initdb.d/data/us-colleges-and-universities-clean.csv' DELIMITER ',' CSV HEADER;
