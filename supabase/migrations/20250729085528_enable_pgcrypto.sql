-- Enable pgcrypto extension for PII encryption
-- Required for tasks #24-25: PII encryption with pgcrypto

CREATE EXTENSION IF NOT EXISTS pgcrypto;
