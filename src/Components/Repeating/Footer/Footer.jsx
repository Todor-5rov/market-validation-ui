import { t } from "i18next"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import "./Footer.css"

const Footer = () => {
  const location = useLocation()
  const isProductPage = location.pathname === "/product"
  const currentYear = new Date().getFullYear()

  // Track window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <footer className={`footer ${isProductPage && windowWidth > 1200 ? "shifted" : ""}`}>
      <p className="footer-text">
        <span className="full-text">
          &copy; {currentYear} {t("footer.text")}
        </span>
        <span className="short-text">
          &copy; 2024 ProVal
        </span>
      </p>
    </footer>
  )
}

export default Footer