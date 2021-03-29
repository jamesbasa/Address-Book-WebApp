import styles from './navbar.module.scss'
import Navlinks from './navlinks'
import { useRouter } from "next/router";

const links = [
  { href: '/', label: 'Overview', icon: 'icon-overview' },
  { href: '/address-book', label: 'Address Book', icon: 'icon-address-book' },
  { href: '/analytics', label: 'Analytics', icon: 'icon-map' }
]

export default function Navbar({children}) {
  const router = useRouter();

  return (
    <nav>
      <div className={`py-6 pl-5 ${styles['navbar__bar']}`}>
        <h1>Welcome</h1>
      </div>
      <div className="flex h-screen">
        <div className={`flex-none ${styles['navbar__menu']}`}>
          <ul>
            {links.map(({href, label, icon }) => (
              <Navlinks
                href={href}
                label={label}
                icon={icon}
              />
            ))}
          </ul>
        </div>
        <div className="container mx-auto p-4">
          <main>{children}</main>
        </div>
      </div>
    </nav>
  )
}