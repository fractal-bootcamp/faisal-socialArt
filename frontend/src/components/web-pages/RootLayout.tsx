import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const RootLayout: React.FC = () => {
    return (
        <div className="app">
            <nav>
                <ul>
                    <li><Link to="/art-feed">
                        Art Feed
                    </Link>
                    </li>
                    <li><Link to="/profile">
                        Profile
                    </Link>
                    </li>
                </ul>
            </nav>

            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default RootLayout;