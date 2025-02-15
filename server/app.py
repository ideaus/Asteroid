from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///leaderboard.db'
db = SQLAlchemy(app)

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(80), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    
@app.route('/api/scores', methods=['POST'])
def add_score():
    data = request.json
    new_score = Score(player_name=data['name'], score=data['score'])
    db.session.add(new_score)
    db.session.commit()
    return jsonify({'message': 'Score added successfully'})

@app.route('/api/scores', methods=['GET'])
def get_scores():
    scores = Score.query.order_by(Score.score.desc()).limit(10).all()
    return jsonify([{'name': s.player_name, 'score': s.score} for s in scores])

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)