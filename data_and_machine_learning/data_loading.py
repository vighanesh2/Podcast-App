import pandas as pd
import os
import glob

# df = pd.read_csv('data.csv')

all_files = glob.glob(os.path.join(r'C:\Users\khusix\Downloads\podcast_data', '*.csv'))
df = pd.concat((pd.read_csv(f) for f in all_files), ignore_index=True)

df.to_csv(f'all_podcasts.csv', index=False)