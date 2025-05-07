import pandas as pd
import os
from io import StringIO
import re

def sanitize_filename(name):
    return re.sub(r'[^a-zA-Z0-9_\-]', '_', name.strip().lower())

def save_to_csv(new_csv_str, category_name, dataset_dir="datasets"):
    os.makedirs(dataset_dir, exist_ok=True)
    sanitized_name = sanitize_filename(category_name)
    file_path = os.path.join(dataset_dir, f"{sanitized_name}.csv")
    
    try:
        new_df = pd.read_csv(StringIO(new_csv_str))
    except Exception as error:
        print(f"Error reading CSV string: {error}")
        print(new_csv_str)
        return None  # Return None if CSV couldn't be parsed

    if os.path.exists(file_path):
        try:
            existing_df = pd.read_csv(file_path)

            # Merge headers and reindex
            all_columns = sorted(set(existing_df.columns).union(new_df.columns))
            existing_df = existing_df.reindex(columns=all_columns)
            new_df = new_df.reindex(columns=all_columns)

            # Combine and save
            combined = pd.concat([existing_df, new_df], ignore_index=True)
            combined.to_csv(file_path, index=False)
            print(f"Updated (headers merged): {file_path}")

        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    else:
        new_df.to_csv(file_path, index=False)
        print(f"Created new file: {file_path}")
    
    return file_path
