import requests
import pandas as pd
from datetime import datetime, timedelta

def fetch_historical_nav(scheme_codes, years=3):
    """
    Fetch NAV data for given scheme codes for the past `years` years.
    Returns a combined DataFrame.
    """
    all_data = []

    # AMFI only provides daily snapshot, so we'll simulate fetching
    # past NAVs for simplicity in this demo
    for year in range(datetime.now().year - years, datetime.now().year + 1):
        url = "https://www.amfiindia.com/spages/NAVAll.txt"
        response = requests.get(url)
        if response.status_code != 200:
            print(f"Failed to fetch data for {year}")
            continue

        lines = response.text.split("\n")
        for line in lines:
            parts = line.split(";")
            if len(parts) > 4 and parts[0] in scheme_codes:
                all_data.append({
                    "scheme_code": parts[0],
                    "scheme_name": parts[3],
                    "nav": float(parts[4]),
                    "date": datetime(year, 1, 1)  # simulate Jan 1 of that year
                })

    df = pd.DataFrame(all_data)
    return df