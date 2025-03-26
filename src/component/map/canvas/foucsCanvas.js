
// import WorldData from '../../assets/world/worldData.json'

// const FocusCanvas = (props) => {
//     const { HEADER_MARGIN, tileFocus, mousePos } = props;

// 	const [ctx, setCtx] = useState(null)
// 	const canvasRef = useRef(null);
// 	useEffect(() => {
// 		const canvas = canvasRef.current;
// 		canvas.width = window.innerWidth - SIDE_MARGIN;
// 		canvas.height = window.innerHeight - HEADER_MARGIN;
// 		setCtx(canvas.getContext("2d"));
// 	}, [canvasRef])

// 	const drawTileFocus = (x = mousePos?.pageX, y = mousePos?.pageY) => {
// 		const realScale = (window.innerWidth - SIDE_MARGIN) * mapScale / (CANVAS_WIDTH * 100);
// 		const tileSize = WorldData.TILE_PIXEL_SIZE * realScale;

// 		if (tileFocus !== -1) {
// 			x = tileFocus % WorldData.WORLD_SIZE.x * realScale * WorldData.TILE_PIXEL_SIZE + mapXPos +1;
// 			y = Math.floor(tileFocus / WorldData.WORLD_SIZE.x) * realScale * WorldData.TILE_PIXEL_SIZE + mapYPos +1;
// 		} else {
// 			x -= SIDE_MARGIN;
// 			y -= HEADER_MARGIN;
// 		}

// 		if (ctx) {
// 			ctx.reset();
// 			ctx.globalAlpha = tileFocus === -1 ? 0.5 : 1;
// 			ctx.strokeStyle = "#fff";
// 			ctx.lineWidth = Math.max(2 * realScale, 1);

// 			ctx.roundRect(x - (x - mapXPos) % tileSize, y - (y - mapYPos) % tileSize, tileSize, tileSize, 4 * realScale);
// 			ctx.stroke();
// 		}
// 	}

//     return (
//         <canvas 
//             ref={canvasRef}
//             style={{position:"absolute", top:"0px", left:"0px", height:"calc(100vh - "+HEADER_MARGIN+"px)"}}
//         />
//     );
// }

// export default FocusCanvas;