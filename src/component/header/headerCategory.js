import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import tapButtonDark from "../../assets/elin ui sprite/button_tap_dark.png"
import tapButtonLight from "../../assets/elin ui sprite/button_tap_light.png"
import { useState } from 'react';

const HeaderCategory = () => {

    const { t } = useTranslation();

    const [activeTap, setActiveTap] = useState(0);

    const inProgressAlert = () => {
        alert(t('alert.inProgress'));
    }

    const HeaderCategoryItemText = (props) => {
        const { name, num } = props;
        return (
            <Link to={"/"+name} style={style.link} onClick={() => setActiveTap(num)}>
                <div style={style.headerCategoryItem}>
                    <div style={activeTap == num ? style.headerCategoryBgLight : style.headerCategoryBgDark}/>
                    <div style={{...style.headerCategoryItemText, 
                        padding: activeTap == num ? "5px 14px 5px" : "0px", 
                        fontSize: activeTap == num ? "14pt" : "12pt",
                        fontWeight: activeTap == num ? 600 : 400,
                    }}>
                        {t('header.items.'+name)}
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <div style={style.headerCategoryBox}>
            <HeaderCategoryItemText num={0} name={"map"}/>
            <HeaderCategoryItemText num={1} name={"damage"}/>
            {/* <HeaderCategoryItemText num={1} name={"test1"}/>
            <HeaderCategoryItemText num={1} name={"test2"}/> */}
        </div>
    );
}

const style = {
    link: {
        textDecoration: "none", 
        display:"flex", 
        alignItems:"end",
    },
    headerCategoryBox: {
        paddingLeft: "6px",
        display:'flex',
        flexDirection:'row',
        alignContent:'center',
        gap:"8px",
    },
    headerCategoryItem: {
        height:"fit-content",
        position:"relative",
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        cursor: "pointer",
    },
    headerCategoryItemText: {
        position:"relative", 
        margin: "7px 10px 0px",
        color: "#000",
        fontFamily: "Pretendard",
    },
    headerCategoryBgLight: {
        position:"absolute", 
        width:"100%", 
        height:"100%", 
		boxSizing: "border-box",
		borderStyle: "solid",
        borderImage: 'url(' + tapButtonLight + ')',
		borderWidth: "13px",
		borderImageSlice: "13 fill",
        borderImageRepeat: "repeat",
    },
    headerCategoryBgDark: {
        position:"absolute", 
        width:"100%", 
        height:"100%", 
		boxSizing: "border-box",
		borderStyle: "solid",
        borderImage: 'url(' + tapButtonDark + ')',
		borderWidth: "13px",
		borderImageSlice: "13 fill",
        borderImageRepeat: "repeat",
    },
}

export default HeaderCategory;