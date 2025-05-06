from text_utils import sanitize_filename, save_to_csv
from gemini_prompts import detect_high_level_categories, extract_category_data
import os
from input_extracter import extract_text


# Sample text (replace with your extracted_text)
file_path = r"C:\Users\Shriyam\Desktop\major project\codee\sample_text_file.txt"
extracted_text = extract_text(file_path)

# Step 1: Detect Categories
categories = detect_high_level_categories(extracted_text)
for c in categories:
    print(f" - {c}")

# Step 2: Extract and Save Data
for category in categories:
    category_name = category
    # find in my dataset folder if same category presents
    dataset_folder = r"C:\Users\Shriyam\Desktop\major project\code\datasets"
    dataset_path = os.path.join(dataset_folder, sanitize_filename(category_name) + ".csv")
    headers=[]
    if os.path.exists(dataset_path):
        with open(dataset_path, 'r') as f:
            headers = f.readline().strip().split(',')
            print(f"Headers in {dataset_path}: {headers}")
    csv_data = extract_category_data(extracted_text, category_name, headers)
    # print(f"Extracted data for category '{category_name}':")
    # print(csv_data)
    if csv_data.strip():
        save_to_csv(csv_data, category_name)
