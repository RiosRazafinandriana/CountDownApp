import { useRef, useState } from "react"
import { useWithSound } from "./useWithSound"
import alarm from "./assets/videoplayback.mp3"

const Timer = () => {

    const [duration, setDuration] = useState(3600)
    const [isRunning, setIsRunning] = useState(false)
    const [mode, setMode] = useState<"work" | "break">("work");
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null); // stocke l'intervalle 
    const { playSound } = useWithSound(alarm)
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    const requestWakeLock = async () => {
        try {
            if ('wakeLock' in navigator) {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
                console.log('Wake Lock activé');
            }
        } catch (err) {
            console.error('Wake Lock error:', err);
        }
    };

    const releaseWakeLock = async () => {
        if (wakeLockRef.current) {
            await wakeLockRef.current.release();
            wakeLockRef.current = null;
            console.log('Wake Lock libéré');
        }
    };

    const toggleWorkState = () => {
        if (mode === "work") {
            setMode("break");
            setDuration (900);
        } else {
            setMode("work");
            setDuration(3600);
        }
    }

    const handleTimeOut = () => {
        playSound()
        releaseWakeLock()
    }

    const startTimer = () => {
        if(!isRunning){
                setIsRunning(true)
                requestWakeLock()
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
            releaseWakeLock()
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
        releaseWakeLock()
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
        <div>
            <button className="switch-btn" onClick={toggleWorkState}>Switch</button>
            <div className="timer">
                <p>{mode === "work" ? "Au travail !" : "Pause"}</p>
                <label>{formatTime(duration)}</label>

                <div style={{display: "flex", flexDirection: "row", gap: "0.5rem"}}>
                    <button onClick={startTimer}>Run</button>
                    <button onClick={pauseTimer}>Pause</button>
                    <button onClick={resetTimer}>Reset</button>
                </div>
            </div>
        </div>
    )
}

export default Timer