import psycopg2
import pandas as pd
from sklearn.cluster import KMeans
import time
import pickle
import seaborn as sns
from mpl_toolkits.mplot3d import Axes3D

# Database connection
conn = psycopg2.connect(
    dbname="running_coach_db",
    user="running_coach_user",
    password="running",
    host="localhost",
    port=5432
)
cur = conn.cursor()

# Fetch data
query = """
SELECT distance_km, duration_minutes, pace, average_cadence, average_heartrate
FROM training_records
WHERE record_type = 'run'
"""
df = pd.read_sql(query, conn)
cur.close()
conn.close()
print(df.shape)
print("Data fetched from the database.")
print(df.head())
print("Non-null counts for each column:")
print(df.notnull().sum())
# Find rows where average_heartrate is not None
df = df.dropna()

# Perform KMeans clustering with k=10
kmeans = KMeans(n_clusters=10, random_state=42)
df['cluster'] = kmeans.fit_predict(df)

# Optionally, save the model for later use
with open('kmeans_model.pkl', 'wb') as f:
    pickle.dump(kmeans, f)

# Save clustered data to a new CSV file
df.to_csv('clustered_training_records.csv', index=False)

# Sample 10 records from each cluster and save to a new CSV
sampled_df = df.groupby('cluster').apply(lambda x: x.sample(n=100, random_state=42) if len(x) >= 100 else x).reset_index(drop=True)
sampled_df.to_csv('sampled_10_per_cluster.csv', index=False)