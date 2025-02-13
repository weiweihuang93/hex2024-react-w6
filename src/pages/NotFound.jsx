import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function NotFound() {

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/")
    }, 5000);

    // 清除定时器
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
    <div className="container">
      <div className="m-auto">
        <div className="text-center">
          <h1 className="display-1 text-danger">404</h1>
          <h2 className="h3">Oops! Page Not Found</h2>
          <p className="lead">We can't seem to find the page you're looking for.</p>
          <p>Redirecting you to the homepage in 5 seconds...</p>
        </div>
      </div>
    </div>
    </>
  )
}