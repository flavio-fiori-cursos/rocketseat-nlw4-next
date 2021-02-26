import { createContext, ReactNode, useEffect, useState } from "react";
import Cookies from 'js-cookie';

import challenges from './../../challenges.json';

import { LevelUpModal } from './../components/LevelUpModal';

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
    resetChallenge: () => void,    
    closeLevelUpModal: () => void,    
}

interface ChallengesProviderProps {
    children: ReactNode,
    level: number,
    currentExperience: number,
    challengesCompleted: number
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {

    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    function levelUp() {

        setLevel(level + 1);
        setIsLevelUpModalOpen(true);

    };

    function closeLevelUpModal() {

        setIsLevelUpModalOpen(false);

    }

    useEffect(() => {

        Notification.requestPermission();

    }, []);

    useEffect(() => {

        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
        

    }, [level, currentExperience, challengesCompleted]);

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
            resetChallenge,
            closeLevelUpModal
        }}>

            {children}

            {
                isLevelUpModalOpen && <LevelUpModal/>
            }

        </ChallengesContext.Provider>
    )

}