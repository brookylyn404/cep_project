import pandas as pd
import glob
import os

def load_historical_navs():
    csv_files = glob.glob("data/csv/*.csv")
    df_list = []

    for file in csv_files:
        df = pd.read_csv(file)
        # Assume CSV has columns: Date, NAV
        df["date"] = pd.to_datetime(df["Date"], dayfirst=True)
        df["scheme_name"] = os.path.basename(file).replace(".csv","")
        df["nav"] = df["NAV"]
        df["scheme_code"] = df["scheme_name"]  # optional if scheme_code not in CSV
        df_list.append(df[["scheme_code","scheme_name","date","nav"]])

    full_df = pd.concat(df_list, ignore_index=True)
    full_df = full_df.sort_values(["scheme_code", "date"])
    return full_df

def store_historical_parquet(df):
    # <- Make sure everything inside the function is indented
    os.makedirs("data", exist_ok=True)
    df.to_parquet("data/navs_2years.parquet", index=False)
    print("Stored historical 2-year NAVs as Parquet!")

# Entry point of script — also must be at column 0 (no indentation)
if __name__ == "__main__":
    df = load_historical_navs()
    store_historical_parquet(df)