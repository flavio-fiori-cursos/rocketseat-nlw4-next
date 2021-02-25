import { createContext, ReactNode, useEffect, useState } from "react";
import challenges from './../../challenges.json';

interface Challenge {
    type: 'body' | 'eye',
    description: string,
    amount: number
}

interface ChallengesContextData {    
    level: number, 
    currentExperience: number, 
    experienceToNextLevel: number,
    challengesCompleted: number,
    activeChallenge: Challenge, 
    levelUp: () => void,
    startNewChallenge: () => void,
    completeChallenge: () => void,
    resetChallenge: () => void    
}

interface ChallengesProviderProps {
    children: ReactNode
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps) {

    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(1);
    const [activeChallenge, setActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    function levelUp() {
        setLevel(level + 1);
    };

    useEffect(() => {

        Notification.requestPermission();

    }, []);

    function startNewChallenge() {

        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        if(Notification.permission === 'granted') {

            new Audio('/notification.mp3').play();

            new Notification('Novo desafio', {
                body: `Valendo ${challenge.amount}xp !`
            })

        }

    };

    function completeChallenge() {

        if (!activeChallenge) return;

        const { amount } = activeChallenge;
        let finalExperience = currentExperience + amount;

        if(finalExperience >= experienceToNextLevel) {

            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();

        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);

    };

    function resetChallenge() {

        setActiveChallenge(null);

    };

    return (
        <ChallengesContext.Provider value={{ 
            level, 
            currentExperience,
            experienceToNextLevel, 
            challengesCompleted, 
            levelUp,
            startNewChallenge,
            completeChallenge,
            activeChallenge,
            resetChallenge
        }}>

            {children}

        </ChallengesContext.Provider>
    )

}