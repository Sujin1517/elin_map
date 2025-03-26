import { useState } from 'react';
import SideBar from '../../component/sideBar.js';
import WorldMap from '../../component/map/worldMap.js';
import iconNotice from '../../assets/elin ui sprite/icon_notice.png';
import NoticeFrame from '../../assets/elin ui sprite/light_frame_fill.png';
import { useTranslation } from 'react-i18next';

const InfoMap = () => {

    const { t } = useTranslation();

    const [toggleNotice, setToggleNotice] = useState(false);
    const [searchLocation, setSearchLocation] = useState([]);
	const [toggleOptions, setToggleOptions] = useState({
        locationName:false,
        guildLocation:false,
        festivalInfo:false,
    });
    const changeToggleOptions = (option) => {
        let temp = {...toggleOptions};
        temp[option] = !temp[option];
        setToggleOptions(temp);
    }


    const [loadingProgress, setLoadingProgress] = useState(2); //2
    const changeLoadingProgress = async () => {
        setLoadingProgress(loadingProgress => loadingProgress-1);
    }

    return (
        <div style={style.infoMapBox}>
            <div style={loadingProgress === 0 ? 
                {transition: "opacity 0.5s", opacity:1} : 
                {transition: "opacity 0.5s", opacity:0}
            }>
                <div style={style.infoMapWorld}>
                    <WorldMap 
                        searchLocation={searchLocation}
                        toggleOptions={toggleOptions} 
                        changeLoadingProgress={changeLoadingProgress}
                    />
                </div>
                <div style={style.infoSideBox}>
                    {/* <SideBar
                        showLocationName={showLocationName}
                        setShowLocationName={changeShowLocationNameOption}
                        changeLoadingProgress={changeLoadingProgress}
                    /> */}
                    <SideBar
                        changeToggleState={changeToggleOptions}
                        toggleList={toggleOptions}
                        changeLoadingProgress={changeLoadingProgress}
                        changeSearchList={setSearchLocation}
                    />
                </div>
                <div style={style.noticeBox}>
                    <div style={style.iconNotice} onClick={() => setToggleNotice(!toggleNotice)}/>
                    {toggleNotice ? 
                        <div style={style.noticeBg}>
                            <div style={style.noticeContentLine}>
                                <div style={style.noticeText}>
                                    {t('notice.tell')}
                                </div>
                                <a href='https://discordapp.com/users/530921304547917835' target='_black'>
                                    [{t('notice.link')}]
                                </a>
                            </div>
                            <div style={style.noticeText}>
                                {t('notice.text')}
                            </div>
                            <div style={style.noticeText}>
                                {t('notice.updateLog')}
                            </div>
                        </div>
                    : <></>}
                </div>
            </div>
        </div>
    );
}

const style = {
    infoMapBox: {
		height:"calc(100vh - 50px - 31px)",
        display: "flex",
        overflow: "hidden",
        flexDirection:"row",
        position: "relative",
    },
    infoSideBox: {
        pointerEvents:"none",
        height: "100%",
        position:"absolute",
    },
    infoMapWorld: {
        width:"100%",
        height:"100%",
        flex: 1,
        overflow: "hidden",
        backgroundColor: "#000",
        position:"absolute",
    },
    noticeBox: {
        position:"absolute",
        top: "10px",
        right: "10px",
    },
    noticeBg: {
        position:"absolute",
        width: "max-content",
        top: "0px",
        right: "33px",
        padding: "5px",
        display: "flex",
        flexDirection: "column",
        gap: "7px",
		boxSizing: "border-box",
		borderStyle: "solid",
		borderWidth: "12px 11px",
		borderImage: 'url(' + NoticeFrame + ')',
		borderImageSlice: "12 11 fill",
		borderImageRepeat: "repeat"
    },
    noticeContentLine: {
        display:"flex",
        flexDirection:"row",
        alignItems: "center"
    },
    noticeText: {
        fontFamily: "Pretendard",
        whiteSpace: "pre-wrap"
    },
	iconNotice: {
		width: "28px",
		height: "33px",
		border: "none",
		background: "none",
		backgroundImage: "url(" + iconNotice + ")",
		backgroundSize: "100%",
		backgroundPosition: "center",
  		backgroundRepeat: "no-repeat",
        cursor: "pointer",
	}
}

export default InfoMap;