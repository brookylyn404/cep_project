from backend.pipeline.fetch_history import fetch_historical_nav
from backend.pipeline.store import store_data
from backend.pipeline.risk import calculate_daily_return
from datetime import datetime

mutual_funds = ["119551", "119552", "119553", "108272", "110282"]

def run_historical_pipeline():
    print("Historical pipeline starting...")

    df = fetch_historical_nav(mutual_funds, years=3)
    print("Historical NAV fetched!")
    print(df.head())

    df = calculate_daily_return(df)
    print("ML features calculated!")
    print(df.head())

    store_data(df, "historical")
    print("Historical data stored!")

if __name__ == "__main__":
    run_historical_pipeline()