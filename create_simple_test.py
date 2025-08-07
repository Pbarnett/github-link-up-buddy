#!/usr/bin/env python3
import uuid

# Generate a UUID for testing
test_trip_id = str(uuid.uuid4())
print(f"Test Trip Request ID: {test_trip_id}")

# Also provide the one from the SQL file as backup
sql_trip_id = "ba85c75a-3087-4141-bccf-d636f77fffbc"
print(f"SQL Test Trip ID: {sql_trip_id}")
