from flask import Blueprint, render_template, request, jsonify
from app import db
from app.models import ServiceRequest
import time

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/api/payment', methods=['POST'])
def payment():
    data = request.get_json()
    
    if not data or not data.get('service') or not data.get('fullName') or not data.get('email'):
        return jsonify({'error': 'Missing required fields (Service, Name, Email)'}), 400
        
    reference = f'NV-{int(time.time() * 1000)}'
    
    try:
        new_request = ServiceRequest(
            full_name=data.get('fullName'),
            phone=data.get('phone', ''),
            email=data.get('email'),
            service_id=data.get('service'),
            reference=reference
        )
        db.session.add(new_request)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Database error: {str(e)}'}), 500
        
    return jsonify({
        'success': True,
        'message': 'Service request logged and payment intent created.',
        'paymentUrl': 'https://secure.paynow.co.zw/mock/checkout/' + reference,
        'reference': reference
    }), 200

@main_bp.route('/admin-leads-1234')
def admin():
    # In production, add @login_required
    leads = ServiceRequest.query.order_by(ServiceRequest.created_at.desc()).all()
    return render_template('admin.html', leads=leads)
