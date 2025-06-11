import { createContext, useState } from "react";
import { useAuth } from "./AuthContext";

const QuizContext = createContext();

const [tests, setTests] = useState();
const [questions, setQuestions] = useState();