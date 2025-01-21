import  { useState } from 'react';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { Assessment, Question, QuestionType, Choice } from '../../../types/IAssessment';

interface AssessmentFormProps {
  courseId: string;
  lessonId: string;
  initialData?: Assessment;
  onSubmit: (data: Assessment) => void;
}

export default function AssessmentForm({ courseId, lessonId, initialData, onSubmit }: AssessmentFormProps) {
  const [assessment, setAssessment] = useState<Assessment>(initialData || {
    courseId,
    lessonId,
    title: '',
    description: '',
    passingScore: 70,
    questions: [],
    isPublished: false,
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: QuestionType.MULTIPLE_CHOICE,
      text: '',
      choices: [],
      points: 1,
    };
    setAssessment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const addChoice = (questionId: string) => {
    const newChoice: Choice = {
      id: crypto.randomUUID(),
      text: '',
      isCorrect: false,
    };
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId 
          ? { ...q, choices: [...(q.choices || []), newChoice] }
          : q
      )
    }));
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const removeQuestion = (questionId: string) => {
    setAssessment(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Assessment Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={assessment.title}
                onChange={e => setAssessment(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={assessment.description}
                onChange={e => setAssessment(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
              <input
                type="number"
                value={assessment.passingScore}
                onChange={e => setAssessment(prev => ({ ...prev, passingScore: Number(e.target.value) }))}
                className="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Questions</h3>
            <button
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <PlusCircle size={20} />
              Add Question
            </button>
          </div>

          <div className="space-y-6">
            {assessment.questions.map((question, index) => (
              <div key={question.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-medium">Question {index + 1}</h4>
                  <button
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question Type</label>
                    <select
                      value={question.type}
                      onChange={e => updateQuestion(question.id, { type: e.target.value as QuestionType })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      {Object.values(QuestionType).map(type => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ').toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question Text</label>
                    <textarea
                      value={question.text}
                      onChange={e => updateQuestion(question.id, { text: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      rows={2}
                    />
                  </div>

                  {question.type === QuestionType.MULTIPLE_CHOICE && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Choices</label>
                        <button
                          onClick={() => addChoice(question.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          Add Choice
                        </button>
                      </div>
                      <div className="space-y-2">
                        {question.choices?.map((choice, choiceIndex) => (
                          <div key={choice.id} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={choice.isCorrect}
                              onChange={() => {
                                const updatedChoices = question.choices?.map(c => ({
                                  ...c,
                                  isCorrect: c.id === choice.id
                                }));
                                updateQuestion(question.id, { choices: updatedChoices });
                              }}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                            />
                            <input
                              type="text"
                              value={choice.text}
                              onChange={e => {
                                const updatedChoices = question.choices?.map(c =>
                                  c.id === choice.id ? { ...c, text: e.target.value } : c
                                );
                                updateQuestion(question.id, { choices: updatedChoices });
                              }}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              placeholder={`Choice ${choiceIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Points</label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={e => updateQuestion(question.id, { points: Number(e.target.value) })}
                      className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setAssessment(prev => ({ ...prev, isPublished: !prev.isPublished }))}
            className={`px-4 py-2 rounded-md ${
              assessment.isPublished
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {assessment.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={() => onSubmit(assessment)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Save size={20} />
            Save Assessment
          </button>
        </div>
      </div>
    </div>
  );
}