import sys
import json
from jinja2 import Environment, FileSystemLoader
import os

if len(sys.argv) != 4:
    print("❌ Usage: python generate_k6_script.py <input_json_path> <template_dir> <output_file_path>")
    sys.exit(1)

input_file = sys.argv[1]
template_dir = sys.argv[2]
output_file = sys.argv[3]

with open(input_file, 'r', encoding='utf-8') as f:
    config = json.load(f)

env = Environment(
    loader=FileSystemLoader(template_dir),
    trim_blocks=True,
    lstrip_blocks=True
)

template = env.get_template('template.j2')

rendered = template.render(tests=config.get("test_cases", []), stages=config.get("stages", []))

# Create output directory if needed
os.makedirs(os.path.dirname(output_file), exist_ok=True)

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(rendered)

print(f"✅ Test script generated successfully to {output_file}")
