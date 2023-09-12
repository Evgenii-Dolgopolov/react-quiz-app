import { useState, useEffect } from "react"
import "./App.css"
import Question from "./Question.jsx"
import { nanoid } from "nanoid"

function App() {
  const [quiz, setQuiz] = useState(false)
  const [questionsData, setQuestionsData] = useState([])
  const [endGame, setEndGame] = useState(false)
  console.log(questionsData)

  function startQuiz() {
    setQuiz(true)
  }

  useEffect(() => {
    async function fetchData(url) {
      try {
        const res = await fetch(url)
        const data = await res.json()
        const dataWithIds = data.results.map(item => ({
          ...item,
          id: nanoid(),
        }))

        const updatedQuestionsData = dataWithIds.map(questionData => {
          const allAnswersArr = [
            questionData.correct_answer,
            ...questionData.incorrect_answers,
          ]

          let correctAnswerId = null

          const allAnswersObj = allAnswersArr.map(answer => {
            const answerId = nanoid()

            if (answer === questionData.correct_answer) {
              correctAnswerId = answerId
            }

            return {
              id: answerId,
              text: answer,
              isSelected: false,
            }
          })

          const shuffledAnswersObj = shuffle(allAnswersObj)

          return {
            ...questionData,
            answers: shuffledAnswersObj,
            selectedAnswerId: null,
            correctAnswerId: correctAnswerId,
          }
        })

        setQuestionsData(updatedQuestionsData)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData("https://opentdb.com/api.php?amount=5&type=multiple")
  }, [])

  function shuffle(array) {
    const clonedArray = [...array]
    for (let i = clonedArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[clonedArray[i], clonedArray[j]] = [clonedArray[j], clonedArray[i]]
    }
    return clonedArray
  }

  function selectAnswer(questionId, answerId) {
    setQuestionsData(prevQuestionsData => {
      return prevQuestionsData.map(question => {
        if (question.id === questionId) {
          return {
            ...question,
            selectedAnswerId: answerId,
          }
        }
        return question
      })
    })
  }

  function checkAnswers() {
    setEndGame(true)

    setQuestionsData(prevQuestionData => {
      return prevQuestionData.map(question => {
        if (question.selectedAnswerId === question.correctAnswerId) {
          console.log("correct answers")
        } else {
          console.log("we also have some incorrect answers")
        }

        return question
      })
    })
  }

  const correctAnswerCount = questionsData.filter(
    question => question.selectedAnswerId === question.correctAnswerId
  ).length

  function resetGame() {
    setEndGame(false)
  }

  const quizElements = questionsData.map(questionData => (
    <Question
      key={questionData.id}
      id={questionData.id}
      question={questionData.question}
      correctAnswer={questionData.correct_answer}
      answers={questionData.answers}
      selectedAnswerId={questionData.selectedAnswerId}
      selectAnswer={answerId => selectAnswer(questionData.id, answerId)}
    />
  ))

  return (
    <main>
      {quiz ? (
        <div className="quiz-container">
          <section>{quizElements}</section>

          {endGame ? (
            <div className="end-game-container">
              <h4>You scored {correctAnswerCount}/5 correct answers</h4>
              <button className="play-again-btn" onClick={resetGame}>
                Play again
              </button>
            </div>
          ) : (
            <button className="check-answers-btn" onClick={checkAnswers}>
              Check answers
            </button>
          )}
        </div>
      ) : (
        <div className="starting-container">
          <h1 className="title">Quizzical</h1>
          <button className="start-btn" onClick={startQuiz}>
            Start quiz
          </button>
        </div>
      )}
    </main>
  )
}

export default App
