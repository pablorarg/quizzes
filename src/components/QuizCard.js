import Button from 'components/Button'
import QuestionCard from 'components/QuestionCard'
import QuizResult from 'components/QuizResult'
import useQuiz from 'hooks/useQuiz'
import React, { useState } from 'react'
import { BUTTON_COLOR } from '../constants'
import './QuizCard.css'

const POINTS_FOR_BOOLEAN = 5
const POINTS_FOR_MULTIPLE = 10

export default function QuizCard({ category, difficulty }) {

    const { feedback } = useQuiz({ category, difficulty })
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [points, setPoints] = useState(0)
    const [completed, setCompleted] = useState(false)
    const question = feedback.quiz[currentQuestion]

    if (feedback.loading) return <div className='message'> <span>Loading...</span></div>

    if (feedback.hasError) return <div className='message' ><span>{feedback.message}</span></div>

    if (completed) return <QuizResult points={points} />

    const onAnswer = (text) => {
        checkAnswer(text)
        setNextStep()
    }

    const checkAnswer = (answers) => {

        if (question.correct_answer === answers) {
            switch (question.type) {
                case 'boolean':
                    setPoints(currentValue => currentValue + POINTS_FOR_BOOLEAN)
                    break;
                case 'multiple':
                    setPoints(currentValue => currentValue + POINTS_FOR_MULTIPLE)
                    break;
                default:
                    break;
            }
        }
    }

    const setNextStep = () => {
        currentQuestion + 1 === feedback.quiz.length
            ? setCompleted(true)
            : setCurrentQuestion(currentValue => currentValue + 1)
    }

    const renderAnswers = () => {
        const answers = [...question.incorrect_answers, question.correct_answer]
            .sort((a, b) => a.localeCompare(b))

        return answers.map(answer => {
            return <Button color={BUTTON_COLOR.ORANGE}
                key={answer}
                onClick={() => onAnswer(answer)}
                text={answer} />
        })
    }

    return (
        <main className="main-container" >
            <QuestionCard
                footer={`${question.category} - ${question.difficulty}`}
                header={`${currentQuestion + 1} - ${feedback.quiz.length}`}
                question={question.question} />
            <nav className="answers">
                {renderAnswers()}
            </nav>
        </main>
    )
}