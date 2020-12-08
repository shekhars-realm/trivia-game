import { configureStore } from '@reduxjs/toolkit';
import questionReducer from '../features/questions/questionSlice';

export default configureStore({
  reducer: {
    question: questionReducer,
  },
});
