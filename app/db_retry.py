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
    return wrapped
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
    return wrapped