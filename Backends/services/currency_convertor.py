import requests
from config import BASE_URL

def convert_currency(from_currency, to_currency, amount):

    url = f"{BASE_URL}?from={from_currency}&to={to_currency}"
    
    response = requests.get(url)
    data = response.json()

    rate = data["rates"][to_currency]

    converted = rate * amount

    return round(converted, 2)