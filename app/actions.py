import os
import json
from pathlib import Path
from datetime import datetime

def generate_scheme_form(question: str) -> str:
    """Generate scheme form using ACTUAL query context"""
    try:
        # Create temp directory
        temp_dir = Path("temp_files")
        temp_dir.mkdir(exist_ok=True)
        
        # Create safe filename
        filename = f"scheme_form_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        temp_file = temp_dir / filename
        
        # Create form based on ACTUAL query
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump({
                "scheme_query": question,
                "auto_generated": True,
                "timestamp": datetime.now().isoformat(),
                "suggested_fields": [
                    "personal_information",
                    "educational_qualifications", 
                    "income_details",
                    "supporting_documents",
                    "bank_account_details",
                    "contact_information"
                ],
                "status": "draft",
                "notes": "This is an auto-generated form template based on your query. Please fill in the actual details as required by the specific scheme."
            }, f, indent=2)
        
        return str(temp_file)
        
    except Exception as e:
        print(f"Error generating scheme form: {e}")
        return ""

# RTI FUNCTION COMPLETELY REMOVED