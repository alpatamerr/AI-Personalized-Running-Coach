# export_kmeans_to_json.py
import json
import pickle
import sys
from pathlib import Path

# EDIT THIS if your dataframe column order is different
FEATURE_NAMES = [
    "distance_km",
    "duration_minutes",
    "pace",
    "average_cadence",
    "average_heartrate",
]

def main(pkl_path="kmeans_model.pkl", out_json="kmeans_model.json"):
    pkl_path = Path(pkl_path)
    if not pkl_path.exists():
        raise FileNotFoundError(f"Pickle file not found: {pkl_path}")

    with open(pkl_path, "rb") as f:
        model = pickle.load(f)

    # Basic validations
    if not hasattr(model, "cluster_centers_"):
        raise ValueError("Loaded object does not look like a fitted KMeans (missing cluster_centers_).")

    export = {
        "n_clusters": int(getattr(model, "n_clusters", len(model.cluster_centers_))),
        "inertia": float(getattr(model, "inertia_", 0.0)),
        "feature_names": FEATURE_NAMES,
        "centroids": model.cluster_centers_.tolist(),  # shape: [K][D]
        "metric": "euclidean"
    }

    out_path = Path(out_json)
    out_path.write_text(json.dumps(export, indent=2))
    print(f"Wrote {out_path.resolve()}")

if __name__ == "__main__":
    # Usage:
    #   python export_kmeans_to_json.py               # uses defaults
    #   python export_kmeans_to_json.py model.pkl out.json
    args = sys.argv[1:]
    if len(args) == 0:
        main()
    elif len(args) == 1:
        main(args[0])
    else:
        main(args[0], args[1])
