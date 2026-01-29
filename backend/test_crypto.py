import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from auth import verify_password, get_password_hash, create_access_token
from config import settings

print("Testing crypto functions...")

try:
    print("Running password hash test...")
    pwd = "password123"
    hashed = get_password_hash(pwd)
    print(f"Hash created: {hashed}")
    
    print("Running password verify test...")
    is_valid = verify_password(pwd, hashed)
    print(f"Password valid: {is_valid}")
    assert is_valid
    
    print("Running JWT test...")
    data = {"sub": "1"}
    token = create_access_token(data)
    print(f"JWT created: {token}")
    
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"TEST FAILED TYPE: {type(e)}")
    print(f"TEST FAILED MSG: {e}")
