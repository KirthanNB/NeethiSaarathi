import ollama
import requests
import time
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

def answer(question: str, context: str) -> str:
    prompt = (
        "You are a helpful Indian legal assistant. "
        "Use only the context below. If an answer isn't in the context, say you don't know. "
        "Cite relevant Articles/Sections when available.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {question}\n"
        "Answer:"
    )
    
    try:
        # Check if Ollama server is running
        try:
            response = requests.get("http://localhost:11434/api/tags", timeout=10)
            if response.status_code != 200:
                error_msg = "Ollama server is not responding properly"
                logger.error(error_msg)
                return error_msg
        except requests.ConnectionError:
            error_msg = "Ollama server is not running. Please start it with: ollama serve"
            logger.error(error_msg)
            return error_msg
        except requests.Timeout:
            error_msg = "Ollama server timeout. Make sure it's running: ollama serve"
            logger.error(error_msg)
            return error_msg
        
        # Get available models
        try:
            available_models = ollama.list()
            logger.info("Ollama models available")
            
            # Handle the object response format
            models_list = available_models.models if hasattr(available_models, 'models') else []
            
            # Try to find gpt-oss:20b specifically
            model_name = None
            for model in models_list:
                if hasattr(model, 'model') and model.model == "gpt-oss:20b":
                    model_name = "gpt-oss:20b"
                    break
                elif hasattr(model, 'name') and model.name == "gpt-oss:20b":
                    model_name = "gpt-oss:20b"
                    break
            
            if not model_name:
                # If gpt-oss:20b is not found, try any model with "gpt-oss" in the name
                for model in models_list:
                    model_attr = getattr(model, 'model', getattr(model, 'name', ''))
                    if "gpt-oss" in str(model_attr).lower():
                        model_name = model_attr
                        break
            
            if not model_name:
                error_msg = "gpt-oss model not found. Please ensure gpt-oss:20b is available."
                logger.error(error_msg)
                return error_msg
            
            logger.info(f"Using model: {model_name}")
            
            # Generate response using the correct model
            res = ollama.chat(
                model=model_name,
                messages=[{"role": "user", "content": prompt}],
                options={"num_ctx": 4096},
                stream=False
            )
            
            # Extract content from the ChatResponse object
            if hasattr(res, 'message') and hasattr(res.message, 'content'):
                return res.message.content
            else:
                error_msg = "Unexpected response format from Ollama"
                logger.error(error_msg)
                return error_msg
                
        except ollama.ResponseError as e:
            error_msg = f"Ollama response error: {str(e)}"
            logger.error(error_msg)
            return error_msg
        except Exception as e:
            error_msg = f"Error getting model list: {str(e)}"
            logger.error(error_msg)
            return error_msg
                
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        logger.error(error_msg)
        import traceback
        logger.error(traceback.format_exc())
        return error_msg