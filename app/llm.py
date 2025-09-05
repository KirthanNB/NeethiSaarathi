import os
import logging
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
def answer(question: str, context: str) -> str:
    print(context)
    prompt = (
        "You are a helpful Indian legal assistant. "
        "Use only the context below. If an answer isn't in the context, say you don't know. "
        "Cite relevant Articles/Sections when available.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {question}\n"
        "Answer:"
    )
    
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-120b",  # Using the exact model from your documentation
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that provides accurate information based on the given context."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=4096,
            temperature=0.1
        )
        
        # Extract the response content
        if completion and completion.choices and len(completion.choices) > 0:
            return completion.choices[0].message.content
        else:
            error_msg = "Unexpected response format from Groq API"
            logger.error(error_msg)
            return error_msg
            
    except Exception as e:
        error_msg = f"Error calling Groq API: {str(e)}"
        logger.error(error_msg)
        import traceback
        logger.error(traceback.format_exc())
        return error_msg