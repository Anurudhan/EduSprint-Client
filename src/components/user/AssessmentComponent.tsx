import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Assessment, QuestionType } from '../../types/IAssessment';


interface AssessmentProps {
  assessment: Assessment;
  onComplete: (passed: boolean) => void;
}

export const AssessmentComponent: React.FC<AssessmentProps> = ({
  assessment,
  onComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    assessment?.questions.forEach(question => {
      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        const userAnswer = answers[question.id];
        const correctAnswer = question.choices?.find(c => c.isCorrect)?.id;
        if (userAnswer === correctAnswer) {
          correct += question.points;
        }
      }
    });
    return (correct / assessment.questions.reduce((acc, q) => acc + q.points, 0)) * 100;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
    onComplete(finalScore >= assessment.passingScore);
  };

  const currentQ = assessment.questions[currentQuestion];

  if (showResults) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center">
          {score >= assessment.passingScore ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-600 mb-2">Congratulations!</h3>
              <p className="text-gray-600">You passed with a score of {score.toFixed(1)}%</p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-600 mb-2">Try Again</h3>
              <p className="text-gray-600">You scored {score.toFixed(1)}%. Required: {assessment.passingScore}%</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{assessment.title}</h3>
        <p className="text-gray-600">{assessment.description}</p>
        <div className="mt-2 text-sm text-gray-500">
          Question {currentQuestion + 1} of {assessment.questions.length}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-4">{currentQ.text}</h4>
        {currentQ.type === QuestionType.MULTIPLE_CHOICE && currentQ.choices && (
          <div className="space-y-3">
            {currentQ.choices.map((choice) => (
              <label
                key={choice.id}
                className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name={currentQ.id}
                  value={choice.id}
                  checked={answers[currentQ.id] === choice.id}
                  onChange={() => handleAnswer(currentQ.id, choice.id)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-3">{choice.text}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestion === assessment.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};