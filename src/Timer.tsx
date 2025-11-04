import { useRef, useState } from "react"
import { useWithSound } from "./useWithSound"
import alarm from "./assets/videoplayback.mp3"

const Timer = () => {

    const [duration, setDuration] = useState(3600)
    const [isRunning, setIsRunning] = useState(false)
    const [mode, setMode] = useState<"work" | "break">("work");
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // stocke l'intervalle 
    const { playSound } = useWithSound(alarm)

    const handleTimeOut = () => {
        playSound()
    }

    const startTimer = () => {
        if(!isRunning){
                setIsRunning(true)
                intervalRef.current = setInterval(() => {
                setDuration(prevduration => {
                    if (prevduration <= 0) {
                        handleTimeOut()
                        if (intervalRef.current !== null) {
                            clearInterval(intervalRef.current);
                        }
                        setIsRunning(false)

                        if (mode === "work") {
                            setMode("break");
                            return 900;
                        } else {
                            setMode("work");
                            return 3600;
                        }
                    }
                    //console.log(prevduration);
                    return prevduration - 1;
                })
            }, 1000)
        }
    }

    const pauseTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null
            setIsRunning(false)
        }
    }

    const resetTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null // Bonne pratique pour éviter que les autres parties du code pensent que le timer est encore !null
        }
        if (mode === "work") {
            setDuration(3600);
        } else {
            setDuration(900);
        }
        setIsRunning(false)
    }

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const pad = (n: number) => n.toString().padStart(2, "0");

        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };


    /*useEffect(()=> {
        const interval = setInterval(() => {

            setDuration(prevduration => {
                if (prevduration <= 0) {
                    handleTimeOut()
                    clearInterval(interval);
                    return 0;
                }

                console.log(prevduration);
                return prevduration - 1;
            })
        }, 1000)
        
        return (()=> {
            clearInterval(interval)
        })
    }, [])*/
    
    return (
            <div className="timer">
                <p>{mode === "work" ? "Au travail !" : "Pause"}</p>
                <label>{formatTime(duration)}</label>

                <div style={{display: "flex", flexDirection: "row", gap: "0.5rem"}}>
                    <button onClick={startTimer}>Run</button>
                    <button onClick={pauseTimer}>Pause</button>
                    <button onClick={resetTimer}>Reset</button>
                </div>
            </div>
    )
}

export default Timer