import json
import psycopg2

# List the columns you want to insert (adjust as needed for your table)
columns = [
    "record_type", "distance_km", "duration_minutes", "pace", "average_cadence",
    "average_heartrate", "run_date", "race_name", "race_location",
    "plan_week_start_date", "day_of_week", "created_at", "race_date"
]

with open('output.json', 'r') as f:
    data = json.load(f)

# Prepare records: set record_type to 'run', fill missing fields with None
data_to_insert = []
for record in data:
    row = {col: record.get(col, None) for col in columns}
    row["record_type"] = "run"
    data_to_insert.append(row)

conn = psycopg2.connect(
    dbname="running_coach_db",
    user="running_coach_user",
    password="running",
    host="localhost",
    port=5432
)
cur = conn.cursor()

insert_query = f"""
INSERT INTO training_records ({', '.join(columns)})
VALUES ({', '.join(['%({})s'.format(col) for col in columns])})
"""

for row in data_to_insert:
    cur.execute(insert_query, row)

conn.commit()
cur.close()
conn.close()
print("Data inserted successfully.") 