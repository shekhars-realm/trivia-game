import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getQuestionsList,
    getLoading,
    getNewQuestion,
    getCurrentQuestion,
    addScore,
    getUserScore,
    restart,
    getGameWon
} from './questionSlice';
import styles from './Question.module.css';

export function Question() {
    let counters = null
    const questionList = useSelector(getQuestionsList)
    const currentQues = useSelector(getCurrentQuestion)
    const dispatch = useDispatch();
    const loading = useSelector(getLoading)
    const score = useSelector(getUserScore)
    const [answer, setAnswer] = useState("")
    const [modelText, setModelText] = useState(null)
    const [timer, setTimer] = useState(-1)
    const won = useSelector(getGameWon)

    const restartText = <p>Are you sure you want to restart? Current progress will be lost.</p>

    const wrongAnsText = <p><b>Wrong Answer.</b> Please restart the game.</p>

    const timeoutText = <p>You <b>ran out of time</b>. Please restart the game.</p>

    const wonGame = <p>You have <b>Won</b> the game. Please restart for a new set.</p>

    let popup = document.getElementById("timeoutPopup")

    useEffect(() => {
        //start timer on new question
        if (currentQues) {
            setTimer(30)
        }
    }, [currentQues])

    useEffect(() => {
        if(won) {
            setModelText(wonGame)
            popup.style.display = "block"
        }
    }, [won])

    useEffect(() => {
        //Check for user's  high score
        if(localStorage.getItem("highscore")) {
            if(localStorage.getItem("highscore") < score) {
                localStorage.setItem("highscore", score)
            }
        } else {
            localStorage.setItem("highscore", score)
        }
    }, [score])

    useEffect(() => {
        //countdowntimer that display popup  on timeout
        clearTimeout(counters)
        if (timer > 0) {
            counters = setTimeout(() => setTimer(timer - 1), 1000);
        } else if(timer === 0) {
            clearTimeout(counters)
            console.log("timeout")
            setModelText(timeoutText)
            popup.style.display = "block"
        } else {
            console.log("failed")
        }
    }, [timer]);

    const check = () => {
        //checks  the answer ans display popup if wrong
        clearTimeout(counters)
        if (answer.toLowerCase() === currentQues.answer.toLowerCase()) {
            dispatch(addScore(currentQues.value))
            dispatch(getNewQuestion(questionList))
        } else {
            setModelText(wrongAnsText)
            popup.style.display = "block"
        }
        
    }

    const restartQuiz = () => {
        popup.style.display = "none"
        clearTimeout(counters)
        dispatch(restart())
        dispatch(getNewQuestion(questionList))
    }
    const mannualReset = () => {
        setModelText(restartText)
        popup.style.display = "block"
    }

    return (
        <div className={styles.questionContiner}>
            <div id="timeoutPopup" className={styles.modal}>
                <div className={styles.modalContent}>
                    <p>{won?"Congratulations!":"Oops!"}</p>
                    {modelText}
                    <br/>
                    <button className={styles.restartBtn} onClick={restartQuiz}>Restart</button>
                </div>

            </div>
            <div className={styles.containerHead}>
                <div className={styles.headLeft}>
                    Trivia Game
                </div>
                <div className={styles.headRight}>
                    <span>High Score: {localStorage.getItem("highscore") && localStorage.getItem("highscore") > score ? localStorage.getItem("highscore") : score} </span>
                </div>
            </div>
            <div className={styles.containerBody}>
                {
                    loading
                        ? <div className={styles.loader}></div>
                        : currentQues
                            ? (
                                <>
                                    <div className={styles.bodyTop}>
                                        <div className={styles.roundBar}>
                                            Round {Object.keys(questionList).length}
                                        </div>
                                        <div  className={styles.topBar}>
                                            <p className={styles.questionTitle}>
                                                Title: {currentQues.category.title.toUpperCase()}, ({currentQues.value} points)
                                            <button className={styles.restartBtn} onClick={mannualReset}>Reset</button>
                                            </p>
                                            <br/>
                                            <div>
                                                <span>Time: {timer} seconds</span>
                                                <br />
                                                <span>Score: {score} points</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.bodyBottom}>
                                        <div className={styles.question}>

                                            <p className={styles.questionText}>
                                                {currentQues.question}
                                            </p>
                                            <input placeholder="Answer..." className={styles.answerInput} onChange={(e) => setAnswer(e.target.value)} type="text" />
                                            <br/>
                                            <button disabled={answer===""} onClick={check} className={styles.startBtn}>Submit</button>
                                        </div>
                                    </div>
                                </>
                            )
                            : (
                                <>
                                    <h2>Instructions</h2>
                                    <br />
                                    <p>1. Provide the answers in the textbox.</p>
                                    <p>2. Each question has a value for the answer.</p>
                                    <p>3. Corrext answer will take you to the next question.</p>
                                    <p>4. Wrong answer will make you lose the game.</p>
                                    <p>5. Each question needs to be answered in 30 seconds.</p>
                                    <button className={styles.startBtn} onClick={() => dispatch(getNewQuestion(questionList))}>Start</button>
                                </>
                            )
                }
            </div>
        </div>
    );
}
