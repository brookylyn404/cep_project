import pandas as pd
import os

def store_data(df, year):
    # Create data folder if it doesn't exist
    os.makedirs("data", exist_ok=True)

    # Save the cleaned NAV data for the given year
    file_path = f"data/navs_{year}.parquet"
    df.to_parquet(file_path, index=False)

    print(f"Data for {year} stored successfully at {file_path}")