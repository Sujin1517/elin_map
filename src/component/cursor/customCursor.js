import { useContext, useEffect, useState } from "react";
import { MouseContext } from "./mouseContext";
import cursorNormal from "../../assets/elin ui sprite/023.png";
import cursorTextSelect from "../../assets/elin ui sprite/006.png";
import cursorHelp from "../../assets/elin ui sprite/024.png";
import cursorUnavaliable from "../../assets/elin ui sprite/023_1.png";
import cursorBusy from "../../assets/elin ui sprite/045.png";
import cursorPrecision from "../../assets/elin ui sprite/022.png";

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });

    const { cursorType } = useContext(MouseContext);

    useEffect(() => {
        const mouseMoveHandler = (e) => {
            const { clientX, clientY } = e;
            setMousePosition({ x: clientX, y: clientY });
        };
        
        document.addEventListener("mousemove", mouseMoveHandler);
        return () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
        };
    }, []);

    return (
        <>
            <div style={{
                ...style.cursor,
                ...style["cursor"+cursorType],
                left:`${mousePosition.x}px`, 
                top:`${mousePosition.y}px`
            }}/>
        </>
    );
}

const style = {
    cursor: {
		position: "fixed",
        top: "50%",
        left: "50%",
		width: "32px",
		height: "32px",
		backgroundSize: "100%",
		backgroundPosition: "center",
  		backgroundRepeat: "no-repeat",
        pointerEvents: "none",
        zIndex: 100,
    },
    cursorNormal: {
		width: "24px",
		height: "24px",
        backgroundImage: "url(" + cursorNormal + ")",
    },
    cursorHovered: {
		width: "30px",
        backgroundImage: "url(" + cursorHelp + ")",
    },
    cursorTextSelect: {
        backgroundImage: "url(" + cursorTextSelect + ")",
    },
    cursorUnavaliable: {
        backgroundImage: "url(" + cursorUnavaliable + ")",
    },
    cursorBusy: {
        backgroundImage: "url(" + cursorBusy + ")",
    },
    cursorPrecision: {
        backgroundImage: "url(" + cursorPrecision + ")",
    },
};

export default CustomCursor;