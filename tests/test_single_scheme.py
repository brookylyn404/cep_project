import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pandas as pd
from backend.pipeline.fetch import fetch_nav_data
from backend.pipeline.clean import clean_historical_nav
from backend.pipeline.risk import calculate_daily_return

SCHEME_CODE = 119551

raw_data = fetch_nav_data(SCHEME_CODE)
df = clean_historical_nav(raw_data, years=3)

df["scheme_code"] = SCHEME_CODE
df = calculate_daily_return(df)

print(df.head())
print(df.tail())

df.to_csv("single_scheme_output.csv", index=False)
print("File saved successfully!")