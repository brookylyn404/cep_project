import requests

def fetch_nav_data():
    url = "https://www.amfiindia.com/spages/NAVAll.txt"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print("Error fetching data:", e)
        return None