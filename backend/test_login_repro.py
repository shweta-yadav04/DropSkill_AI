import urllib.request
import json
import urllib.error

url = "http://localhost:8000/api/auth/login"
payload = {
    "email": "shweta80067@gmail.com",
    "password": "password"
}
data = json.dumps(payload).encode('utf-8')
headers = {
    "Content-Type": "application/json"
}

req = urllib.request.Request(url, data=data, headers=headers, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print(f"Response Text: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"Status Code: {e.code}")
    print(f"Response Text: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Request Failed: {e}")
