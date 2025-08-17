import requests
import time

url = "http://127.0.0.1:8000/query"
params = {"q": "What is the procedure for constitutional amendments?"}

try:
    print("Attempting to connect to server...")
    start_time = time.time()
    response = requests.post(url, json=params)
    end_time = time.time()

    print(f"Response time: {end_time - start_time:.2f} seconds")
    print("Status Code:", response.status_code)

    try:
        print("Response JSON:", response.json())
    except ValueError:
        print("Raw Response:", response.text)

except Exception as e:
    print("Error:", str(e))
