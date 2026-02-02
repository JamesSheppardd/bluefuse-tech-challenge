
interface ModalProps {
    text: string;
    visible: boolean;
    setVisible: (b: boolean) => void;
}

const Modal = ({visible=false, ...props}: ModalProps) => {
    if(visible){
        return (
            <div
                className="
                w-full h-full absolute top-0
                bg-[#0000006f]
                "    
            >
                <div className="flex justify-center items-center h-full">
                    <div 
                        className="
                        flex flex-col justify-center items-center gap-2
                        px-3 py-6 min-w-[25%] max-w-[55%]
                        border
                        bg-[#393E46]
                        text-2xl text-center text-wrap overflow-scroll
                        "
                    >
                        <p className="py-auto">{props.text}</p>
                        <button className="border w-[80%] h-[10%] text-xl cursor-pointer" onClick={() => props.setVisible(false)}>OK</button>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return null
    }
}

export default Modal