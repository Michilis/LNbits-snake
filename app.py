from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import requests
import os

app = Flask(__name__)

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///snake_game.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# LNbits API configuration
LNURL_API = "https://your-lnbits-instance/api/v1/payments"
LNURL_HEADERS = {"X-Api-Key": "your-lnbits-api-key"}

class LeaderboardEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.json
    new_entry = LeaderboardEntry(name=data['name'], score=data['score'])
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({'message': 'Score submitted successfully'})

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    entries = LeaderboardEntry.query.order_by(LeaderboardEntry.score.desc()).all()
    return jsonify([{'name': entry.name, 'score': entry.score} for entry in entries])

@app.route('/generate_invoice', methods=['POST'])
def generate_invoice():
    amount = request.json.get('amount', 100)  # Set a default amount or adjust as needed
    payload = {'amount': amount, 'memo': 'Snake Game Entry'}
    response = requests.post(LNURL_API, headers=LNURL_HEADERS, json=payload)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to generate invoice'}), 500

@app.route('/check_invoice', methods=['POST'])
def check_invoice():
    payment_request = request.json.get('payment_request')
    # Add your logic to check the invoice status using LNbits API
    pass

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
