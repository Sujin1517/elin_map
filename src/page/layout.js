import { Outlet } from "react-router-dom";
import MouseContextProvider from '../component/cursor/mouseContext.js';
import CustomCursor from "../component/cursor/customCursor.js";
import Header from "../component/header/header.js";
import frameImage from "../assets/elin ui sprite/bg_build_fix.png";

const Layout = () => {
	return (
		// <MouseContextProvider>
			<div>
				<header>
					<Header />
				</header>
				<main style={style.OutletFrame}>
					<Outlet />
				</main>
				{/* <CustomCursor /> */}
			</div>
		// </MouseContextProvider>
	);
};

const style = {
	OutletFrame: {
		// width:"calc(100% - 31px)",
		height:"calc(100% - 500px)",
		boxSizing: "border-box",
		borderImage: "url("+frameImage+")",
		borderWidth: "16px 15px 15px 16px",
		borderImageSlice: "16 15 15 16",
		borderStyle: "solid",
		borderImageRepeat: "repeat",
	},
}

export default Layout;