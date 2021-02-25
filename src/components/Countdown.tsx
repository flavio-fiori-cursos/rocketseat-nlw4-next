import { useState, useEffect, Fragment, useContext } from 'react';

import { ChallengesContext } from '../contexts/ChallengesContext';
import { CountdownContext } from '../contexts/CountdownContext';

import styles from './../styles/components/Countdown.module.css';

export function Countdown() {   
    
    const { minutes, seconds, hasFinished, isActive, startCountdown, resetCountdown } = useContext(CountdownContext);

    const minuteLeftRight = String(minutes).padStart(2, '0').split('');
    const secondLeftRight = String(seconds).padStart(2, '0').split('');

    const [minuteLeft, minuteRight] = minuteLeftRight;
    const [secondLeft, secondRight] = secondLeftRight;
    

    return (

        <div>

            <div className={styles.countdownContainer}>

                <div>

                    <span>{ minuteLeft }</span>
                    <span>{ minuteRight }</span>

                </div>

                <span>:</span>

                <div>

                    <span>{ secondLeft }</span>
                    <span>{ secondRight }</span>

                </div>

            </div>

            {
                hasFinished ? (

                <button 
                    disabled                     
                    className={styles.countdownButton}>
                    Ciclo encerrado
                </button>
                
                ): (

                    <Fragment>

                        {
                            isActive ? (

                                <button 
                                    type="button" 
                                    className={`${styles.countdownButton} ${styles.countdownButtonActive}`} 
                                    onClick={resetCountdown}>
                                    Abandonar ciclo
                                </button>

                            ):

                            <button 
                                type="button" 
                                className={styles.countdownButton} 
                                onClick={startCountdown}>
                                Iniciar um ciclo
                            </button>
                        }

                    </Fragment>

                )

            }
            

        </div>


    )

}