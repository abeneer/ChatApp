import React from 'react'
import Sidebar from '../parts/Sidebar.jsx';
import Chat from '../parts/Chat.jsx';
import styles from '../styles/Home.module.css';

function Home() {
    return (
        <div className={`${styles.home}`}>
            <div className={` ${styles.container}`}>
                <Sidebar />
                <Chat />
            </div>
        </div>
    )
}

export default Home;