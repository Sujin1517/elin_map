import { useTranslation } from "react-i18next";

const TreasureMap = () => {

    const { t } = useTranslation();

    return (
        <div>
            {t('alert.inProgress')}
        </div>
    );
}

export default TreasureMap;