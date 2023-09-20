import { decode } from "html-entities"

export default function Question(props) {
  const answerElements = props.answers.map(answer => {
    let className = "answers-btn"

    if (props.endGame) {
      if (props.selectedAnswerId === answer.id) {
        if (answer.id === props.correctAnswerId) {
          className += " answers-btn--correct"
        } else {
          className += " answers-btn--incorrect"
        }
      } else if (answer.id === props.correctAnswerId) {
        className += " answers-btn--correct-highlight"
      } else {
        if (
          answer.id !== props.correctAnswerId &&
          answer.id !== props.selectedAnswerId
        ) {
          className += " answers-btn--dimmed"
        }
      }
    } else if (props.selectedAnswerId === answer.id) {
      className += " answers-btn--selected"
    }

    return (
      <button
        className={className}
        key={answer.id}
        onClick={() => props.selectAnswer(answer.id)}
        disabled={props.answersChecked}>
        {decode(answer.text)}
      </button>
    )
  })

  return (
    <div className="question-container">
      <h1 className="question">{decode(props.question)}</h1>
      <div className="answers-container">{answerElements}</div>
    </div>
  )
}
