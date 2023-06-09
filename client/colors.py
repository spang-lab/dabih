#!/usr/bin/env python3
import os
import re

def find_colors(file_path):
    # Read the contents of the file
    with open(file_path, 'r') as file:
        lines = file.readlines()

    color_regex = r"(bg|text|border|ring)-(\w+)-(\d+)"
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
    'sky-100':'gray-light',
    'sky-400':'main-mid',
    'gray-800':'gray-dark',
    'rose-700':'danger',
    'indigo-500':'main-mid',
    'gray-700':'gray-mid',
    'gray-500':'gray-mid',
    'sky-700':'main-mid',
    'gray-200':'gray-light',
    'gray-100':'gray-light',
    'emerald-700':'main-mid',
    'sky-900':'main-dark',
    'emerald-500':'main-mid',
    'yellow-800':'main-mid',
    'emerald-600':'main-mid',
    'sky-50':'gray-light',
    'orange-600':'main-mid',
    'rose-800':'danger',
    'gray-900':'gray-dark',
    'gray-600':'gray-mid',
    'slate-600':'gray-mid',
    'sky-600':'main-mid',
    'gray-300':'gray-mid',
    'red-800':'danger',
    'sky-500':'main-mid',
    'gray-400':'gray-mid',
    'sky-800':'main-mid',
    'green-800':'success',
}

existing = set()
for file in files:
    existing.update(find_colors(file))
for color in existing:
    print(f"'{color}':'',")


for file in files:
    replace_colors(file, replacements)



