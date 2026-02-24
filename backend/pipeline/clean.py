import pandas as pd

def clean_data(raw_text):
    rows = []
    lines = raw_text.split("\n")  # Split text into lines

    for line in lines:
        parts = line.split(";")  # NAV file is semicolon-separated

        # Only process lines that look like valid NAV data
        if len(parts) > 4 and parts[4].replace('.', '', 1).isdigit():
            rows.append({
                "scheme_code": parts[0],
                "scheme_name": parts[3],
                "nav": float(parts[4])
            })

    df = pd.DataFrame(rows)
    return df