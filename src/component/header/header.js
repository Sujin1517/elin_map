import { useTranslation } from 'react-i18next';
import HeaderCategory from './headerCategory';
import bgImage from '../../assets/elin ui sprite/tex_wood2.png';
import { useContext, useState } from 'react';
import { MouseContext } from '../cursor/mouseContext';
import Select from 'react-select';

const Header = () => {

    // const { cursorChangeHandler } = useContext(MouseContext);

    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang).then(() => alert(t('alert.changeLang')));
    }

    const inProgressAlert = () => {
        alert(t('alert.inProgress'));
    }

    return (
        <div style={style.headerBox}>
            <div style={style.headerBoxLeft}>
                {/* <div style={style.headerTitle}>
                    <div>Elin Info(Dev)</div>
                </div> */}
                <HeaderCategory />
            </div>
            <div style={style.headerBoxRight}>
                <div style={style.langBox}>
                    <div style={style.langButton} onClick={() => changeLanguage('jp')} 
                        // onMouseLeave={() => cursorChangeHandler("Normal")} 
                        // onMouseEnter={() => cursorChangeHandler("Hovered")}
                    >
                        JP
                    </div>
                    <div style={style.langButton} onClick={() => changeLanguage('en')}>
                        EN
                    </div>
                    <div style={style.langButton} onClick={() => changeLanguage('ko')}>
                        KO
                    </div>
                </div>
            </div>
        </div>
    );
}

const style = {
    headerBox: {
        height:"50px",
        display:"flex",
        flexDirection:"row",
        justifyContent: "space-between",
        backgroundImage: 'url(' + bgImage + ')',
    },
    headerTitle: {
        paddingLeft:"12px",
        fontSize:"20pt",
        fontWeight:700,
        display:'flex',
        alignItems:'center',
    },
    headerBoxLeft: {
        paddingLeft:"12px",
        height: "100%",
        display:"flex",
        flexDirection:"column",
        // justifyContent: "space-between",
        justifyContent: "end",
    },
    headerBoxRight: {
        display:"flex",
        justifyContent: "center",
        height: "100%",
    },
    langBox: {
        paddingRight: "12px",
        display:"flex",
        flexDirection:"row",
        padding:"12px",
        alignItems: "start",
        gap: "6px",
    },
    langButton: {
        width: "26px",
        padding: "2px",
        fontSize: "10pt",
        textAlign: "center",
        border: "solid 1px black",
        borderRadius:"3px",
        cursor: "pointer",
        backgroundColor: "#fff",
    }
    
}

export default Header;