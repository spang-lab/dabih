#!/usr/bin/env python3
import os
import re

def replace_html_tags(file_path, replacements):
    # Read the contents of the file
    with open(file_path, 'r') as file:
        content = file.read()

    # Replace the old HTML tag with the new tag
    
    print(f"Refactoring {file_path}")
    for old_tag in replacements:
        match = re.findall(old_tag, content)
        if(match):
            print(match)


    #replaced_content = re.sub(old_tag, new_tag, content)

    # Write the modified content back to the file
    #with open(file_path, 'w') as file:
    #     file.write(replaced_content)


def getJSFiles(paths):
    results = []
    for path in paths:
        for root, dirs, files in os.walk(path):
            for file in files:
                if file.endswith('.js'):
                    file_path = os.path.join(root, file)
                    results.append(file_path)
    return results;

# Usage example
paths = ['components', 'pages']
files = getJSFiles(paths)

replacements = {
    r'<Gray>': '<span className="text-gray-500">',
    r'</Gray>': '</span>'
}

for file in files:
    replace_html_tags(file, replacements)




