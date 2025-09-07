import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [current, setCurrent] = useState(location.pathname); 

  useEffect(() => {
    if (location.pathname !== current) {
      setHistory((prev) => [...prev, current]);
      setCurrent(location.pathname);
      setFuture([]);
    }
  }, [current, location.pathname]);

  const navigate = (page, routerNavigate) => {
    if (page === current) return;
    setHistory((prev) => [...prev, current]);
    setCurrent(page);
    setFuture([]);
    if (routerNavigate) {
      routerNavigate(page);
    }
  };

  const goBack = (routerNavigate) => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setFuture((f) => [current, ...f]);
    setCurrent(prev);
    if (routerNavigate) {
      routerNavigate(prev);
    }
  };

  const goForward = (routerNavigate) => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((prev) => [...prev, current]);
    setCurrent(next);
    if (routerNavigate) {
      routerNavigate(next);
    }
  };

  return (
    <NavigationContext.Provider
      value={{ current, navigate, goBack, goForward, history, future }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
