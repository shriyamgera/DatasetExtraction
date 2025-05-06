import google.generativeai as genai
import os

# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
genai.configure(api_key="AIzaSyARM1uO0AelTAiAzwL6FhDH-WRrkKePPg4")

model = genai.GenerativeModel("gemini-2.0-flash")

# def detect_categories(text):
#     prompt = f"""
# You are a data analyst. Given the following text, detect all **distinct and meaningful data categories** that could be extracted as structured datasets.

# Each category must be:
# 1. Specific and actionable (e.g., "Carbon Emissions", "Air Pollution Levels", "Government Policies", etc.)
# 2. Based on real-world measurable or reportable data.

# Return the output in this strict format:
# Category Name: <name>
# Short Description: <1-line description>

# Text:
# \"\"\"{text}\"\"\"
# """
#     response = model.generate_content(prompt)
#     lines = response.text.splitlines()
#     result = []
#     for line in lines:
#         if line.startswith("Category Name:"):
#             name = line.replace("Category Name:", "").strip()
#         elif line.startswith("Short Description:"):
#             desc = line.replace("Short Description:", "").strip()
#             result.append({"name": name, "description": desc})
#     return result

def extract_category_data(text, category_name, headers):
    prompt = f"""
Act like a professional data wrangler. You are given raw text and asked to extract structured tabular data relevant to the category: **{category_name}**.

Guidelines:
- Format the output in **CSV format** (first row as column headers).
- Use and reuse the existing headers where applicable: {headers}
- You may add new headers if needed, but avoid redundancy.
- If multiple values are mentioned in a sentence, split them into separate rows or columns as appropriate.
- Include a column called "input_reference" to capture the source line or context for each row.(Do not add commas in the input_reference column because it will break the CSV format)
- If no relevant data is found, return an empty CSV with just the headers.
- **DO NOT** include explanations, markdown, or code blocks.
- Output only raw CSV content.
- Do not put commas in the input_reference column because it will break the CSV format instead of that use ; or any other special character.

Text:
\"\"\"{text}\"\"\"
"""
    response = model.generate_content(prompt)
    print("Response:", response.text.strip())
    return response.text.strip()


def detect_high_level_categories(text):
    prompt = f'''
You are an expert data scientist helping organize raw text into structured datasets.
Your task is to extract **meaningful and high-level categories** from the following text. Return **only the most relevant category labels** that represent the overall themes or domains in the content.

Return the result in **Python list format**, like:
["economy", "politics", "education"]

Examples:

---
Text: "The stock market crashed after the central bank raised interest rates, leading to concerns about a recession."
Output: ["economy", "finance", "government"]

---
Text: "Doctors warn about a new variant of the virus spreading rapidly in urban areas."
Output: ["health", "disease", "urban"]

---
Text: "The Prime Minister addressed the nation about climate change initiatives and new energy policies."
Output: ["politics", "environment", "energy"]

---
Text: "A local school is introducing AI-powered learning systems to personalize student education."
Output: ["education", "technology", "AI"]

---
Text: "The cricket team made a stunning comeback in the final over of the match."
Output: ["sports", "cricket", "entertainment"]

Now extract categories from the following text:

{text}

Return your answer in Python list format.
If there are no relevant categories, return an empty list: [].
Do not include any extra words or explanations. As this prompt is for a model, it should not contain any instructions or explanations.
'''
    response = model.generate_content(prompt)
    try:
        categories = eval(response.text.strip())
        if isinstance(categories, list):
            return [c.strip().lower().replace(" ", "_") for c in categories]
    except Exception:
        pass
    return []
