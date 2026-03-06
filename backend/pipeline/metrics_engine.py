import os
import pandas as pd
import numpy as np

NAV_FOLDER = "data/nav_processed"
OUTPUT_FILE = "data/fund_metrics.csv"

RISK_FREE_RATE = 0.06  # 6% assumed


def calculate_cagr(df):
    start_value = df["nav"].iloc[0]
    end_value = df["nav"].iloc[-1]

    num_years = (df["date"].iloc[-1] - df["date"].iloc[0]).days / 365

    if num_years == 0:
        return 0

    cagr = (end_value / start_value) ** (1 / num_years) - 1
    return cagr


def calculate_annual_volatility(df):
    daily_std = df["daily_return"].std()
    return daily_std * np.sqrt(252)


def calculate_sharpe(cagr, volatility):
    if volatility == 0:
        return 0
    return (cagr - RISK_FREE_RATE) / volatility


def calculate_max_drawdown(df):
    df["cumulative"] = (1 + df["daily_return"]).cumprod()
    df["rolling_max"] = df["cumulative"].cummax()
    df["drawdown"] = df["cumulative"] / df["rolling_max"] - 1
    return df["drawdown"].min()


def run_metrics_engine():

    print("Running Metrics Engine...")

    results = []

    for file in os.listdir(NAV_FOLDER):

        if not file.endswith(".parquet"):
            continue

        file_path = os.path.join(NAV_FOLDER, file)
        df = pd.read_parquet(file_path)

        if df.empty or "daily_return" not in df.columns:
            continue

        df["date"] = pd.to_datetime(df["date"])
        df = df.sort_values("date")

        cagr = calculate_cagr(df)
        volatility = calculate_annual_volatility(df)
        sharpe = calculate_sharpe(cagr, volatility)
        max_dd = calculate_max_drawdown(df)

        results.append({
            "fund_name": file.replace(".parquet", "").replace("_", " "),
            "cagr": round(cagr, 4),
            "volatility": round(volatility, 4),
            "sharpe_ratio": round(sharpe, 4),
            "max_drawdown": round(max_dd, 4)
        })

        print(f"Processed metrics for {file}")

    metrics_df = pd.DataFrame(results)
    metrics_df.to_csv(OUTPUT_FILE, index=False)

    print("Metrics file generated at data/fund_metrics.csv")


if __name__ == "__main__":
    run_metrics_engine()