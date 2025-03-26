import { useContext, useEffect, useState } from "react";
import { MouseContext } from "./cursor/mouseContext";
import { useTranslation } from "react-i18next";
import WorldData from '../assets/world/worldData.json';
import lightInner from "../assets/elin ui sprite/light_inner_fix.png";
import deco2 from "../assets/elin ui sprite/deco2.png";
import deco4 from "../assets/elin ui sprite/deco4.png";
import iconSearch from "../assets/elin ui sprite/icon_Search.png";
import iconMap from "../assets/elin ui sprite/icon_LayerGlobalMap.png";
import iconSearchButton from "../assets/elin ui sprite/icon_menu_0_search.png";
import iconHp from "../assets/elin ui sprite/icon_hp.png";
import iconMp from "../assets/elin ui sprite/icon_mp.png";
import iconSp from "../assets/elin ui sprite/icon_sp.png";
import CheckBox from "./checkBox.js";

const SideBar = (props) => {
	// const { setShowLocationName, showLocationName, changeLoadingProgress} = props;
	const { changeToggleState, toggleList, changeSearchList, changeLoadingProgress} = props;

    const { cursorChangeHandler } = useContext(MouseContext);
    const { t, i18n } = useTranslation();

	useEffect(() => {
		const sideBoxImage = new Image();
		sideBoxImage.src = lightInner;
		sideBoxImage.onload = () => changeLoadingProgress();
	}, [])

	const [searchValue, setSearchValue] = useState({
		"skill": "",
		"facility": "",
		"merchant": ""
	})
	
	const changeSearch = (e, v) => {
		e.preventDefault();
		const data = new FormData(e.target);
		let tempData = {...searchValue};
		tempData[v] = data.get("value");
		setSearchValue(tempData);
	}

	const [usingData, setUsingData] = useState(null);
	useEffect(() => {
		const fetchJson = () => {
			fetch(process.env.PUBLIC_URL + '/locales/' + i18n.language + '/translation.json')
			.then(response => {
				return response.json();
			}).then(data => {
				setUsingData(data);
			}).catch((e) => {
				console.log(e.message)
			});
		}
		console.log("fetchJson")
		fetchJson();
	}, [i18n.language])


	useEffect(() => {
		if (usingData === null) return;

		let tempList = []
		// skill
		for(const [key, value] of Object.entries(usingData.skill)) {
			if (value == searchValue.skill) {
				for (const [location, data] of Object.entries(WorldData.WORLD_LOCATION)) {
					if (data.skill === undefined) {
						continue;
					}
					if (data.skill.includes(key)) {
						tempList.push(location);
					}
				}
				break;
			}
		}
		
		// facility
		for(const [key, value] of Object.entries(usingData.facility)) {
			if (value == searchValue.facility) {
				for (const [location, data] of Object.entries(WorldData.WORLD_LOCATION)) {
					if (data.facility === undefined) {
						continue;
					}
					if (data.facility.includes(key)) {
						tempList.push(location);
					}
				}
				break;
			}
		}

		// merchant
		for(const [key, value] of Object.entries(usingData.merchant)) {
			if (value == searchValue.merchant) {
				for (const [location, data] of Object.entries(WorldData.WORLD_LOCATION)) {
					if (data.merchant === undefined) {
						continue;
					}
					if (data.merchant.includes(key)) {
						tempList.push(location);
					}
				}
				break;
			}
		}

		changeSearchList(tempList);
	}, [searchValue])



	const OptionItem = (props) => {
		const {onClick, isCheck, text} = props;

		return (
			<div style={style.optionButton} onClick={onClick} 
				onMouseLeave={() => cursorChangeHandler("Normal")}
				onMouseEnter={() => cursorChangeHandler("Hovered")}
			>
				·
				<CheckBox isCheck={isCheck}/>
				{t('side.options.'+text)}
			</div>
		);
	}

	const OptionSearch = (props) => {
		const {text} = props;

		return (
			<div style={style.optionSearchBox}>
				<div style={{fontFamily:"Pretendard"}}>· {t('side.options.search'+text)}</div>
				<form style={style.optionSearchForm} onSubmit={(e) => changeSearch(e, text)}>
					<input style={style.optionSearchInput} name="value" defaultValue={searchValue[text]}/>
					<button style={style.iconSearchButton} />
				</form>
			</div>
		);
	}

	return (
		<div style={style.sideBox}>
			<div style={{...style.sideContainer, ...style.lightInner}}>
				{/* <div style={style.alertText}>{t('side.description.text')}</div> */}
				<div style={style.boxTitleText}>{t('side.description.title')}</div>
				<div style={style.optionCategory}>
					<div style={style.optionCategoryTitle}>
						<div style={style.iconMap}/>
						<div style={style.optionCategoryTitleText}>{t('side.options.showSetting')}</div>
					</div>
					<div style={{marginLeft:"10px"}}>
						<OptionItem onClick={() => changeToggleState("locationName")} isCheck={toggleList.locationName} text={"showLocationName"}/>
						<div style={style.optionSearchForm}>
							<OptionItem onClick={() => changeToggleState("guildLocation")} isCheck={toggleList.guildLocation} text={"showGuildLocation"}/>
							{toggleList.guildLocation ? <div style={style.iconBlue}/> : <></>}
						</div>
						<div style={style.optionSearchForm}>
							<OptionItem onClick={() => changeToggleState("festivalInfo")} isCheck={toggleList.festivalInfo} text={"showFestivalInfo"}/>
							{toggleList.festivalInfo ? <div style={style.iconYellow}/> : <></>}
						</div>
					</div>
				</div>
				<div style={style.optionCategory}>
					<div style={style.optionCategoryTitle}>
						<div style={style.iconSearch}/>
						<div style={style.optionCategoryTitleText}>{t('side.options.searchSetting')}</div>
						{searchValue.skill === "" && searchValue.facility === "" && searchValue.merchant === "" ? <></> : <div style={style.iconRed}/>}
					</div>
					<div style={{marginLeft:"10px"}}>
						<OptionSearch text="skill" />
						<OptionSearch text="facility" />
						<OptionSearch text="merchant" />
					</div>
				</div>
			</div>

			<div style={{...style.deco4, top:"5px", left:"-7px"}}/>
		</div>
	);
};

const style = {
	sideBox: {
		width:"auto",
		height:"auto",
	},

	sideContainer: {
		display:"flex",
		flexDirection:"column",
		gap:"3px",
        pointerEvents:"all",
		width:"320px",
		minHeight: "240px",
		margin:"18px",
		fontFamily: "Pretendard",
		fontSize: "16px",
	},

    optionButton: {
		width: "fit-content",
		display:"flex",
		flexDirection:"row",
		alignItems:"center",
        cursor: "pointer",
		fontFamily:"Pretendard"
    },

	alertText: {
		textAlign: "center",
		color: "#d00",
		fontWeight: "500",
	},
	boxTitleText: {
		margin:"10px",
		marginTop: "6px",
        fontFamily: "Pretendard",
		textAlign: "center",
		fontSize: "22px",
		fontWeight: "600",
	},

	optionCategory: {
		marginBottom: "5px",
	},
	optionCategoryTitle: {
		display:"flex", 
		alignItems: "center",
		gap:"5px",
        fontFamily: "Pretendard",
	},
	optionCategoryTitleText: {
		fontFamily: "Pretendard",
		fontSize:"18px", 
		fontWeight:"600"
	},

	optionSearchBox: {
		display:"flex", 
		flexDirection:"row", 
		gap:"5px", 
		justifyContent:"space-between", 
		alignItems:"center", 
		marginLeft:"5px"
	},
	optionSearchForm: {
		display:"flex", 
		flexDirection:"row", 
		alignItems: "center",
		gap:"2px"
	},
	optionSearchInput: {
		width:"100px",
		marginBottom:"4px",
		borderRadius: "5px",
		border: "solid #663E1540",
		borderWidth: "0px 0px 2px 0px",
		backgroundColor: "#663E1520",
        // fontFamily: "Pretendard",
		textAlign: "right",
	},

	lightInner: {
		position: "relative",
		boxSizing: "border-box",
		borderStyle: "solid",
		borderWidth: "20px",
		borderImage: 'url(' + lightInner + ')',
		borderImageSlice: "20 fill",
		borderImageRepeat: "round"
	},
	deco2: {
		position: "absolute",
		width: "215px",
		height: "49px",
		backgroundImage: "url(" + deco2 + ")",
		backgroundSize: "100%",
		backgroundPosition: "center",
  		backgroundRepeat: "no-repeat",
	},
	deco4: {
		position: "absolute",
		width: "92px",
		height: "84px",
		backgroundImage: "url(" + deco4 + ")",
		backgroundSize: "100%",
		backgroundPosition: "center",
  		backgroundRepeat: "no-repeat",
	},
	iconSearch: {
		width: "28px",
		height: "26px",
		backgroundImage: "url(" + iconSearch + ")",
		backgroundSize: "100%",
		backgroundPosition: "center",
  		backgroundRepeat: "no-repeat",
	},
	iconSearchButton: {
		width: "22px",
		height: "22px",
		border: "none",
		background: "none",
		backgroundImage: "url(" + iconSearchButton + ")",
		backgroundSize: "100%",
		backgroundPosition: "center",
  		backgroundRepeat: "no-repeat",
		cursor: "pointer",
	},
	iconMap: {
		width: "28px",
		height: "26px",
		backgroundImage: "url(" + iconMap + ")",
		backgroundSize: "100%",
		backgroundPosition: "center",
  		backgroundRepeat: "no-repeat",
	},
	iconRed: {
		width: "14px",
		height: "15px",
		border: "none",
		background: "none",
		backgroundImage: "url(" + iconHp + ")",
		backgroundSize: "100%",
		backgroundPosition: "center",
  		backgroundRepeat: "no-repeat",
	},
	iconBlue: {
		width: "14px",
		height: "15px",
		border: "none",
		background: "none",
		backgroundImage: "url(" + iconMp + ")",
		backgroundSize: "100%",
		backgroundPosition: "center",
  		backgroundRepeat: "no-repeat",
	},
	iconYellow: {
		width: "14px",
		height: "15px",
		border: "none",
		background: "none",
		backgroundImage: "url(" + iconSp + ")",
		backgroundSize: "100%",
		backgroundPosition: "center",
  		backgroundRepeat: "no-repeat",
	}
	// iconElement: {
	// 	width: "18px",
	// 	height: "18px",
	// 	backgroundImage: "url(" + iconElement + ")",
	// 	backgroundSize: "100%",
	// 	backgroundPosition: "center",
  	// 	backgroundRepeat: "no-repeat",
	// },
}

export default SideBar;