import { useLocation } from "react-router-dom";
import style from "./css/Breadcrumbs.module.css";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const BreadCrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className={`breadcrumb ${style.text}`}>
      <div className="breadcrumb_item">
        {/* Add /Progress to the "Sell" base logic */}
        {location.pathname.startsWith("/Account") ||
        location.pathname.startsWith("/CreateAccount") ||
        location.pathname.startsWith("/AddressForm") ||
        location.pathname.startsWith("/Verification") ||
        location.pathname.startsWith("/Add-Product") ? (
          <a href="/Account">Sell</a>
        ) : (
          <a href="/">Home</a>
        )}
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <span key={name}>
              &nbsp;&gt;&nbsp;
              {isLast ? (
                capitalize(name)
              ) : (
                <a href={routeTo}>{capitalize(name)}</a>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default BreadCrumb;
