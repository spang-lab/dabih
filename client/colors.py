#!/usr/bin/env python3
import os
import re

def find_colors(file_path):
    # Read the contents of the file
    with open(file_path, 'r') as file:
        lines = file.readlines()

    color_regex = r"(bg|text|border|ring)-(\w+)(-light|-mid|-dark)?"
    colors = []
    for line in lines:
        result = re.search(color_regex, line)
        if(result is not None):
            color = f"{result[2]}-{result[3]}"
            colors.append(color)
    return colors

def replace_colors(file_path, replacements):
    with open(file_path, 'r') as file:
        content = file.read()
    for old_color in replacements:
        new_color = replacements[old_color]
        content = re.sub(old_color, new_color , content)
    with open(file_path, 'w') as file:
         file.write(content)




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
        'blue-100': 'blue',
        'blue-200': 'blue',
        'blue-300': 'blue',
        'blue-400': 'blue',
        'blue-500': 'blue',
}

for file in files:
    replace_colors(file, replacements)





