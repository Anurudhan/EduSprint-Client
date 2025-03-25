// import React, { useState } from 'react';
// import { CheckCircle, XCircle } from 'lucide-react';
// import { Assessment, QuestionType } from '../../types/IAssessment';

// interface AssessmentProps {
//   assessment: Assessment;
//   onComplete: (passed: boolean, score: number, answers: Record<string, string>) => void;
// }

// export const AssessmentComponent: React.FC<AssessmentProps> = ({
//   assessment,
//   onComplete,
// }) => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [showResults, setShowResults] = useState(false);
//   const [score, setScore] = useState(0);
//   const [questionResults, setQuestionResults] = useState<Record<string, boolean>>({});

//   const handleAnswer = (questionId: string, answer: string) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: answer
//     }));
//   };

//   const calculateScore = () => {
//     let correct = 0;
//     const results: Record<string, boolean> = {};
    
//     assessment?.questions.forEach(question => {
//       if (question.type === QuestionType.MULTIPLE_CHOICE) {
//         const userAnswer = answers[question.id];
//         const correctAnswer = question.choices?.find(c => c.isCorrect)?.id;
//         const isCorrect = userAnswer === correctAnswer;
        
//         results[question.id] = isCorrect;
        
//         if (isCorrect) {
//           correct += question.points;
//         }
//       }
//     });
    
//     setQuestionResults(results);
    
//     const totalPoints = assessment.questions.reduce((acc, q) => acc + q.points, 0);
//     return (correct / totalPoints) * 100;
//   };

//   const handleSubmit = () => {
//     const finalScore = calculateScore();
//     setScore(finalScore);
//     setShowResults(true);
    
//     // Pass answers back to parent component for storage
//     const passed = finalScore >= assessment.passingScore;
//     onComplete(passed, finalScore, answers);
//   };

//   const allQuestionsAnswered = assessment.questions.every(q => answers[q.id]);
//   const currentQ = assessment.questions[currentQuestion];

//   if (showResults) {
//     return (
//       <div className="bg-white rounded-lg p-6 shadow-sm">
//         <div className="text-center mb-8">
//           {score >= assessment.passingScore ? (
//             <>
//               <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//               <h3 className="text-2xl font-bold text-green-600 mb-2">Congratulations!</h3>
//               <p className="text-gray-600">You passed with a score of {score.toFixed(1)}%</p>
//             </>
//           ) : (
//             <>
//               <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//               <h3 className="text-2xl font-bold text-red-600 mb-2">Try Again</h3>
//               <p className="text-gray-600">You scored {score.toFixed(1)}%. Required: {assessment.passingScore}%</p>
//             </>
//           )}
//         </div>
        
//         <div className="border-t pt-6">
//           <h4 className="font-medium text-lg mb-4">Question Review</h4>
//           {assessment.questions.map((question) => (
//             <div key={question.id} className="mb-4 p-4 border rounded-lg">
//               <div className="flex items-start">
//                 <div className="mr-3 mt-1">
//                   {questionResults[question.id] ? (
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                   ) : (
//                     <XCircle className="w-5 h-5 text-red-500" />
//                   )}
//                 </div>
//                 <div>
//                   <h5 className="font-medium mb-2">{question.text}</h5>
//                   {question.type === QuestionType.MULTIPLE_CHOICE && question.choices && (
//                     <div className="ml-2">
//                       {question.choices.map(choice => {
//                         const isUserChoice = answers[question.id] === choice.id;
//                         const isCorrect = choice.isCorrect;
//                         let className = "text-sm py-1";
                        
//                         if (isUserChoice && isCorrect) {
//                           className += " text-green-600 font-medium";
//                         } else if (isUserChoice && !isCorrect) {
//                           className += " text-red-600 font-medium";
//                         } else if (isCorrect) {
//                           className += " text-green-600";
//                         }
                        
//                         return (
//                           <div key={choice.id} className={className}>
//                             {isUserChoice ? '✓ ' : isCorrect ? '• ' : '  '}
//                             {choice.text}
//                             {isCorrect && !isUserChoice && ' (Correct answer)'}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg p-6 shadow-sm">
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold mb-2">{assessment.title}</h3>
//         <p className="text-gray-600">{assessment.description}</p>
//         <div className="mt-4 flex items-center justify-between">
//           <div className="text-sm text-gray-500">
//             Question {currentQuestion + 1} of {assessment.questions.length}
//           </div>
//           <div className="text-sm text-gray-500">
//             {Object.keys(answers).length} of {assessment.questions.length} answered
//           </div>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
//           <div 
//             className="bg-blue-600 h-2 rounded-full" 
//             style={{ width: `${(Object.keys(answers).length / assessment.questions.length) * 100}%` }}
//           ></div>
//         </div>
//       </div>

//       <div className="mb-6">
//         <h4 className="text-lg font-medium mb-4">{currentQ.text}</h4>
//         {currentQ.type === QuestionType.MULTIPLE_CHOICE && currentQ.choices && (
//           <div className="space-y-3">
//             {currentQ.choices.map((choice) => (
//               <label
//                 key={choice.id}
//                 className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
//                   answers[currentQ.id] === choice.id ? 'bg-blue-50 border-blue-300' : ''
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name={currentQ.id}
//                   value={choice.id}
//                   checked={answers[currentQ.id] === choice.id}
//                   onChange={() => handleAnswer(currentQ.id, choice.id)}
//                   className="w-4 h-4 text-blue-600"
//                 />
//                 <span className="ml-3">{choice.text}</span>
//               </label>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="flex justify-between">
//         <button
//           onClick={() => setCurrentQuestion(prev => prev - 1)}
//           disabled={currentQuestion === 0}
//           className="px-4 py-2 text-gray-600 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         {currentQuestion === assessment.questions.length - 1 ? (
//           <button
//             onClick={handleSubmit}
//             disabled={!allQuestionsAnswered}
//             className={`px-4 py-2 text-white rounded-lg ${
//               allQuestionsAnswered ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
//             }`}
//           >
//             Submit
//           </button>
//         ) : (
//           <button
//             onClick={() => setCurrentQuestion(prev => prev + 1)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Next
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Assessment, QuestionType } from '../../types/IAssessment';

interface AssessmentProps {
  assessment: Assessment;
  onComplete: (passed: boolean, score: number, answers: Record<string, string>) => void;
}

export const AssessmentComponent: React.FC<AssessmentProps> = ({
  assessment,
  onComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [questionResults, setQuestionResults] = useState<Record<string, boolean>>({});

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    const results: Record<string, boolean> = {};
    
    assessment?.questions.forEach(question => {
      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        const userAnswer = answers[question.id];
        const correctAnswer = question.choices?.find(c => c.isCorrect)?.id;
        const isCorrect = userAnswer === correctAnswer;
        
        results[question.id] = isCorrect;
        
        if (isCorrect) {
          correct += question.points;
        }
      }
    });
    
    setQuestionResults(results);
    
    const totalPoints = assessment.questions.reduce((acc, q) => acc + q.points, 0);
    return (correct / totalPoints) * 100;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
    
    // Pass answers back to parent component for storage
    const passed = finalScore >= assessment.passingScore;
    onComplete(passed, finalScore, answers);
  };

  const allQuestionsAnswered = assessment.questions.every(q => answers[q.id]);
  const currentQ = assessment.questions[currentQuestion];

  if (showResults) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center mb-8">
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
        
        <div className="border-t pt-6">
          <h4 className="font-medium text-lg mb-4">Question Review</h4>
          {assessment.questions.map((question) => (
            <div key={question.id} className="mb-4 p-4 border rounded-lg">
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {questionResults[question.id] ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <h5 className="font-medium mb-2">{question.text}</h5>
                  {question.type === QuestionType.MULTIPLE_CHOICE && question.choices && (
                    <div className="ml-2">
                      {question.choices.map(choice => {
                        const isUserChoice = answers[question.id] === choice.id;
                        const isCorrect = choice.isCorrect;
                        let className = "text-sm py-1";
                        
                        if (isUserChoice && isCorrect) {
                          className += " text-green-600 font-medium";
                        } else if (isUserChoice && !isCorrect) {
                          className += " text-red-600 font-medium";
                        } else if (isCorrect) {
                          className += " text-green-600";
                        }
                        
                        return (
                          <div key={choice.id} className={className}>
                            {isUserChoice ? '✓ ' : isCorrect ? '• ' : '  '}
                            {choice.text}
                            {isCorrect && !isUserChoice && ' (Correct answer)'}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{assessment.title}</h3>
        <p className="text-gray-600">{assessment.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {assessment.questions.length}
          </div>
          <div className="text-sm text-gray-500">
            {Object.keys(answers).length} of {assessment.questions.length} answered
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${(Object.keys(answers).length / assessment.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-4">{currentQ.text}</h4>
        {currentQ.type === QuestionType.MULTIPLE_CHOICE && currentQ.choices && (
          <div className="space-y-3">
            {currentQ.choices.map((choice) => (
              <label
                key={choice.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  answers[currentQ.id] === choice.id ? 'bg-blue-50 border-blue-300' : ''
                }`}
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
            disabled={!allQuestionsAnswered}
            className={`px-4 py-2 text-white rounded-lg ${
              allQuestionsAnswered ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
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