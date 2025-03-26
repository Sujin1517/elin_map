import { useState } from "react";
import { useTranslation } from "react-i18next";

const DamageCalc = () => {

    const { t } = useTranslation();


    const [weapon, setWeapon] = useState("longSword");
    const [stat, setStat] = useState("strength");
    const [combatSkill, setCombatSkill] = useState("tactics");
    const [hands, setHands] = useState("twoHanded");
    const WEAPON_LIST = [
        "longSword",
        "axe",
        "sickle",
        "martialWeapon",
        "staff",
        "polearm",
        "mace",
        "shortSword",
        "throwable",
        "range",
    ]


    return (
        <div style={{height:"calc(100vh - 50px - 31px)"}}>
            {t('alert.inProgress')}
        </div>
    );
}

export default DamageCalc;