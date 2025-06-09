import sys
import json
import re
from jinja2 import Environment, FileSystemLoader

def regex_replace(s, pattern, replacement):
    return re.sub(pattern, replacement, s)

def extract_base_url(swagger_data):
    # OpenAPI 3.x format
    if "openapi" in swagger_data and "servers" in swagger_data:
        return swagger_data["servers"][0]["url"].rstrip("/")

    # Swagger 2.0 format
    elif "swagger" in swagger_data:
        scheme = swagger_data.get("schemes", ["http"])[0]
        host = swagger_data["host"]
        base_path = swagger_data.get("basePath", "")
        return f"{scheme}://{host}{base_path}".rstrip("/")

    return ""

def main():
    # CLI args: JSON config, Jinja template directory, output file path
    json_input_path = sys.argv[1]
    template_dir = sys.argv[2]
    output_file = sys.argv[3]

    # Load the test configuration
    with open(json_input_path, encoding="utf-8") as f:
        config = json.load(f)

    # Load Swagger/OpenAPI JSON with UTF-8 encoding
    with open("swagger.json", encoding="utf-8") as f:
        swagger_data = json.load(f)
        base_url = extract_base_url(swagger_data)

    # Jinja environment setup
    env = Environment(
        loader=FileSystemLoader(template_dir),
        trim_blocks=True,
        lstrip_blocks=True
    )
    env.filters['regex_replace'] = regex_replace

    # Load and render template
    template = env.get_template('template.j2')
    rendered = template.render(
        tests=config["test_cases"],
        stages=config.get("stages", []),
        base_url=base_url
    )

    # Write the output file
    with open(output_file, 'w', encoding="utf-8") as f:
        f.write(rendered)

if __name__ == "__main__":
    main()
