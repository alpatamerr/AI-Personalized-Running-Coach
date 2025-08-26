const fs = require('fs');
const path = require('path');

function loadKMeansModel(modelPath) {
  const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const { feature_names, centroids, scaler } = model;

  function predict(sample) {
    // 1. Convert sample to vector in correct order
    const x = feature_names.map(f => {
      if (!(f in sample)) throw new Error(`Missing feature: ${f}`);
      return Number(sample[f]);
    });
    // 2. Standardize if scaler present
    let xz = x;
    if (scaler && scaler.mean && scaler.scale) {
      xz = x.map((v, i) => (v - scaler.mean[i]) / scaler.scale[i]);
    }
    // 3. Compute Euclidean distance to each centroid
    let minIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < centroids.length; ++i) {
      const c = centroids[i];
      const dist = Math.sqrt(c.reduce((sum, ci, j) => sum + Math.pow(xz[j] - ci, 2), 0));
      if (dist < minDist) {
        minDist = dist;
        minIdx = i;
      }
    }
    return minIdx;
  }

  return { predict, feature_names, centroids, scaler, inertia: model.inertia, n_clusters: model.n_clusters };
}

module.exports = loadKMeansModel;
