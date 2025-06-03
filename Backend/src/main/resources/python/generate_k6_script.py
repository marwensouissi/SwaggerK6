import sys
import json
import re
from jinja2 import Environment, FileSystemLoader

def regex_replace(s, pattern, replacement):
    return re.sub(pattern, replacement, s)

def main():
    # Read arguments from CLI
    json_input_path = sys.argv[1]
    template_dir = sys.argv[2]
    output_file = sys.argv[3]

    # Load the JSON config
    with open(json_input_path) as f:
        config = json.load(f)

    # Setup Jinja environment and register custom filter
    env = Environment(
        loader=FileSystemLoader(template_dir),
        trim_blocks=True,
        lstrip_blocks=True
    )
    env.filters['regex_replace'] = regex_replace

    # Load template
    template = env.get_template('template.j2')

    # Render template with data
    rendered = template.render(
        tests=config["test_cases"],
        stages=config.get("stages", [])
    )

    # Write output JS file
    with open(output_file, 'w') as f:
        f.write(rendered)


if __name__ == "__main__":
    main()
