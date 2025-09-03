import logging
import sys

def setup_logging():
    # Create a handler that can handle Unicode
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    
    # Set encoding to UTF-8 for the handler
    try:
        handler.stream.reconfigure(encoding='utf-8')
    except:
        pass  # Some streams may not support reconfigure
    
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        handlers=[handler],
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )