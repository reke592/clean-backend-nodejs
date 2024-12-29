DROP INDEX IF EXISTS Users_email_ix;
CREATE INDEX Users_email_ix ON Users (`email`);
