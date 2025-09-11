import os
import logging
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY","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"))
def answer(question: str, context: str) -> str:
    print(context)
    prompt = (
    "You are Neethi Saarathi, a helpful Indian assistant guiding users about laws, rights, "
    "and government schemes. "
    "Always answer clearly in plain, simple language. "
    "Structure every response in the following sections if applicable:\n"
    "1. Eligibility – who can apply\n"
    "2. Benefits – what support is provided\n"
    "3. Application Process – how to apply, steps, portals, or authorities\n"
    "4. Documents Required – only if available\n"
    "5. Sources / Official Links – mention official government sites or URLs if present\n\n"
    "Avoid phrases like 'as per the database'. "
    "Do not use tables; instead, write in too short paragraphs and bullet points. "
    "If information is missing in the context, simply write 'Not relevant'. Type stuff"
    "Make sure the answer is clear, user-friendly, and well-structured.\n\n"
    f"Context:\n{context}\n\n"
    f"User Query: {question}\n"
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