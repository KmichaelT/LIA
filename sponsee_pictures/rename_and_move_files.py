#!/usr/bin/env python3
import os
import shutil
from pathlib import Path

def rename_and_move_files():
    """
    Rename files in each subfolder to folder_name_number format,
    move them to the parent directory, and delete empty folders.
    """
    # Get current directory (sponsee_pictures)
    parent_dir = Path.cwd()
    
    # Get all subdirectories
    subdirs = [d for d in parent_dir.iterdir() if d.is_dir()]
    
    print(f"Found {len(subdirs)} subdirectories to process")
    
    for subdir in subdirs:
        folder_name = subdir.name
        files = [f for f in subdir.iterdir() if f.is_file()]
        
        print(f"\nProcessing folder: {folder_name}")
        print(f"Found {len(files)} files")
        
        # Rename and move each file
        for i, file_path in enumerate(files, 1):
            # Get file extension
            file_ext = file_path.suffix
            
            # Create new filename: folder_name_number.extension
            new_filename = f"{folder_name}_{i}{file_ext}"
            new_file_path = parent_dir / new_filename
            
            # Move and rename the file
            shutil.move(str(file_path), str(new_file_path))
            print(f"  Moved: {file_path.name} -> {new_filename}")
        
        # Delete the empty folder
        try:
            subdir.rmdir()
            print(f"  Deleted empty folder: {folder_name}")
        except OSError as e:
            print(f"  Error deleting folder {folder_name}: {e}")
    
    print("\nAll files have been processed successfully!")

if __name__ == "__main__":
    rename_and_move_files()