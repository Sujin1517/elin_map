import imgCheckBack from '../assets/elin ui sprite/check_back.png';
import imgCheck from '../assets/elin ui sprite/check.png';

const CheckBox = (props) => {
    const {isCheck, onClick = () => {}} = props;

    return (
            <div style={{...style.checkBox}} onClick={onClick}>
                {isCheck ? <div style={style.checkBoxActive} onClick={onClick}/> : <></>}
            </div>
    )
}


const style = {
    checkBox:{
        width: "24px",
        height: "24px",
        backgroundImage: "url(" + imgCheckBack + ")",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
    },
    checkBoxActive:{
        width: "24px",
        height: "24px",
        backgroundPosition: "center",
        backgroundImage: "url(" + imgCheck + ")",
    }
};

export default CheckBox;