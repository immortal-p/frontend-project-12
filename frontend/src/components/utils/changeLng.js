import i18next from "i18next"

export default (lng) => {
    i18next.changeLanguage(lng)
    localStorage.setItem('lng', lng)
}