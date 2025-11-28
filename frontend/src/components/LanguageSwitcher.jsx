import i18next from "i18next";
import changeLng from "./utils/changeLng";
import { ButtonGroup, Button } from "react-bootstrap";
import { useTranslation } from 'react-i18next'

export default () => {
    const { t } = useTranslation()

    return (
        <ButtonGroup className='m-1'>
              <Button
                onClick={() => changeLng('en')}
                className={i18next.language === 'en'
                  ? 'bg-primary'
                  : 'bg-light text-primary'} 
                disabled={i18next.language === 'en'}
                >
                  {t('lngEn')}
                </Button>
              <Button
                onClick={() => changeLng('ru')}
                className={i18next.language === 'ru'
                  ? 'bg-primary'
                  : 'bg-light text-primary'}
                disabled={i18next.language === 'ru'}
                >
                  {t('lngRu')}
                </Button>
        </ButtonGroup>
    )
}