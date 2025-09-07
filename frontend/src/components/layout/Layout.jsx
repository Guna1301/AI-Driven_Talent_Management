import { useNavigate } from "react-router-dom";
import { useNavigation } from "../../contexts/NavigationProvider";
import ChatPage from "../../pages/ChatPage";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Layout = ({ children }) => {
  const routerNavigate = useNavigate();
  const { current, goBack, goForward, history, future } = useNavigation();

  return (
    <div className="flex h-screen">
      <div className="w-[680px] border-r border-gray-200">
        <ChatPage />
      </div>

      <div className="w-[1300px] flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => goBack(routerNavigate)}
            disabled={history.length === 0}
            className="p-2 rounded bg-gray-200 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          {/* <button
            onClick={() => goForward(routerNavigate)}
            disabled={future.length === 0}
            className="p-2 rounded bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button> */}
        </div>

        <div className="flex items-center space-x-3">
          <p className="text-gray-700">Guna</p>
          <img
            src="https://avatar.iran.liara.run/public/12"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1 p-4">{children}</div>
    </div>

    </div>
  );
};

export default Layout;
