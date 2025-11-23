import React, { useState } from 'react';
import { AlertCircle, TrendingUp, Users, BookOpen, Award, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    attendance: '',
    midSem1: '',
    midSem2: '',
    assignments: '',
    quizzes: '',
    labWork: '',
    extracurricular: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError('Failed to get prediction. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      studentName: '',
      rollNumber: '',
      attendance: '',
      midSem1: '',
      midSem2: '',
      assignments: '',
      quizzes: '',
      labWork: '',
      extracurricular: ''
    });
    setPrediction(null);
    setError('');
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'Low Risk':
        return <CheckCircle className="w-8 h-8" />;
      case 'Moderate Risk':
        return <AlertCircle className="w-8 h-8" />;
      case 'High Risk':
        return <AlertTriangle className="w-8 h-8" />;
      case 'Critical Risk':
        return <XCircle className="w-8 h-8" />;
      default:
        return <AlertCircle className="w-8 h-8" />;
    }
  };

  const getRiskColor = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      orange: 'bg-orange-100 text-orange-800 border-orange-300',
      red: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[color] || colors.yellow;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-lg shadow-md">
                <BookOpen className="w-8 h-8 text-green-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Student Performance Prediction System</h1>
                <p className="text-green-100 text-sm">Haldia Institute of Technology</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">AI-Powered Analytics</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Student Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Student Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="e.g., 21/CSE/001"
                  />
                </div>
              </div>

              {/* Academic Metrics */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attendance (%)
                    </label>
                    <input
                      type="number"
                      name="attendance"
                      value={formData.attendance}
                      onChange={handleChange}
                      required
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mid-Sem 1 (%)
                    </label>
                    <input
                      type="number"
                      name="midSem1"
                      value={formData.midSem1}
                      onChange={handleChange}
                      required
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mid-Sem 2 (%)
                    </label>
                    <input
                      type="number"
                      name="midSem2"
                      value={formData.midSem2}
                      onChange={handleChange}
                      required
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignments (%)
                    </label>
                    <input
                      type="number"
                      name="assignments"
                      value={formData.assignments}
                      onChange={handleChange}
                      required
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quizzes (%)
                    </label>
                    <input
                      type="number"
                      name="quizzes"
                      value={formData.quizzes}
                      onChange={handleChange}
                      required
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lab Work (%)
                    </label>
                    <input
                      type="number"
                      name="labWork"
                      value={formData.labWork}
                      onChange={handleChange}
                      required
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extracurricular (%)
                    </label>
                    <input
                      type="number"
                      name="extracurricular"
                      value={formData.extracurricular}
                      onChange={handleChange}
                      required
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0-100"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Analyzing...' : 'Predict Performance'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                >
                  Reset
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {prediction ? (
              <>
                {/* Main Result Card */}
                <div className={`rounded-2xl shadow-xl p-8 border-2 ${getRiskColor(prediction.color)}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      {getRiskIcon(prediction.riskLevel)}
                      <div>
                        <h3 className="text-2xl font-bold">{prediction.riskLevel}</h3>
                        <p className="text-sm opacity-80">{prediction.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{prediction.score}</div>
                      <div className="text-sm opacity-80">Performance Score</div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="bg-white/50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-3">Score Breakdown</h4>
                    <div className="space-y-2">
                      {Object.entries(prediction.breakdown).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insights */}
                  {prediction.insights && prediction.insights.length > 0 && (
                    <div className="bg-white/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Key Insights
                      </h4>
                      <ul className="space-y-1">
                        {prediction.insights.map((insight, index) => (
                          <li key={index} className="text-sm">{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Award className="w-6 h-6 text-blue-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Recommendations</h3>
                  </div>
                  <ul className="space-y-3">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 border border-green-100 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-green-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to Analyze</h3>
                <p className="text-gray-600 mb-6">
                  Enter student information and click "Predict Performance" to get detailed insights and recommendations.
                </p>
                <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-semibold text-green-800 mb-1">Risk Assessment</div>
                    <div className="text-sm text-gray-600">4-tier risk evaluation</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-semibold text-blue-800 mb-1">AI-Powered</div>
                    <div className="text-sm text-gray-600">Machine learning model</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="font-semibold text-purple-800 mb-1">Personalized</div>
                    <div className="text-sm text-gray-600">Custom recommendations</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="font-semibold text-orange-800 mb-1">Actionable</div>
                    <div className="text-sm text-gray-600">Clear next steps</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold">Haldia Institute of Technology</h3>
              <p className="text-gray-400 text-sm">Student Performance Prediction System</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                Empowering students through data-driven insights
              </p>
              <p className="text-gray-500 text-xs mt-2">
                © 2025 HIT. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
