import { useTranslation } from "react-i18next";
import WorldData from '../../assets/world/worldData.json'
import LocationInfo from "./locationInfo";
// import bgSkin from "../../assets/elin ui sprite/bg_skin_3.png";
import bgImage from "../../assets/elin ui sprite/bg_caption.png";
import separatorImage from "../../assets/elin ui sprite/separator_1_2.png";
// import separatorImage from "../../assets/elin ui sprite/bg_skin_6.png";

const MapPopup = (props) => {
    const {xPos, yPos, locationId, tileId, tileBiomeData, popupInfoFold, changePopupFoldInfo} = props;

    const { t } = useTranslation();

    const Popup = () => {
        // outdoor
        if (WorldData.WORLD_LOCATION[locationId] === undefined) {
            if (tileBiomeData[tileId] === undefined) {
                return (<></>)
            }
            return (
                <div style={style.popupBox}>
                    <div style={style.popupBg}/>
                    <div style={style.popupInfoBox}>
                        <div style={style.popupOutdoorTitle}>{t('biome.'+tileBiomeData[tileId])}</div>
                        <LocationInfo biome={tileBiomeData[tileId]} foldInfo={popupInfoFold} changeFoldInfo={changePopupFoldInfo} />
                    </div>
                </div>
            )
        }

        // location
        return (
            <div style={style.popupBox}>
                <div style={style.popupBg}/>
                <div style={style.popupInfoBox}>
                    <div style={style.popupLocationTitle} >
                        {t('worldinfo.' + WorldData.WORLD_LOCATION[locationId].value + '.name')}
                        {WorldData.WORLD_LOCATION[locationId].level ? <div style={{fontSize: "12pt"}}>{'(Lv.' + WorldData.WORLD_LOCATION[locationId].level + ')'}</div> : ""}
                    </div>
                    <div style={style.separatorImage}/>
                    <div style={style.popupDescription}>
                        {t('worldinfo.'+WorldData.WORLD_LOCATION[locationId].value+'.description')}</div>
                    <LocationInfo locationId={locationId} foldInfo={popupInfoFold} changeFoldInfo={changePopupFoldInfo} />
                </div>
            </div>
        )
    }

    return (
        <div style={{position:"absolute", left: xPos, top: yPos}}>
            {<Popup/>}
        </div>
    )
}

const style = {
    popupBox: {
        // maxWidth: "500px",
		position: "relative",
    },
    popupInfoBox: {
        position:"relative", 
        // zIndex:1, 
        padding:"14px 20px"
        // padding:"14px 36px 20px 20px"
    },
    popupLocationTitle: {
        padding: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        fontFamily: "Pretendard",
        fontSize: "16pt",
        fontWeight: "600",
        textAlign: "center",
        color: "#000",
    },
    popupOutdoorTitle: {
        padding: "5px",
        fontFamily: "Pretendard",
        fontSize: "14pt",
        fontWeight: "500",
        color: "#000",
    },
    popupDescription:{
        padding: "0px 5px 5px",
        fontFamily: "Pretendard",
        fontSize: "12pt",
        fontWeight: "500",
        color: "#000",
    },

    popupBg: {
        position:"absolute", 
        width:"100%", 
        height:"100%",
		boxSizing: "border-box",
		borderStyle: "solid",
		borderImage: 'url(' + bgImage + ')',
		borderWidth: "31px 33px 33px 45px",
		borderImageSlice: "31 33 33 45 fill",
        borderImageRepeat: "repeat",
    },
    separatorImage: {
        minWidth: "295px",
        height: "13px",
        marginBottom: "6px",
		borderStyle: "solid",
        borderImage: 'url(' + separatorImage + ')',
		borderWidth: "1px 14px 1px 14px",
		borderImageSlice: "1 14 1 14 fill",
        borderImageRepeat: "repeat",
    },
}

export default MapPopup;