import { useState } from 'react'
import { createPortal } from 'react-dom'
import './HamburgerMenu.css'

export default function HamburgerMenu({ isOpen, onClose, onNavigate }) {
  const [expandedItem, setExpandedItem] = useState(null)

  const handleItemClick = (itemId) => {
    if (onNavigate && typeof onNavigate === 'function') {
      onNavigate(itemId)
    }
    if (onClose && typeof onClose === 'function') {
      onClose()
    }
  }

  const toggleDropdown = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId)
  }

  const menuItems = [
    {
      id: 'happenings',
      label: 'Happenings',
      hasDropdown: true,
      dropdownItems: [
        { id: 'events', label: 'Events' },
        { id: 'news', label: 'News & Updates' },
        { id: 'workshops', label: 'Workshops' },
        { id: 'seminars', label: 'Seminars' },
        { id: 'conferences', label: 'Conferences' }
      ]
    },
    { id: 'nirf', label: 'NIRF', hasDropdown: false },
    { id: 'why-gla', label: 'Why GLA?', hasDropdown: false },
    { id: 'research', label: 'Research', hasDropdown: false },
    { id: 'alumni', label: 'Alumni', hasDropdown: false },
    { id: 'careers', label: 'Careers', hasDropdown: false },
    { id: 'contact-us', label: 'Contact Us', hasDropdown: false }
  ]

  if (!isOpen) {
    return null
  }

  const menuContent = (
    <>
      <div className="menu-overlay" onClick={onClose} style={{ display: 'block', visibility: 'visible' }}></div>
      <div className="hamburger-menu" style={{ display: 'flex', visibility: 'visible', opacity: 1 }}>
        <div className="menu-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={onClose} type="button" aria-label="Close menu">
            ✕
          </button>
        </div>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.id} className="menu-item-wrapper">
              {item.hasDropdown ? (
                <>
                  <div 
                    className="menu-item with-dropdown"
                    onClick={() => toggleDropdown(item.id)}
                  >
                    <span>{item.label}</span>
                    <span className="dropdown-icon">{expandedItem === item.id ? '−' : '+'}</span>
                  </div>
                  {expandedItem === item.id && (
                    <ul className="dropdown-list">
                      {item.dropdownItems.map((subItem) => (
                        <li 
                          key={subItem.id}
                          className="dropdown-item"
                          onClick={() => handleItemClick(subItem.id)}
                        >
                          {subItem.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <div 
                  className="menu-item"
                  onClick={() => handleItemClick(item.id)}
                >
                  {item.label}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  )

  // Always use portal for proper z-index handling
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.body) {
    return createPortal(menuContent, document.body)
  }
  
  // Fallback for SSR or when document is not available
  return menuContent
}

