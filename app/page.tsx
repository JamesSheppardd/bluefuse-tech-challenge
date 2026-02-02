'use client'
import { useEffect, useRef, useState } from "react";
import Modal from "./components/Modal";

type NumberSuffix = "th" | "st" | "nd" | "rd"

export default function Home() {
    const [displayedString, setDisplayedString] = useState<string>("")
    // palindrome states
    const [inputString, setInputString] = useState<string>("")
    const [selectedChars, setSelectedChars] = useState<number[]>([])
    const [charColour, setCharColour] = useState<string>("text-green-400")
    const posOfMismatchChars = useRef(-1)
    // palindrome animation refs
    const animationLPointer = useRef(0)
    const animationRPointer = useRef(0)
    const animationIntervalRef = useRef<NodeJS.Timeout>(undefined)
    // fibonacci states
    const [fibInput, setFibInput] = useState<string>("")
    const [fullFibArr, setFullFibArr] = useState<number[]>([0, 1])
    const fibAnswer = useRef<number>(0)
    // modal state
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [modalText, setModalText] = useState<string>("")

    //#region Palindrome
    const p = (s: string): boolean => {
        posOfMismatchChars.current = -1
        let pL = 0
        let pR = s.length - 1

        while(pL < pR){
            if(s[pL] !== s[pR]){
                posOfMismatchChars.current = pL
                return false
            }
            pL++, pR--
        }
        return true
    }

    const highlightChars = () => {
        // calling palindrome func
        p(displayedString.toLowerCase().replace(/[^0-9a-z]/gi, ""))

        setCharColour("text-green-400")
        animationLPointer.current = 0
        animationRPointer.current = displayedString.length-1
        loopChars()
        function loopChars() {
            // if we are at the position of the chars tht are not the same, turn colour to red
            if(animationLPointer.current === posOfMismatchChars.current) {
                setCharColour("text-red-400")
                clearInterval(animationIntervalRef.current)
                setModalText(`${displayedString} is not a palindrome!`)
            }
            // if the left pointer is right pointer, at end of string
            else if(animationLPointer.current > animationRPointer.current) {
                clearInterval(animationIntervalRef.current)
                setSelectedChars([])
                setModalText(`${displayedString} is a palindrome!`)
                return
            }
            // if character is a space or other ignored char, skip it
            while(/[^0-9a-z]/gi.test(displayedString[animationLPointer.current])) {
                animationLPointer.current += 1
            }
            while(/[^0-9a-z]/gi.test(displayedString[animationRPointer.current])) {
                animationRPointer.current -= 1
            }
            
            setSelectedChars([animationLPointer.current, animationRPointer.current])
            animationLPointer.current += 1
            animationRPointer.current -= 1
        }
        if(posOfMismatchChars.current !== 0){
            animationIntervalRef.current = setInterval(loopChars, 500);
        }
    }
    //#endregion

    //#region Fibonacci Sequence
    const f = (n: number): number => {
        if(n === 0){
            setFullFibArr([0])
            return 0
        } 
        else if(n === 1) return 1

        let sVal = 0
        let lVal = 1
        for (let i = 0; i < n-1; i++) {
            const newVal = sVal + lVal
            sVal = lVal
            lVal = newVal
            // for animation
            setFullFibArr(prev => [...prev, newVal])
        }
        return lVal
    }

    const AnimateFibSequence = () => {
        let pointer = 0
        function loop() {
            const newVal = fullFibArr[pointer]
            if(pointer > fullFibArr.length-1) {
                clearInterval(animationIntervalRef.current)
                return
                //setTimeout(() => setModalText(`${fibInput}${numberSuffix(parseInt(fibInput))} term of the Fibonacci sequence is: ${fibAnswer.current}`), 1000)
            }
            setDisplayedString(`${pointer}${numberSuffix(pointer)} value of the Fibonacci sequence is: ${newVal}`)
            pointer++
        }
        loop()
        animationIntervalRef.current = setInterval(loop, 500);
    }

    useEffect(() => {
        if(fullFibArr[fullFibArr.length-1] === fibAnswer.current){
            AnimateFibSequence()
        }
    }, [fullFibArr])
    //#endregion
    
    useEffect(() => {
        return () => clearInterval(animationIntervalRef.current)
    }, [])

    useEffect(() => {
        if(modalText !== ""){
            setModalVisible(true)
        }
    }, [modalText])

    const numberSuffix = (n: number): NumberSuffix => {
        switch (n) {
            case 1:
                return "st"
            case 2:
                return "nd"
            case 3: 
                return "rd"
            default:
                return "th"
        }
    }

    return (
    <div className="flex min-h-screen items-center justify-center ">
        <main className="flex min-h-screen w-full flex-col justify-start items-center gap-10 py-12 px-16">
            <Modal text={modalText} visible={modalVisible} setVisible={(b) => {setModalVisible(b); setModalText("")}} />
            
            <div className="flex text-center">
                <h1 className="text-4xl font-bold underline">Bluefuse Technical Challenge</h1>
            </div>

            <div className="flex flex-col grow justify-center gap-20">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center mb-2 text-3xl font-bold max-w-[90vw]">
                        <div className="flex flex-row px-3 overflow-scroll w-full">
                            { displayedString 
                            ? displayedString.split("").map((c,i) => {
                                if(c === " "){
                                    return <div key={i} className="px-2" />
                                }
                                return <p key={i} className={`${selectedChars[0] === i || selectedChars[1] === i ? charColour : null}`}>{c}</p>
                            })
                            : <p className="px-3 text-[#dfd0b832]">Type something down below</p>
                            }
                        </div>
                        
                        <div className="flex grow -m-1 h-1.5 w-full border-b-2 border-l-2 border-r-2 border-[#393E46]" />
                    </div>
                </div>

                <div className="flex flex-row items-center justify-center gap-5">
                    <div className="flex flex-col justify-center items-center gap-3 border-2 p-6 border-[#393E46]">
                        <h2 className="text-2xl">Palindrome Checker</h2>
                        <form className="flex flex-row gap-2 justify-center" 
                            onSubmit={(e) => {
                                e.preventDefault()
                                if(!modalVisible){
                                    clearInterval(animationIntervalRef.current)
                                    highlightChars()
                                }
                                }}
                            >
                            <input 
                                className="text-center focus:outline-hidden border-2 border-[#393E46] w-1/2" type="text" 
                                placeholder="Input a string" value={inputString}
                                onChange={(s) => {
                                    if(!modalVisible){
                                        setDisplayedString(s.currentTarget.value)
                                        setSelectedChars([])
                                        setInputString(s.currentTarget.value)
                                    }
                                }}/>
                            <button className="px-2 border-2 border-[#393E46]">Submit</button>
                        </form>
                    </div>
                    
                    <div className="flex flex-col justify-center items-center gap-3 border-2 p-6 border-[#393E46]">
                        <h2 className="text-2xl">Fibonnaci Sequence</h2>
                        <form className="flex flex-row gap-2 justify-center" 
                        onSubmit={e => {
                            e.preventDefault()
                            setFullFibArr([0,1])
                            // clear selected chars to stop red/green colour if used after palindorme
                            setSelectedChars([])
                            setInputString("")
                            clearInterval(animationIntervalRef.current)
                            if(fibInput != ""){
                                fibAnswer.current = f(parseInt(fibInput))
                            }
                        }}
                        >
                            <input 
                                className="text-center focus:outline-hidden border-2 border-[#393E46] w-1/2" type="number" min={0} pattern="[0-9]*"
                                placeholder="Input an integer"
                                value={fibInput}
                                onChange={c => setFibInput(c.target.value)}
                                />
                            <button className="px-2 border-2 border-[#393E46]">Submit</button>
                        </form>
                    </div>
                    
                </div>
            </div>
        </main>
    </div>
    );
}
