import { useEffect, useRef, useState } from 'react'
import { FaInstagram, FaSnapchatGhost, FaTiktok } from 'react-icons/fa'
import { HiOutlineMapPin } from 'react-icons/hi2'
import { FiMoreVertical, FiShare2, FiCopy, FiCheck, FiExternalLink } from 'react-icons/fi'
import { shopLogo } from './shopLogo'

const links = [
  {
    label: 'قيّمنا على جوجل ماب',
    url: 'https://search.google.com/local/writereview?placeid=ChIJZ0vzZwC_jxUR9k_8c7ekSU0',
    Icon: HiOutlineMapPin,
  },
  {
    label: 'سناب شات',
    url: 'https://snapchat.com/t/1EHlBRyz',
    Icon: FaSnapchatGhost,
  },
  {
    label: 'تيكتوك',
    url: 'https://www.tiktok.com/@sheinwc?_r=1&_t=ZS-9AqGltzvvQS',
    Icon: FaTiktok,
  },
  {
    label: 'إنستقرام',
    url: 'https://www.instagram.com/sheinwco?exln=aTAzYTlqZmk4OGg3',
    Icon: FaInstagram,
  },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState<number | null>(null)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setActiveLink(null)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.clearTimeout(toastTimer.current)
    }
  }, [])

  function showToast(message: string) {
    window.clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = window.setTimeout(() => setToast(''), 2500)
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      showToast('تم نسخ الرابط')
    } catch {
      showToast('تعذّر نسخ الرابط')
    }
  }

  async function shareUrl(url: string, title: string) {
    setMenuOpen(false)
    setActiveLink(null)
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // Dismissing the native share dialog needs no further action.
      }
    } else {
      await copyLink(url)
    }
  }

  return (
    <main className="page" dir="rtl" onClick={(event) => {
      if (!(event.target as HTMLElement).closest('.top-actions, .link-more, .link-menu')) {
        setMenuOpen(false)
        setActiveLink(null)
      }
    }}>
      <div className="top-actions">
        <button
          className="top-menu-button"
          type="button"
          aria-label="خيارات الصفحة"
          aria-expanded={menuOpen}
          onClick={() => { setActiveLink(null); setMenuOpen((open) => !open) }}
        >
          <FiMoreVertical aria-hidden="true" />
        </button>
        {menuOpen && (
          <div className="page-menu">
            <button type="button" onClick={() => void shareUrl(window.location.href, 'عالم شي إن')}><FiShare2 aria-hidden="true" /> مشاركة الصفحة</button>
            <button type="button" onClick={() => { setMenuOpen(false); void copyLink(window.location.href) }}><FiCopy aria-hidden="true" /> نسخ رابط الصفحة</button>
          </div>
        )}
      </div>

      <section className="profile" aria-label="عالم شي إن">
        <div className="logo-container">
          <img className="store-logo" src={shopLogo} alt="شعار عالم شي إن" fetchPriority="high" decoding="sync" />
        </div>
        <h1>عالم شي إن</h1>
        <div className="title-rule" aria-hidden="true" />
        <p className="description">عالم شي إن للملابس و للأجهزة</p>
      </section>

      <nav className="links" aria-label="روابط التواصل">
        {links.map(({ label, url, Icon }, index) => (
          <div className={`link-row${activeLink === index ? ' menu-active' : ''}`} key={label} style={{ animationDelay: `${0.2 + index * 0.13}s` }}>
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon className="link-icon" aria-hidden="true" />
              <span>{label}</span>
            </a>
            <button className="link-more" type="button" aria-label={`خيارات ${label}`} aria-expanded={activeLink === index} onClick={() => { setMenuOpen(false); setActiveLink(activeLink === index ? null : index) }}>
              <FiMoreVertical aria-hidden="true" />
            </button>
            {activeLink === index && (
              <div className="link-menu">
                <a href={url} target="_blank" rel="noopener noreferrer"><FiExternalLink aria-hidden="true" /> فتح الرابط</a>
                <button type="button" onClick={() => { setActiveLink(null); void copyLink(url) }}><FiCopy aria-hidden="true" /> نسخ الرابط</button>
                <button type="button" onClick={() => void shareUrl(url, label)}><FiShare2 aria-hidden="true" /> مشاركة الرابط</button>
              </div>
            )}
          </div>
        ))}
      </nav>

      <footer className="footer">
        <span>عالم شي إن</span>
      </footer>

      {toast && <div className="toast" role="status"><FiCheck aria-hidden="true" />{toast}</div>}
    </main>
  )
}
