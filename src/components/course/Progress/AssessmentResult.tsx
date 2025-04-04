import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Question } from '../../../types/IAssessment';

interface AssessmentProps {
  questions: Question[];
  onComplete: (score: number, answers: { questionId: string; selectedAnswer: string; isCorrect: boolean }[]) => void;
}

export function AssessmentResultV1({ questions, onComplete }: AssessmentProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    const results = questions.map(question => {
      const selectedAnswer = answers[question.id] || '';
      let isCorrect = false;

      switch (question.type) {
        case 'multiple_choice':
          isCorrect = question.choices?.some(choice => 
            choice.text === selectedAnswer && choice.isCorrect
          ) || false;
          break;
        case 'true_false':
        case 'short_answer':
        case 'essay':
          isCorrect = selectedAnswer === question.correctAnswer;
          break;
      }

      return {
        questionId: question.id,
        selectedAnswer,
        isCorrect
      };
    });

    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
    const earnedPoints = results.reduce((sum, r) => 
      sum + (r.isCorrect ? questions.find(q => q.id === r.questionId)?.points || 0 : 0), 
      0
    );
    const newScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    
    setScore(newScore);
    setSubmitted(true);
    onComplete(newScore, results);
  };

  const renderQuestionOptions = (question: Question) => {
    switch (question.type) {
      case 'multiple_choice': {
        return question.choices?.map(choice => (
          <label
            key={choice.id}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
              ${submitted 
                ? answers[question.id] === choice.text
                  ? choice.isCorrect
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                  : choice.isCorrect
                    ? 'bg-green-50 border-green-500'
                    : 'border-gray-200'
                : answers[question.id] === choice.text
                  ? 'bg-blue-50 border-blue-500'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
          >
            <input
              type="radio"
              name={question.id}
              value={choice.text} // Use text instead of id
              checked={answers[question.id] === choice.text}
              onChange={() => !submitted && setAnswers({ ...answers, [question.id]: choice.text })}
              disabled={submitted}
              className="mr-3"
            />
            <span className="flex-1">{choice.text}</span>
            {submitted && (
              <div className="ml-auto">
                {choice.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : answers[question.id] === choice.text ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            )}
          </label>
        ));
      }

      case 'true_false': {
        const tfOptions = [
          { id: 'true', text: 'True' },
          { id: 'false', text: 'False' }
        ];
        return tfOptions.map(option => (
          <label
            key={option.id}
            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
              ${submitted 
                ? answers[question.id] === option.text
                  ? option.text.toLowerCase() === question.correctAnswer
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                  : option.text.toLowerCase() === question.correctAnswer
                    ? 'bg-green-50 border-green-500'
                    : 'border-gray-200'
                : answers[question.id] === option.text
                  ? 'bg-blue-50 border-blue-500'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option.text} // Use text instead of id
              checked={answers[question.id] === option.text}
              onChange={() => !submitted && setAnswers({ ...answers, [question.id]: option.text })}
              disabled={submitted}
              className="mr-3"
            />
            <span className="flex-1">{option.text}</span>
            {submitted && (
              <div className="ml-auto">
                {option.text.toLowerCase() === question.correctAnswer ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : answers[question.id] === option.text ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            )}
          </label>
        ));
      }

      case 'short_answer':
      case 'essay':
        return (
          <textarea
            className={`w-full p-4 rounded-lg border-2
              ${submitted 
                ? answers[question.id] === question.correctAnswer
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
                : 'border-gray-200 hover:bg-gray-50'
              }`}
            value={answers[question.id] || ''}
            onChange={(e) => !submitted && setAnswers({ ...answers, [question.id]: e.target.value })}
            disabled={submitted}
            rows={question.type === 'essay' ? 6 : 2}
            placeholder={`Enter your ${question.type === 'short_answer' ? 'short answer' : 'essay'} here...`}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Assessment</h2>
        <p className="text-gray-600 mt-2">
          Complete all questions to proceed. You need 70% to pass.
        </p>
      </div>
      
      {questions.map((question, index) => (
        <div key={question.id} className="space-y-4">
          <p className="font-medium text-lg">
            {index + 1}. {question.text} ({question.points} point{question.points !== 1 ? 's' : ''})
          </p>
          <div className="space-y-2">
            {renderQuestionOptions(question)}
          </div>
          {submitted && (question.type === 'short_answer' || question.type === 'essay') && (
            <div className="mt-2 text-sm">
              <p>Correct Answer: {question.correctAnswer}</p>
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== questions.length}
          className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg font-medium
            hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Submit Assessment
        </button>
      )}

      {submitted && (
        <div className={`p-6 rounded-lg ${score >= 70 ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-3 mb-4">
            {score >= 70 ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500" />
            )}
            <h3 className="text-xl font-semibold">
              Your Score: {score.toFixed(1)}%
            </h3>
          </div>
          <p className="text-gray-700">
            {score >= 70 
              ? 'Congratulations! You passed the assessment. Moving to the next lesson...' 
              : 'Please review the material and try again to proceed to the next lesson.'}
          </p>
        </div>
      )}
    </div>
  );
}