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
    'sky-100':'main-100',
    'sky-400':'main-400',
    'gray-800':'main-900',
    'rose-700':'danger',
    'indigo-500':'main-500',
    'gray-700':'muted',
    'gray-500':'muted',
    'sky-700':'main-700',
    'gray-200':'main-200',
    'gray-100':'main-100',
    'emerald-700':'main-700',
    'sky-900':'main-900',
    'emerald-500':'main-500',
    'yellow-800':'main-800',
    'emerald-600':'main-600',
    'sky-50':'main-50',
    'orange-600':'main-600',
    'rose-800':'danger',
    'gray-900':'main-900',
    'gray-600':'muted',
    'slate-600':'muted',
    'sky-600':'main-600',
    'gray-300':'muted',
    'red-800':'danger',
    'sky-500':'main-500',
    'gray-400':'muted',
    'sky-800':'main-800',
    'green-800':'success',
}

existing = set()
for file in files:
    existing.update(find_colors(file))

for color in existing:
    print(f"'{color}':'',")



