import { NavLink, Outlet } from "react-router"

const adminRoutes = [
  {path: "/admin/product", name: "產品管理"},
  {path: "/admin/order", name: "訂單管理"},
]

export default function AdminLayout(){
  return(
    <>
    <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container">
        <ul className="navbar-nav flex-row gap-5 fs-5">
          {adminRoutes.map((route) => (
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