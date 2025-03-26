import { useEffect } from 'react';
import helpFiama from '../assets/elin ui sprite/help_fiama3.png';

const LoadingScreen = (props) => {
    const {progress, changeLoadingProgress} = props;

    useEffect(() => {
        console.log("load", progress)
        // if(progress == 1) {
        //     setTimeout(() => {changeLoadingProgress()}, 1000)
        // }
    }, [progress])

    return (
        <div style={progress > 1 ? 
            {...style.loadingScreenBg, opacity:1} : 
            {...style.loadingScreenBg, opacity:0}
        }>
            <div style={style.loadingIcon} />
            <div style={style.loadingText}>
                Loading...
            </div>
        </div>
    );
}

const style = {
    loadingScreenBg: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap:"20px",
        backgroundColor: "#fff",
        zIndex: 999,
        opacity: 1,
        transition: "opacity 0.5s 0.5s",
    },
    loadingIcon: {
		width: "119px",
		height: "184px",
		backgroundImage: "url(" + helpFiama + ")",
		backgroundSize: "100%",
    },
    loadingText: {
        color: "#000",
		fontFamily: "Pretendard",
		fontSize: "24pt",
        fontWeight: 600,
        letterSpacing: "4pt",
    },
}

export default LoadingScreen;