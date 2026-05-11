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

    # 3. Replace the form's JS fetch call with a WhatsApp redirect
    #    We swap the entire form submit handler to build a WhatsApp message
    old_submit_handler = '''checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        submitBtn.innerHTML = 'Processing Securely...';
        
        paymentMessage.classList.add('hidden');
        paymentMessage.className = 'mt-4 p-4 rounded-md text-center font-medium border'; // Reset classes
        
        // Call Real Backend API
        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service: document.getElementById('service-select').value,
                    fullName: document.getElementById('full-name').value,
                    phone: document.getElementById('phone').value,
                    email: document.getElementById('email').value
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                paymentMessage.innerHTML = `✅ Submission received! Redirecting to secure payment gateway in 3 seconds...<br><span class="text-xs text-gray-500 mt-2 block">Ref: ${result.reference}</span>`;
                paymentMessage.classList.add('border-emerald-DEFAULT/30', 'bg-emerald-DEFAULT/10', 'text-emerald-DEFAULT', 'block');
                paymentMessage.classList.remove('hidden');

                // Redirect to payment gateway
                setTimeout(() => { window.location.href = result.paymentUrl; }, 3000);
            } else {
                throw new Error(result.error || 'Server error');
            }
        } catch (error) {
            paymentMessage.textContent = error.message;
            paymentMessage.classList.add('border-red-500/30', 'bg-red-500/10', 'text-red-400', 'block');
            paymentMessage.classList.remove('hidden');
        }
        
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        submitBtn.innerHTML = 'Proceed to Encrypted Payment';
    });'''

    new_submit_handler = f'''checkoutForm.addEventListener('submit', (e) => {{
        e.preventDefault();

        const service  = document.getElementById('service-select').options[document.getElementById('service-select').selectedIndex].text;
        const fullName = document.getElementById('full-name').value.trim();
        const phone    = document.getElementById('phone').value.trim();
        const email    = document.getElementById('email').value.trim();

        if (!fullName || !phone || !email) {{
            paymentMessage.className = 'mt-4 p-4 rounded-md text-center font-medium border';
            paymentMessage.textContent = 'Please fill in all fields.';
            paymentMessage.classList.add('border-red-500/30', 'bg-red-500/10', 'text-red-400', 'block');
            paymentMessage.classList.remove('hidden');
            return;
        }}

        const msg = encodeURIComponent(
            `Hello No Vanity Consultancy,\\n\\nI would like to enquire about: ${{service}}\\n\\nName: ${{fullName}}\\nPhone: ${{phone}}\\nEmail: ${{email}}\\n\\nKindly assist me with the next steps.`
        );

        paymentMessage.className = 'mt-4 p-4 rounded-md text-center font-medium border';
        paymentMessage.innerHTML = '✅ Redirecting to WhatsApp to complete your enquiry...';
        paymentMessage.classList.add('border-emerald-DEFAULT/30', 'bg-emerald-DEFAULT/10', 'text-emerald-DEFAULT', 'block');
        paymentMessage.classList.remove('hidden');

        submitBtn.textContent = 'Redirecting...';

        setTimeout(() => {{
            window.open(`https://wa.me/{WHATSAPP_NUMBER}?text=${{msg}}`, '_blank');
            submitBtn.innerHTML = 'Proceed to Encrypted Payment';
        }}, 1500);
    }});'''

    content = content.replace(old_submit_handler, new_submit_handler)

    # 4. Update submit button label for GH Pages context
    content = content.replace(
        'Proceed to Encrypted Payment',
        'Send Enquiry via WhatsApp'
    )

    # 5. Write out root index.html
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)

    print("OK  Compiled -> index.html (GitHub Pages ready)")
    print(f"    WhatsApp number: {WHATSAPP_NUMBER}")
    print("    Form now redirects to WhatsApp instead of backend API.")

if __name__ == '__main__':
    compile()
