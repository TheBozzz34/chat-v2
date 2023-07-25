import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@tremor/react";
import socket from "../../socket";
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';



export default function UserPage() {
    const { user } = useUser();
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoggedIn(user ? true : false);
        if (user) {
            setLoading(true);
            getUserName();
        }
    }, [user]);

    const Login = () => {
        window.location.href = "/api/auth/login";
    };

    function getUserName() {
        if (user && user.email) {
            socket.emit("requestUsername", user.email);
            socket.on("sendUsername", (username) => {
                setUserName(username);
                setLoading(false);
            });
        }
    }


    return (
        <div className="bg-dark-tremor-background h-screen overflow-hidden">
            <div className="border-b-2 border-dark-tremor-border p-2 m-2 flex items-center justify-between"> {/* Added 'flex', 'items-center', and 'justify-between' */}
                <div className="text-xs text-dark-tremor-custom-backround flex items-center"> {/* Added 'flex' and 'items-center' */}
                    <h1 className="text-2xl font-bold text-white">Profile</h1>
                </div>
                {loggedIn ? (
                    <div className="flex flex-row justify-end items-center">
                        {/* Place the user picture on the right side */}
                        <Chip
                            avatar={<Avatar alt={userName} src={user.picture} />}
                            label={userName}
                            variant="outlined"
                            color="info"
                        />
                    </div>
                ) : (
                    <div className="flex flex-row justify-end">
                        {/* Call handleLogin() when the 'Log In' button is clicked */}
                        <Button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={Login}
                        >
                            Log In
                        </Button>
                    </div>
                )}
            </div>



            <div className="flex flex-col items-center justify-center h-full">
                {loggedIn && user ? (
                    <div className="text-white">
                        {/* Display user's name and other profile information */}
                        <p>
                            <span>Email: <pre className="inline-block bg-gray-800 p-2 rounded-lg text-white font-mono text-sm">
                                <code>{user.email}</code>
                            </pre></span> {/* Wrap the "Email" text in a <span> */}
                        </p>
                        <p>Username: <pre className="inline-block bg-gray-800 p-2 rounded-lg text-white font-mono text-sm mt-1">
                            <code>{userName}</code>
                        </pre>
                        </p>
                    </div>

                ) : (
                    <div className="text-white">
                        <p className="text-white">You are not logged in</p>
                    </div>
                )}
            </div>
        </div>
    );
}