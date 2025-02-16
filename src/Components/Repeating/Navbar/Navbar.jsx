import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { handleAuthStateChange, handleLanguageChange } from "./navbarFunctions"
import { ThreeDots } from "react-loader-spinner"
import PfpDropdown from "../PfpDropdown/PfpDropdown"
import { Menu } from "lucide-react"
import "./Navbar.css"

const Navbar = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation()
  const [localeLoading, setLocaleLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = handleAuthStateChange(setUser, setLoading)
    return () => unsubscribe()
  }, [])

  const handleSignIn = () => navigate("/login")
  const handleGoAbout = () => navigate("/about")
  const handleGoProduct = () => navigate("/product")
  const handleGoContact = () => navigate("/contact")
  const handleGoHome = () => navigate("/home")
  const handleGoPricing = () => navigate("/pricing")

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const isActive = (path) => location.pathname === path

  const handleNavClick = (action) => {
    action()
    setIsMenuOpen(false)
  }

  if (localeLoading) {
    return (
      <div className="locale-loading-screen">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </div>
    )
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="menu-toggle" onClick={toggleMenu}>
          <Menu size={24} />
        </div>
        <h1 className="app-title">
          <span className="pro">P</span>
          <span className="pro-small">ro</span>
          <span className="val">Val</span>
        </h1>
        <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
          <div className="language-selector">
            <span
              className={`language-option ${i18n.language === "en" ? "active" : ""}`}
              onClick={() => {
                handleLanguageChange("en", i18n, setLocaleLoading)
                setIsMenuOpen(false)
              }}
            >
              EN
            </span>
            <span className="separator">|</span>
            <span
              className={`language-option ${i18n.language === "bg" ? "active" : ""}`}
              onClick={() => {
                handleLanguageChange("bg", i18n, setLocaleLoading)
                setIsMenuOpen(false)
              }}
            >
              BG
            </span>
          </div>
          <a onClick={() => handleNavClick(handleGoHome)} className={isActive("/home") ? "active-link" : ""}>
            {t("navbar.home")}
          </a>
          <a onClick={() => handleNavClick(handleGoProduct)} className={isActive("/product") ? "active-link" : ""}>
            {t("navbar.product")}
          </a>
          <a onClick={() => handleNavClick(handleGoAbout)} className={isActive("/about") ? "active-link" : ""}>
            {t("navbar.about")}
          </a>
          <a onClick={() => handleNavClick(handleGoContact)} className={isActive("/contact") ? "active-link" : ""}>
            {t("navbar.contact")}
          </a>
          <a onClick={() => handleNavClick(handleGoPricing)} className={isActive("/pricing") ? "active-link" : ""}>
            {t("navbar.pricing")}
          </a>
          {user ? (
            <PfpDropdown />
          ) : (
            <button onClick={() => handleNavClick(handleSignIn)} className="sign-in-button">
              {t("navbar.signIn")}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar