# test_chat.py
import ollama

def test_chat():
    print("Testing basic chat functionality...")
    
    try:
        # Simple test message
        response = ollama.chat(
            model='gpt-oss:20b',
            messages=[{'role': 'user', 'content': 'Hello, how are you?'}],
            stream=False
        )
        
        print(f"Response type: {type(response)}")
        print(f"Response attributes: {dir(response)}")
        
        # Try different ways to access the content
        if hasattr(response, 'message') and hasattr(response.message, 'content'):
            print(f"Content via attributes: {response.message.content}")
        elif hasattr(response, 'message') and isinstance(response.message, dict):
            print(f"Content via dict: {response.message.get('content', 'No content')}")
        elif isinstance(response, dict) and 'message' in response:
            print(f"Content via dict access: {response['message'].get('content', 'No content')}")
        else:
            print("Could not extract content from response")
            print(f"Full response: {response}")
            
    except Exception as e:
        print(f"Chat test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_chat()