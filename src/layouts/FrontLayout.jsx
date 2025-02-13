import { NavLink, Outlet } from "react-router"

const Routes = [
  {path: "/", name: "首頁"},
  {path: "product", name: "產品頁"},
  {path: "cart", name: "購物車"},
]

export default function FrontLayout(){
  return(
    <>
    <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container">
        <ul className="navbar-nav flex-row gap-5 fs-5">
          {Routes.map((route) => (
          <li key={route.path} className="nav-item">
            <NavLink className="nav-link" aria-current="page" to={route.path}>{route.name}</NavLink>
          </li>
          ))}
        </ul>
      </div>
    </nav>
    <Outlet />
    </>
  )
}