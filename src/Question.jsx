import { decode } from "html-entities"

export default function Question(props) {

  const answerElements = props.answers.map(answer => (
    <button 
    className={`answers-btn ${props.selectedAnswerId === answer.id ? "answers-btn--selected" : ""}` } 
    key={answer.id}
    onClick={() => props.selectAnswer(answer.id)}
    >
      {decode(answer.text)}
    </button>
  ))
  
  return (
    <div className="question-container">
      <h1 className="question">{decode(props.question)}</h1>
      <div className="answers-container">{answerElements}</div>
    </div>
  )
}
