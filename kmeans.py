import os
import re
import matplotlib.pyplot as plt

inertia_values = []
k_values = []

for filename in os.listdir('.'):
    if filename.startswith('performance') and filename.endswith('.txt'):
        match = re.search(r'k(\d+)', filename)
        if match:
            k = int(match.group(1))
            with open(filename, 'r') as f:
                content = f.read()
                inertia_match = re.search(r'inertia=([0-9.]+),', content)
                if inertia_match:
                    inertia = float(inertia_match.group(1))
                    k_values.append(k)
                    inertia_values.append(inertia)

# Sort by k for plotting
sorted_pairs = sorted(zip(k_values, inertia_values))
k_values_sorted, inertia_values_sorted = zip(*sorted_pairs)

plt.plot(k_values_sorted, inertia_values_sorted, marker='o')
plt.xlabel('k')
plt.ylabel('Inertia')
plt.title('Inertia vs k')
plt.show()
