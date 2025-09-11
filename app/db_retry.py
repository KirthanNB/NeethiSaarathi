<<<<<<< HEAD
from sqlalchemy.exc import OperationalError
import time, functools

def retry_db(func, retries=3, delay=1):
    @functools.wraps(func)
    def wrapped(*args, **kwargs):
        for attempt in range(retries):
            try:
                return func(*args, **kwargs)
            except OperationalError as e:
                if "2013" in str(e) and attempt < retries - 1:
                    time.sleep(delay)
                    continue
                raise
=======
from sqlalchemy.exc import OperationalError
import time, functools

def retry_db(func, retries=3, delay=1):
    @functools.wraps(func)
    def wrapped(*args, **kwargs):
        for attempt in range(retries):
            try:
                return func(*args, **kwargs)
            except OperationalError as e:
                if "2013" in str(e) and attempt < retries - 1:
                    time.sleep(delay)
                    continue
                raise
>>>>>>> 34bfed59a7954dc6f0fd3553abe049efd9a8603e
    return wrapped