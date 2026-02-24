def calculate_daily_return(df):
    df = df.sort_values(["scheme_code", "date"])
    df["daily_return"] = df.groupby("scheme_code")["nav"].pct_change()
    return df