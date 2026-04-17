import urllib.request
req = urllib.request.Request(
    'http://127.0.0.1:8000/api/v1/resume/generate',
    data=b'{"full_name":"Test","contact_info":"Test","target_job_description":"Test","skills":["Test"],"education":[],"experiences":[]}',
    headers={'Content-Type': 'application/json'}
)
try:
    res = urllib.request.urlopen(req)
    print(res.read().decode())
except Exception as e:
    print(e.read().decode())
