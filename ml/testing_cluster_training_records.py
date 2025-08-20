import psycopg2
import pandas as pd
from sklearn.cluster import KMeans
import time
import pickle

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

# Fill missing values with 0 (or use another strategy if you prefer)
df = df.dropna()
k = 3
while True:
    print(f"\nClustering with k={k}")
    start_time = time.time()
    print("Start time:", time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(start_time)))

    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(df)

    finish_time = time.time()
    print("Finish time:", time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(finish_time)))
    elapsed = finish_time - start_time
    print(f"Clustering took {elapsed:.2f} seconds.")

    # Print performance (inertia is a common metric for k-means)
    print(f"Performance (inertia): {kmeans.inertia_}")

    # Save clusters if took more than 40 minutes (2400 seconds)
    if elapsed > 2400:
        with open(f'clusters_k{k}.pkl', 'wb') as f:
            pickle.dump(kmeans, f)
        print(f"Clustering took more than 40 minutes. Saved clusters to clusters_k{k}.pkl")
        break
    else:
        # Save performance for each k
        with open(f'performance_k{k}.txt', 'w') as f:
            f.write(f"k={k}, inertia={kmeans.inertia_}, time={elapsed:.2f} seconds\n")
        print(f"Saved performance to performance_k{k}.txt")
        k += 1 