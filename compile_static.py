"""
compile_static.py
Compiles app/templates/index.html into a root index.html suitable for GitHub Pages.
- Replaces {{ url_for('static', filename='...') }} with relative paths
- Replaces the backend API form submission with a WhatsApp redirect
- Strips Jinja2 template syntax
Run: python compile_static.py
"""
import re
import time

WHATSAPP_NUMBER = "263785029078"  # Update to your real WhatsApp number

def compile():
    with open('app/templates/index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace url_for static calls → relative app/static paths
    content = re.sub(
        r"\{\{\s*url_for\('static',\s*filename='([^']+)'\)\s*\}\}",
        r"app/static/\1",
        content
    )

    # 2. Cache-bust CSS
    ts = int(time.time())
    content = content.replace("app/static/css/styles.css", f"app/static/css/styles.css?v={ts}")

    # WhatsApp checkout and floating buttons are now handled natively in the source codebase.

    # 5. Write out root index.html
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)

    print("OK  Compiled -> index.html (GitHub Pages ready)")
    print(f"    WhatsApp number: {WHATSAPP_NUMBER}")
    print("    Form now redirects to WhatsApp instead of backend API.")

if __name__ == '__main__':
    compile()
