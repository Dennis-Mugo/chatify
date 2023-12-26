import React, { useContext, useState } from 'react';
import "./Chat.css";
import Logo from '../../components/Logo/Logo';
import { ChatifyContext } from '../../context/context';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Chat(props) {
    const navigate = useNavigate();
    const {currentUser, signOut} = useContext(ChatifyContext);
    const [signoutLoading, setSignoutLoading] = useState(false);
    console.log(currentUser);

    const handleSignOut = async () => {
        setSignoutLoading(true);
        await signOut();
        navigate("/signin");
    }
    return (
        <div>
            <Logo />
            <Button variant="outlined" onClick={handleSignOut}>Sign Out</Button>
        </div>
    );
}

export default Chat;