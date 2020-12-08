import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios'

export const questionSlice = createSlice({
    name: 'question',
    initialState: {
        loading: false,
        list: {},
        current: null,
        score: 0,
        won: false,
    },
    reducers: {
        loadQuestion: state => {
            state.loading = true
        },
        setNewQuestion: (state, action) => {
            const question = action.payload
            state.loading = false
            state.current = question
            state.list[question.id] = question 
        },
        addScore: (state, action) => {
            state.score += action.payload
        },
        gameWon: state => {
            state.won = true
        },
        restart: (state) => {
            state.list = {}
            state.curent = null
            state.score = 0
            state.won = false
        }
    },
});

export const { loadQuestion, setNewQuestion, addScore,  restart, gameWon } = questionSlice.actions;

//-------------------------------------------------------------------------------------------
// thunk actions

export const getNewQuestion = list => async dispatch => {
    if(Object.keys(list).length < 30) {
        dispatch(loadQuestion())
        let response = await axios.get("http://jservice.io/api/random")
        let question = response.data[0]
        if (!list[question.id]) {
            dispatch(setNewQuestion(question))
        } else {
            getNewQuestion()
        }
    } else {
        dispatch(gameWon())
    }
}

//----------------------------------------------------------------------------------------------
//selector functions

export const getQuestionsList = state => state.question.list;

export const getLoading = state => state.question.loading;

export const getCurrentQuestion = state => state.question.current;

export const getUserScore = state => state.question.score;

export const getGameWon = state => state.question.won;



export default questionSlice.reducer;
