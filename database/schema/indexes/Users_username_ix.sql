DROP INDEX IF EXISTS Users_username_ix;
CREATE INDEX Users_username_ix ON Users (`username`);
