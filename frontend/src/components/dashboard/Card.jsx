import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveUpRight } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationProvider'; // Correct this path if needed

const Card = ({ title, value, link }) => {
  const routerNavigate = useNavigate();
  const { navigate } = useNavigation();

  const handleNavigate = () => {
    if (link) {
      navigate(link, routerNavigate);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col justify-between p-6 w-64 h-40 relative cursor-pointer" onClick={handleNavigate}>
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-blue-600">{value}</p>
      </div>

      {link && (
        <div className="absolute bottom-4 right-4 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition">
          <MoveUpRight className="w-5 h-5 text-blue-600" />
        </div>
      )}
    </div>
  );
};

export default Card;
