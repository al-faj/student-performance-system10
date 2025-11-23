from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
import pandas as pd
from datetime import datetime
import os

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

student_records = []

class PerformancePredictor:
    def __init__(self):
        self.weights = {
            'attendance': 0.25,
            'exams': 0.30,
            'assignments': 0.15,
            'quizzes': 0.10,
            'lab_work': 0.15,
            'extracurricular': 0.05
        }
    
    def calculate_performance_score(self, data):
        attendance = float(data.get('attendance', 0))
        mid_sem1 = float(data.get('midSem1', 0))
        mid_sem2 = float(data.get('midSem2', 0))
        assignments = float(data.get('assignments', 0))
        quizzes = float(data.get('quizzes', 0))
        lab_work = float(data.get('labWork', 0))
        extracurricular = float(data.get('extracurricular', 0))
        
        exam_avg = (mid_sem1 + mid_sem2) / 2
        
        performance_score = (
            attendance * self.weights['attendance'] +
            exam_avg * self.weights['exams'] +
            assignments * self.weights['assignments'] +
            quizzes * self.weights['quizzes'] +
            lab_work * self.weights['lab_work'] +
            extracurricular * self.weights['extracurricular']
        )
        
        return round(performance_score, 2)
    
    def assess_risk(self, score, data):
        attendance = float(data.get('attendance', 0))
        mid_sem1 = float(data.get('midSem1', 0))
        mid_sem2 = float(data.get('midSem2', 0))
        assignments = float(data.get('assignments', 0))
        lab_work = float(data.get('labWork', 0))
        
        if score >= 75:
            risk_level = 'Low Risk'
            status = 'Excellent Performance'
            color = 'green'
            recommendations = [
                'Continue maintaining good attendance',
                'Keep up the excellent work',
                'Consider mentoring struggling students',
                'Participate in advanced projects'
            ]
        elif score >= 60:
            risk_level = 'Moderate Risk'
            status = 'Needs Improvement'
            color = 'yellow'
            recommendations = [
                'Improve attendance to above 85%',
                'Focus on assignment submissions',
                'Attend extra classes for weak subjects',
                'Form study groups with peers',
                'Review exam preparation strategies'
            ]
        elif score >= 45:
            risk_level = 'High Risk'
            status = 'At Risk of Failing'
            color = 'orange'
            recommendations = [
                'Immediate intervention required',
                'Meet with academic advisor within 48 hours',
                'Attend all classes and tutorials',
                'Submit all pending assignments',
                'Consider peer tutoring programs',
                'Create a structured study schedule'
            ]
        else:
            risk_level = 'Critical Risk'
            status = 'Severe Risk of Failure'
            color = 'red'
            recommendations = [
                'URGENT: Schedule meeting with HOD immediately',
                'Enroll in remedial classes',
                'Complete all pending work immediately',
                'Consider academic counseling',
                'Parents/Guardian meeting recommended',
                'May need to consider course withdrawal options'
            ]
        
        insights = []
        if attendance < 75:
            insights.append('⚠️ Low attendance detected - Major concern')
        if (mid_sem1 + mid_sem2) / 2 < 50:
            insights.append('⚠️ Poor exam performance - Needs immediate attention')
        if assignments < 70:
            insights.append('⚠️ Assignment completion needs improvement')
        if lab_work < 70:
            insights.append('⚠️ Lab work performance is below average')
        
        exam_avg = (mid_sem1 + mid_sem2) / 2
        breakdown = {
            'attendance': round(attendance * self.weights['attendance'], 2),
            'exams': round(exam_avg * self.weights['exams'], 2),
            'assignments': round(assignments * self.weights['assignments'], 2),
            'quizzes': round(float(data.get('quizzes', 0)) * self.weights['quizzes'], 2),
            'labWork': round(lab_work * self.weights['lab_work'], 2),
            'extracurricular': round(float(data.get('extracurricular', 0)) * self.weights['extracurricular'], 2)
        }
        
        return {
            'score': score,
            'riskLevel': risk_level,
            'status': status,
            'color': color,
            'recommendations': recommendations,
            'insights': insights,
            'breakdown': breakdown
        }
    
    def predict(self, data):
        score = self.calculate_performance_score(data)
        assessment = self.assess_risk(score, data)
        return assessment

predictor = PerformancePredictor()

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'HIT Student Performance Prediction System is running',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        required_fields = ['studentName', 'rollNumber', 'attendance', 'midSem1', 
                          'midSem2', 'assignments', 'quizzes', 'labWork', 'extracurricular']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        result = predictor.predict(data)
        
        record = {
            'timestamp': datetime.now().isoformat(),
            'student_name': data['studentName'],
            'roll_number': data['rollNumber'],
            'prediction': result
        }
        student_records.append(record)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/students', methods=['GET'])
def get_students():
    return jsonify({
        'total': len(student_records),
        'records': student_records
    })

@app.route('/api/student/<roll_number>', methods=['GET'])
def get_student(roll_number):
    student = next((r for r in student_records if r['roll_number'] == roll_number), None)
    if student:
        return jsonify(student)
    return jsonify({'error': 'Student not found'}), 404

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    if not student_records:
        return jsonify({
            'total_predictions': 0,
            'risk_distribution': {},
            'average_score': 0
        })
    
    risk_counts = {'Low Risk': 0, 'Moderate Risk': 0, 'High Risk': 0, 'Critical Risk': 0}
    total_score = 0
    
    for record in student_records:
        risk_level = record['prediction']['riskLevel']
        risk_counts[risk_level] = risk_counts.get(risk_level, 0) + 1
        total_score += record['prediction']['score']
    
    return jsonify({
        'total_predictions': len(student_records),
        'risk_distribution': risk_counts,
        'average_score': round(total_score / len(student_records), 2)
    })

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
