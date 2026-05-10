from flask import Blueprint, render_template, request, jsonify

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/api/payment', methods=['POST'])
def payment():
    data = request.get_json()
    
    if not data or not data.get('service') or not data.get('amount'):
        return jsonify({'error': 'Missing required fields'}), 400
        
    # Simulate payment processing delay and logic
    # In production, integrate with Paynow or Stripe here
    import time
    time.sleep(1.5)
    
    return jsonify({
        'success': True,
        'message': 'Payment intent created successfully.',
        'paymentUrl': 'https://secure.paynow.co.zw/mock/checkout/12345',
        'reference': f'NV-{int(time.time() * 1000)}'
    }), 200
