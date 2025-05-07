from text_utils import sanitize_filename, save_to_csv
from gemini_prompts import detect_high_level_categories, extract_category_data
import os
from input_extracter import extract_text

def process_file(file_path):
    extracted_text = extract_text(file_path)

    categories = detect_high_level_categories(extracted_text)
    print(f"Detected categories: {categories}")

    output_files = []

    # Use relative path for dataset folder
    dataset_folder = os.path.join(os.path.dirname(__file__), "datasets")

    for category in categories:
        category_name = category
        dataset_path = os.path.join(dataset_folder, sanitize_filename(category_name) + ".csv")

        headers = []
        if os.path.exists(dataset_path):
            with open(dataset_path, 'r') as f:
                headers = f.readline().strip().split(',')
                print(f"Headers in {dataset_path}: {headers}")

        csv_data = extract_category_data(extracted_text, category_name, headers)
        print(f"Extracted data for {category_name}: {csv_data}")

        if csv_data.strip():
            output_path = save_to_csv(csv_data, category_name)
            output_files.append(output_path)

    return output_files
