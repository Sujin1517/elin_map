import { useRef, useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
import TileMap from '../../assets/world/world_2.png'
import WorldData from '../../assets/world/worldData.json'
import MapPopup from "./mapPopup";
// import frameImage from "../../assets/elin ui sprite/bg_build.png";


const WorldMap = (props) => {
	// const { showLocationName, changeLoadingProgress } = props;
	const { searchLocation, toggleOptions, changeLoadingProgress } = props;

    const { t, i18n } = useTranslation();

	const [mapFocusCtx, setMapFocusCtx] = useState(null)
	const [locationCtx, setLocationCtx] = useState(null);
	const [guildCtx, setGuildCtx] = useState(null)
	const [festivalCtx, setFestivalCtx] = useState(null);
	const [searchCtx, setSearchCtx] = useState(null);
	const canvasRef = useRef(null);
	const mapCanvasRef = useRef(null);
	const loactionNameCanvasRef = useRef(null);
	const guildCanvasRef = useRef(null);
	const festivalCanvasRef = useRef(null);
	const searchCanvasRef = useRef(null);
	
	const CANVAS_WIDTH = 5904;
	const CANVAS_HEIGHT = 4800;
	const MARGIN = {
		"VERTICAL": 50+31,
		"HORIZON": 31,
		"TOP": 50+16,
		"LEFT": 16
	}

    // biome tile data key-value swap
    const [tileBiomeData, setTileBiomeData] = useState(null);
    useEffect(() => {
        if (tileBiomeData == null) {
            let biomeData = {}
			for (let [key, value] of Object.entries(WorldData.BIOME_INFO)) {
                for(let id of value.tileId) {
                    biomeData[id] = key;
                }
            }
            setTileBiomeData(biomeData);
        }
    }, [tileBiomeData])

	const [mapScale, setMapScale] = useState(600000 / (window.innerWidth - MARGIN.HORIZON));
	const [mapXPos, setMapXPos] = useState(0);
	const [mapYPos, setMapYPos] = useState(0);
	const [mousePos, setMousePos] = useState(null);
	const [isDrag, setIsDrag] = useState(false);
	const [tileFocus, setTileFocus] = useState(-1);
	
    const [popupInfoFold, setPopupInfoFold] = useState(null);
    const changePopupFoldInfo = (key) => {
        let temp = {...popupInfoFold};
        temp[key] = !temp[key];
        setPopupInfoFold(temp)
    }
	const LocationPopup = () => {
		const realScale = (window.innerWidth - MARGIN.HORIZON) * mapScale / (CANVAS_WIDTH * 100);
		const tileSize = WorldData.TILE_PIXEL_SIZE * realScale;
		let x = tileFocus % WorldData.WORLD_SIZE.x * tileSize + mapXPos + tileSize*1.2;
		let y = Math.floor(tileFocus / WorldData.WORLD_SIZE.x) * tileSize + mapYPos;

		let popupInfoFoldInit = {}
		if(popupInfoFold === null) {
			if (WorldData.WORLD_LOCATION[tileFocus] === undefined) {
				// outdoor
				const tileId = WorldData.WORLD_TILE[Math.floor(tileFocus / WorldData.WORLD_SIZE.x)][tileFocus % WorldData.WORLD_SIZE.x];
				if (tileBiomeData[tileId] === undefined) {
					return (<></>);
				}
				for(const [key] of Object.entries(WorldData.BIOME_INFO[tileBiomeData[tileId]])) {
					popupInfoFoldInit[key] = false;
				}
				setPopupInfoFold(popupInfoFoldInit);
				
			} else {
				// location
				for(const [key] of Object.entries(WorldData.WORLD_LOCATION[tileFocus])) {
					popupInfoFoldInit[key] = false;
				}
				setPopupInfoFold(popupInfoFoldInit);
			}
		} else {
			popupInfoFoldInit = popupInfoFold;
		}

		return (
			<MapPopup 
				xPos={x + "px"}
				yPos={y + "px"}
				locationId={tileFocus}
				tileId={WorldData.WORLD_TILE[Math.floor(tileFocus / WorldData.WORLD_SIZE.x)][tileFocus % WorldData.WORLD_SIZE.x]}
				tileBiomeData={tileBiomeData}
				popupInfoFold={popupInfoFoldInit}
				changePopupFoldInfo={changePopupFoldInfo}
			/>
		);
	}


	const mouseDown = (e) => {
		e.preventDefault();
		setMousePos(e);
	}
	const mouseLeave = () => {
		setIsDrag(false);
		if (tileFocus === -1) mapFocusCtx.reset();
	}
	const mouseMove = (e) => {
		if (e.buttons === 1) {
			setIsDrag(true)
			setMousePos(e);
			if(mousePos !== null) moveMap(e.pageX - mousePos.pageX, e.pageY - mousePos.pageY);
		}
		if (tileFocus === -1) {
			drawTileFocus(e.pageX, e.pageY);
		}
	}
	const mouseWheel = (e) => {
		setMousePos(e);
		let screenWitdh = window.innerWidth - MARGIN.HORIZON;
		let screenHeight = window.innerHeight - MARGIN.VERTICAL;
		let scale = 0;
		
		// workaround to resolve interference between drag and wheel
		if (isDrag) return;

		// zoom out
		if (e.deltaY > 0) {
			// limit = screen max
			if ((screenWitdh * (mapScale - mapScale*0.07) / 100) < screenWitdh ||
				(screenWitdh * (mapScale - mapScale*0.07) / 100 * 0.813) < screenHeight) {
				scale = screenWitdh * 0.813 > screenHeight ? 100 : 100 / 0.813 * screenHeight / screenWitdh;
				moveMap(-mapXPos, 0, scale);
			} else {
				scale = mapScale - mapScale*0.07;
				moveMap(-(mapXPos - e.clientX + MARGIN.LEFT)*0.07, -(mapYPos - e.clientY + MARGIN.TOP)*0.07, scale);
			};
			
		// zoom in
		} else {
			// limit = x3 ( 1771200 = CANVAS_WIDTH * x3 * 100% )
			if (screenWitdh * (mapScale + mapScale*0.07) / 100 / CANVAS_WIDTH > 3) {
				scale = 1771200 / screenWitdh;
				setMapXPos(mapXPos + (mapXPos - e.clientX + MARGIN.HORIZON)*(scale - mapScale)/mapScale);
				setMapYPos(mapYPos + (mapYPos - e.clientY + MARGIN.VERTICAL)*(scale - mapScale)/mapScale);
			} else {
				scale = mapScale + mapScale*0.07;
				setMapXPos(mapXPos + (mapXPos - e.clientX + MARGIN.HORIZON)*0.07);
				setMapYPos(mapYPos + (mapYPos - e.clientY + MARGIN.VERTICAL)*0.07);
			} 
		}
		setMapScale(scale);
	}
	const mouseLeftClick = (e) => {
		// debug
		// console.log("key", Math.floor((-mapYPos + e.pageY-MARGIN.LEFT) / tileSize) * WorldData.WORLD_SIZE.x + Math.floor((-mapXPos + e.pageX-MARGIN.TOP) / tileSize))

		e.preventDefault();
		if (!isDrag){
			if (tileFocus === -1) {
				let realScale = (window.innerWidth - MARGIN.HORIZON) * mapScale / (CANVAS_WIDTH * 100);
				let tileSize = 48 * realScale;
				setTileFocus(Math.floor((-mapYPos + e.pageY-MARGIN.TOP) / tileSize) * WorldData.WORLD_SIZE.x + Math.floor((-mapXPos + e.pageX-MARGIN.LEFT) / tileSize));
			} else {
				setTileFocus(-1);
				setPopupInfoFold(null);
			}
		};
		setIsDrag(false);
	}
	const mouseRightClick = (e) => {
		e.preventDefault();
	}

	const moveMap = (dx, dy, ds = mapScale) => {
		let x = mapXPos + dx;
		let y = mapYPos + dy;
		let screenWitdh = window.innerWidth - MARGIN.HORIZON;
		let screenHeight = window.innerHeight - MARGIN.VERTICAL;

		if (dx !== 0 && x > 0) {
			setMapXPos(0);
		} else {
			let xLimit = (screenWitdh * ds / 100) - screenWitdh;
			if (x < -xLimit) {
				setMapXPos(-xLimit);
			} else {
				setMapXPos(x);
			}
		}

		if (dy !== 0 && y > 0) {
			setMapYPos(0);
		} else {
			let yLimit = (screenWitdh * ds / 100 * 0.813) - screenHeight;
			if (y < -yLimit) {
				setMapYPos(-yLimit);
			} else {
				setMapYPos(y);
			}
		}
	}

	const drawTileFocus = (x = mousePos?.pageX, y = mousePos?.pageY) => {
		const realScale = (window.innerWidth - MARGIN.HORIZON) * mapScale / (CANVAS_WIDTH * 100);
		const tileSize = WorldData.TILE_PIXEL_SIZE * realScale;

		if (tileFocus !== -1) {
			x = tileFocus % WorldData.WORLD_SIZE.x * realScale * WorldData.TILE_PIXEL_SIZE + mapXPos +1;
			y = Math.floor(tileFocus / WorldData.WORLD_SIZE.x) * realScale * WorldData.TILE_PIXEL_SIZE + mapYPos +1;
		} else {
			x -= MARGIN.LEFT;
			y -= MARGIN.TOP;
		}

		if (mapFocusCtx) {
			mapFocusCtx.reset();
			mapFocusCtx.globalAlpha = tileFocus === -1 ? 0.5 : 1;
			mapFocusCtx.strokeStyle = "#fff";
			mapFocusCtx.lineWidth = Math.max(2 * realScale, 1);

			mapFocusCtx.roundRect(x - (x - mapXPos) % tileSize, y - (y - mapYPos) % tileSize, tileSize, tileSize, 4 * realScale);
			mapFocusCtx.stroke();
		}
	}

	const drawLocationName = () => {
		if (locationCtx) {
			const realScale = (window.innerWidth - MARGIN.HORIZON) * mapScale / (CANVAS_WIDTH * 100);
			const tileSize = WorldData.TILE_PIXEL_SIZE * realScale;

			locationCtx.reset();
			locationCtx.fillStyle = "#fff";
			locationCtx.strokeStyle = "#000";
			locationCtx.lineWidth = Math.max(3, 4.5 * realScale);
			locationCtx.font = "600 " + Math.max(12, 16 * realScale) + "pt Pretendard";
			locationCtx.textAlign = "center";
			locationCtx.textBaseline = "bottom";
	
			// draw location name
			for (let [key, name] of Object.entries(WorldData.WORLD_LOCATION)) {

				let x = key % WorldData.WORLD_SIZE.x * realScale * WorldData.TILE_PIXEL_SIZE + mapXPos + tileSize/2;
				let y = Math.floor(key / WorldData.WORLD_SIZE.x) * realScale * WorldData.TILE_PIXEL_SIZE + mapYPos + tileSize*0.1;
	
				// looks better with other info
				if (name.value === "arena" || name.value === "lumiestcrator") {
					locationCtx.textBaseline = "top";
					y += tileSize*0.7;
				} else {
					locationCtx.textBaseline = "bottom";
				}
	
				locationCtx.strokeText(t('worldinfo.' + name.value + '.name'), x, y);
				locationCtx.fillText(t('worldinfo.' + name.value + '.name'), x, y);
			}
		}
	}

	const drawGuild = () => {
		if (guildCtx) {
			const realScale = (window.innerWidth - MARGIN.HORIZON) * mapScale / (CANVAS_WIDTH * 100);
			const tileSize = WorldData.TILE_PIXEL_SIZE * realScale;

			guildCtx.reset();
			guildCtx.fillStyle = "#fff";
			guildCtx.strokeStyle = "#000";
			guildCtx.lineWidth = Math.max(3, 4.5 * realScale);
			guildCtx.font = "600 " + Math.max(12, 16 * realScale) + "pt Pretendard";
			guildCtx.textAlign = "center";
	
			// draw guild location
			for (let [name, location] of Object.entries(WorldData.GUILD_LOCATION)) {
				let x = location % WorldData.WORLD_SIZE.x * realScale * WorldData.TILE_PIXEL_SIZE + mapXPos
				let y = Math.floor(location / WorldData.WORLD_SIZE.x) * realScale * WorldData.TILE_PIXEL_SIZE + mapYPos

				guildCtx.beginPath();
				guildCtx.save();
				guildCtx.translate(x + tileSize/2, y + tileSize/2);
				guildCtx.rotate(Math.PI / 4);
				guildCtx.roundRect((2*realScale)-tileSize/2, (2*realScale)-tileSize/2, tileSize-(4*realScale), tileSize-(4*realScale), tileSize/8);
				guildCtx.lineWidth = Math.max(7, 8 * realScale);
				guildCtx.strokeStyle = "#000";
				guildCtx.stroke();
				guildCtx.lineWidth = Math.max(3, 3 * realScale);
				guildCtx.strokeStyle = "#0af";
				guildCtx.stroke();
				guildCtx.restore();


				guildCtx.fillStyle = "#0af";
				guildCtx.strokeStyle = "#000";
				guildCtx.lineWidth = Math.max(3, 4.5 * realScale);
				guildCtx.font = "600 " + Math.max(12, 16 * realScale) + "pt Pretendard";
				guildCtx.textAlign = "center";
				guildCtx.textBaseline = "top";
				
				guildCtx.strokeText(t('guild.' + name), x + tileSize/2, y + tileSize);
				guildCtx.fillText(t('guild.' + name), x + tileSize/2, y + tileSize);
			}
		}
	}

	const drawFestival = () => {
		if (festivalCtx) {
			const realScale = (window.innerWidth - MARGIN.HORIZON) * mapScale / (CANVAS_WIDTH * 100);
			const tileSize = WorldData.TILE_PIXEL_SIZE * realScale;

			festivalCtx.reset();
			festivalCtx.fillStyle = "#fff";
			festivalCtx.strokeStyle = "#000";
			festivalCtx.lineWidth = Math.max(3, 4.5 * realScale);
			festivalCtx.font = "600 " + Math.max(12, 16 * realScale) + "pt Pretendard";
			festivalCtx.textAlign = "center";
	
			// draw festival location
			for (let [name, location] of Object.entries(WorldData.FESTIVAL_LOCATION)) {
				let x = location % WorldData.WORLD_SIZE.x * realScale * WorldData.TILE_PIXEL_SIZE + mapXPos
				let y = Math.floor(location / WorldData.WORLD_SIZE.x) * realScale * WorldData.TILE_PIXEL_SIZE + mapYPos

				festivalCtx.beginPath();
				// festivalCtx.roundRect(x+(2*realScale), y+(2*realScale), tileSize-(4*realScale), tileSize-(4*realScale), tileSize/2);
				festivalCtx.roundRect(x+(2*realScale)+(2*realScale), y+(2*realScale)+(2*realScale), tileSize-(8*realScale), tileSize-(8*realScale), tileSize/2);
				festivalCtx.lineWidth = Math.max(8 * realScale, 7);
				festivalCtx.strokeStyle = "#000";
				festivalCtx.stroke();
				festivalCtx.lineWidth = Math.max(3 * realScale, 3);
				festivalCtx.strokeStyle = "#fc0";
				festivalCtx.stroke();

				festivalCtx.fillStyle = "#fc0";
				festivalCtx.strokeStyle = "#000";
				festivalCtx.lineWidth = Math.max(3, 4.5 * realScale);
				festivalCtx.font = "600 " + Math.max(12, 16 * realScale) + "pt Pretendard";
				festivalCtx.textAlign = "center";
				festivalCtx.textBaseline = "top";
				
				festivalCtx.strokeText(t('festival.' + name), x + tileSize/2, y + tileSize);
				festivalCtx.fillText(t('festival.' + name), x + tileSize/2, y + tileSize);
			}
		}
	}

	const drawSearchLocations = () => {
		if (searchCtx) {
			const realScale = (window.innerWidth - MARGIN.HORIZON) * mapScale / (CANVAS_WIDTH * 100);
			const tileSize = WorldData.TILE_PIXEL_SIZE * realScale;

			searchCtx.reset();

			// draw festival location
			for (const location of searchLocation) {
				let x = location % WorldData.WORLD_SIZE.x * realScale * WorldData.TILE_PIXEL_SIZE + mapXPos
				let y = Math.floor(location / WorldData.WORLD_SIZE.x) * realScale * WorldData.TILE_PIXEL_SIZE + mapYPos

				searchCtx.rect(x+(2*realScale), y+(2*realScale), tileSize-(4*realScale), tileSize-(4*realScale));
				searchCtx.lineWidth = Math.max(8 * realScale, 7);
				searchCtx.strokeStyle = "#000";
				searchCtx.stroke();
				searchCtx.lineWidth = Math.max(3 * realScale, 3);
				searchCtx.strokeStyle = "#f00";
				searchCtx.stroke();
			}
		}
	}

	// resizing canvas when resize screen
	const handleResize = () => {
		const canvas = canvasRef.current;
		canvas.width = window.innerWidth - MARGIN.VERTICAL;
		canvas.height = window.innerHeight - MARGIN.HORIZON;

		const locationCanvas = loactionNameCanvasRef.current;
		locationCanvas.width = window.innerWidth - MARGIN.HORIZON;
		locationCanvas.height = window.innerHeight - MARGIN.VERTICAL;

		drawTileFocus();
		drawLocationName();
		drawGuild();
		drawFestival();
		drawSearchLocations();

		// how do this?? need rescaling map
		// setMapScale(600000 / (window.innerWidth - MARGIN.HORIZON));
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = window.innerWidth - MARGIN.HORIZON;
		canvas.height = window.innerHeight - MARGIN.VERTICAL;
		setMapFocusCtx(canvas.getContext("2d"));

		const locationCanvas = loactionNameCanvasRef.current;
		locationCanvas.width = window.innerWidth - MARGIN.HORIZON;
		locationCanvas.height = window.innerHeight - MARGIN.VERTICAL;
		setLocationCtx(locationCanvas.getContext("2d"));
		
		const guildCanvas = guildCanvasRef.current;
		guildCanvas.width = window.innerWidth - MARGIN.HORIZON;
		guildCanvas.height = window.innerHeight - MARGIN.VERTICAL;
		setGuildCtx(guildCanvas.getContext("2d"));
		
		const festivalCanvas = festivalCanvasRef.current;
		festivalCanvas.width = window.innerWidth - MARGIN.HORIZON;
		festivalCanvas.height = window.innerHeight - MARGIN.VERTICAL;
		setFestivalCtx(festivalCanvas.getContext("2d"));

		const searchCanvas = searchCanvasRef.current;
		searchCanvas.width = window.innerWidth - MARGIN.HORIZON;
		searchCanvas.height = window.innerHeight - MARGIN.VERTICAL;
		setSearchCtx(searchCanvas.getContext("2d"));
		
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		}
	}, [])

	useEffect(() => {
		const mapCanvas = mapCanvasRef.current;
		mapCanvas.width = CANVAS_WIDTH;
		mapCanvas.height = CANVAS_HEIGHT;

		const mapCtx = mapCanvas.getContext("2d");
		const tileImage = new Image();
		tileImage.src = TileMap;


		// set center at first home
		setMapXPos(-((window.innerWidth - MARGIN.LEFT) * mapScale / 100) * 0.2642 + (window.innerWidth - MARGIN.TOP) / 2);
		setMapYPos(-((window.innerWidth - MARGIN.LEFT) * mapScale / 100 * 0.813) * 0.765 + (window.innerHeight - MARGIN.LEFT) / 2);

		// debug
		// console.log("screen width", window.innerWidth - MARGIN.HORIZON);	// canvas div box width
		// console.log("screen height", window.innerHeight - MARGIN.VERTICAL);	// canvas div box div height
		// console.log("canvas width", (window.innerWidth - MARGIN.HORIZON) * mapScale / 100);			// cavas map image width
		// console.log("canvas height", (window.innerWidth - MARGIN.HORIZON) * mapScale / 100 * 0.813);	// canvs map image height

		// draw worldmap
		tileImage.onload = () => {
			const TRAIN_MAP = WorldData.WORLD_TILE;
			const OBJECT_MAP = WorldData.WORLD_TILE_OBJECT;
			const TILE_SIZE = WorldData.TILE_PIXEL_SIZE;
			const TILE_NUM = Math.floor(tileImage.width / TILE_SIZE);

			// draw train
			for (let y = 0; y < TRAIN_MAP.length; y++) {
				for(let x = 0; x < TRAIN_MAP[0].length; x++) {
					mapCtx.drawImage(
						tileImage, 
						TRAIN_MAP[y][x] % TILE_NUM * TILE_SIZE,
						Math.floor(TRAIN_MAP[y][x] / TILE_NUM) * TILE_SIZE,
						TILE_SIZE,
						TILE_SIZE,
						x * TILE_SIZE,
						y * TILE_SIZE,
						TILE_SIZE,
						TILE_SIZE
					);
				}
			}

			// draw objects
			for (let y = 0; y < OBJECT_MAP.length; y++) {
				for(let x = 0; x < OBJECT_MAP[0].length; x++) {
					if (OBJECT_MAP[y][x] === 0) continue;
					mapCtx.drawImage(
						tileImage, 
						OBJECT_MAP[y][x] % TILE_NUM * TILE_SIZE,
						Math.floor(OBJECT_MAP[y][x] / TILE_NUM) * TILE_SIZE,
						TILE_SIZE,
						TILE_SIZE,
						x * TILE_SIZE,
						y * TILE_SIZE,
						TILE_SIZE,
						TILE_SIZE
					);
				}
			}

			changeLoadingProgress();
		}
	}, [mapCanvasRef])

	// update focus when map scale change
	useEffect(() => {
		drawTileFocus();
		if (toggleOptions.locationName) drawLocationName();
		if (toggleOptions.guildLocation) drawGuild();
		if (toggleOptions.festivalInfo) drawFestival();
		drawSearchLocations();
	}, [mapScale, tileFocus, mapXPos, mapYPos, i18n.language])

	useEffect(() => {
		drawSearchLocations();
	}, [searchLocation])

	useEffect(() => {
		if (toggleOptions.locationName) {
			drawLocationName();
		} else {
			locationCtx?.reset();
		}

		if (toggleOptions.guildLocation) {
			drawGuild();
		} else {
			guildCtx?.reset();
		}

		if (toggleOptions.festivalInfo) {
			drawFestival();
		} else {
			festivalCtx?.reset();
		}

	}, [toggleOptions])

	return (
		<div style={{position: "relative"}}>
			<canvas 
				ref={mapCanvasRef}
				style={{position:"absolute", top:mapYPos+"px", left:mapXPos+"px", width:mapScale+"%"}}
			/>
			<canvas 
				ref={guildCanvasRef}
				style={{position:"absolute", top:"0px", left:"0px", height:"calc(100vh - "+MARGIN.VERTICAL+"px)"}}
			/>
			<canvas 
				ref={festivalCanvasRef}
				style={{position:"absolute", top:"0px", left:"0px", height:"calc(100vh - "+MARGIN.VERTICAL+"px)"}}
			/>
			<canvas 
				ref={searchCanvasRef}
				style={{position:"absolute", top:"0px", left:"0px", height:"calc(100vh - "+MARGIN.VERTICAL+"px)"}}
			/>
			{<canvas
				ref={loactionNameCanvasRef}
				style={{position:"absolute", top:"0px", left:"0px", height:"calc(100vh - "+MARGIN.VERTICAL+"px)"}}
			/>}
			<canvas 
				ref={canvasRef}
				style={{position:"absolute", top:"0px", left:"0px", height:"calc(100vh - "+MARGIN.VERTICAL+"px)"}}
			/>
			<div
				style={{position:"absolute", top:"0px", left:"0px", width:"100%", height:"100%", height:"calc(100vh - "+MARGIN.VERTICAL+"px)",
					// boxSizing: "border-box",
					// borderImage: "url("+frameImage+")",
					// borderWidth: "16px 15px 15px 16px",
					// borderImageSlice: "16 15 15 16",
					// borderStyle: "solid",
					// borderImageRepeat: "repeat"
				}}
				onMouseDown={mouseDown}
				onMouseLeave={mouseLeave}
				onMouseMove={mouseMove}
				onWheel={mouseWheel}
				onClick={mouseLeftClick}
				onContextMenu={mouseRightClick}
			/>
			{tileFocus === -1 ? <></> : <LocationPopup />}
		</div>
	);
};

export default WorldMap;