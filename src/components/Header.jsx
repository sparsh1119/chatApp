import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, LogIn } from 'react-feather';

const Header = () => {
    const { user, handleLogout } = useAuth();

    return (
        <div className="bg-rose-600 p-2 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
                <span className="text-white mr-4">{user ? `Welcome ${user.name} !` : ''}</span>
                <span className="text-white font-bold text-2xl">Chat Room</span>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
                {user ? (
                    <LogOut className="text-white header--link cursor-pointer mr-4" onClick={handleLogout} />
                ) : (
                    <Link to="/">
                        <LogIn className="text-white header--link cursor-pointer mr-4" />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Header;


