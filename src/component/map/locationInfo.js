import WorldData from '../../assets/world/worldData.json';
import infoNameIcon from '../../assets/elin ui sprite/icon_elements_2.png';
import infoTextIcon from '../../assets/elin ui sprite/icons_24_16_1.png';
import buttonFold from '../../assets/elin ui sprite/button_fold.png';
import buttonUnfold from '../../assets/elin ui sprite/button_unfold.png';
import { useTranslation } from 'react-i18next';
// import { useEffect, useState } from 'react';

const LocationInfo = (props) => {
    const { locationId, foldInfo, changeFoldInfo, biome } = props;    

    const { t } = useTranslation();

    /*
    const [foldInfo, setFoldInfo] = useState();
    const changeFoldInfo = (key) => {
        let temp = {...foldInfo};
        temp[key] = !temp[key];
        setFoldInfo(temp)
    }

    useEffect(() => {
        if (foldInfo === undefined) {
            let temp = {}
            for(const [key] in Object.entries(WorldData.WORLD_LOCATION[locationId])) {
                temp[key] = true;
            }
            setFoldInfo(temp);
        }
    }, [])
    */

    const TextList = (props) => {
        const {id, value} = props;
        const towColumn = ["merchant", "skill", "facility", "tree", "otherFeature"];

        return (
            <div style={{columnCount: towColumn.includes(id) ? 2 : 1, columnGap:"0", marginLeft: "12px",marginRight: "16px"}}>
            {foldInfo === undefined || !foldInfo[id] ? <></> :
                value.map(e => (
                    <div key={e} style={style.infoTextBox}>
                        <div style={style.infoTextBoxIcon}/>
                        <div style={style.infoText}>{t(id+'.'+e)}</div>
                    </div>
                ))}
            </div>
        )
    }

    const InfoList = () => {
        return (
            <>
                {biome === undefined? 
                    // location
                    Object.entries(WorldData.WORLD_LOCATION[locationId]).map(
                        ([key, value]) => {
                            if (key === "value" || key === "objects" || key === "level" || key === "mob") return;
                            if (key === "lock") {
                                return (
                                    <div key={key} style={style.infoBox}>
                                        <div style={style.infoNameBox}>
                                            <div style={style.infoName}>※ 현재 입장 불가</div>
                                        </div>
                                    </div>
                                )
                            }
                            return (
                                <div key={key} style={style.infoBox}>
                                    <div style={style.infoNameBox} onClick={() => changeFoldInfo(key)}>
                                        <div style={foldInfo === undefined || !foldInfo[key] ? style.buttonFold : style.buttonUnfold}/>
                                        <div style={style.infoName}>{t('worldinfodetail.'+key)}</div>
                                    </div>
                                    <TextList id={key} value={value}/>
                                </div>
                            )
                        }
                    ):
                    // outside
                    Object.entries(WorldData.BIOME_INFO[biome]).map(
                        ([key, value]) => {
                            if (key === "tileId") return;
                            return (
                                <div key={key} style={style.infoBox}>
                                    <div style={style.infoNameBox} onClick={() => changeFoldInfo(key)}>
                                        <div style={foldInfo === undefined || !foldInfo[key] ? style.buttonFold : style.buttonUnfold}/>
                                        <div style={style.infoName}>{t('worldinfodetail.'+key)}</div>
                                    </div>
                                    <TextList id={key} value={value}/>
                                    {/* <TextList id={key} value={key === "remark" ?  : value}/> */}
                                </div>
                            )
                        }
                    )
                }
            </>
        )
    }

    return (
        <>
            <InfoList />
        </>
    )
}

const style = {
    infoBox: {
        width: "100%",
        marginBottom: "10px",
        marginLeft: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
    },
    infoNameBox: {
        marginRight: "16px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "4px",
    },
    infoTextBox: {
        // marginLeft: "12px",
        // marginRight: "16px",
        display: "flex",
        flexDirection: "row",
        // alignItems: "center",
        gap: "3px",
    },
    infoName: {
        fontFamily: "Pretendard",
        fontWeight: "600",
        color: "#000",
    },
    infoText: {
        flex:1,
        overflow: "hidden",
        fontFamily: "Pretendard",
        textOverflow: "ellipsis",
        color: "#000",
    },
    infoNameBoxIcon: {
        width: "18px",
        height: "18px",
        backgroundImage: 'url(' + infoNameIcon + ')',
    },
    infoTextBoxIcon: {
        width: "10px",
        height: "10px",
        marginTop: "5px",
        backgroundImage: 'url(' + infoTextIcon + ')',
    },
    buttonFold: {
        width: "16px",
        height: "16px",
        marginTop: "2px",
        backgroundImage: 'url(' + buttonFold + ')',
    },
    buttonUnfold: {
        width: "16px",
        height: "16px",
        marginTop: "4px",
        backgroundImage: 'url(' + buttonUnfold + ')',
    },
}

export default LocationInfo;