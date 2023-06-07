#!/usr/bin/env python3
import os
import re

def replace_html_tags(file_path, replacements, replace = False):
    # Read the contents of the file
    with open(file_path, 'r') as file:
        content = file.read()

    # Replace the old HTML tag with the new tag
    
    hasChanged = False
    for old_tag in replacements:
        match = re.findall(old_tag, content)
        if(not match):
            continue
        hasChanged = True
        print(f"Replacing tag {old_tag} in {file_path}")
        new_tag = replacements[old_tag]
        content = re.sub(old_tag, new_tag, content)

    # Write the modified content back to the file
    if(not hasChanged):
        return
    print(content)
    if(not replace):
        return
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
    r'<Gray>': '<span className="text-gray-500">',
    r'</Gray>': '</span>',
    r'<Title1>': '<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">',
    r'</Title1>': '</h1>',
    r'<Title2>': '<h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">',
    r'<Title2 className=.*>': '<h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">',
    r'</Title2>': '</h2>',
    r'<Title3>': '<h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">',
    r'<Title3 className=.*>': '<h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">',
    r'</Title3>': '</h3>',
    r'<Color>': '<span className="text-sky-700">{\' \'}',
    r'</Color>': '{\' \'}</span>',
    r'<Danger>': '<span className="font-extrabold underline text-rose-800">{\' \'}',
    r'</Danger>': '{\' \'}</span>',
    r'<Highlight>': '<span className="font-semibold text-sky-700">{\' \'}',
    r'</Highlight>': '{\' \'}</span>',
    r'<Subtitle1>': '<div className="text-base text-gray-500 sm:text-lg md:text-xl">',
    r'</Subtitle1>': '</div>',
    r'<Code>': '<span className="font-semibold text-gray-500">{\' \'}',
    r'</Code>': '{\' \'}</span>',
}

for file in files:
    replace_html_tags(file, replacements, replace=True)




