import pandas as pd
import numpy as np
df = pd.read_csv("./brasil_tour/data/routes.csv")
df['distance'] = np.random.randint(1, 30, df.shape[0])
df.to_csv("../api/data/routes.csv", index=False)
