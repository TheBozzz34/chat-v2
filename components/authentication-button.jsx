import React from 'react';

import LoginButton from './login-button';
import LogoutButton from './logout-button';
import SignupButton from './signup-button';

import { useUser } from '@auth0/nextjs-auth0/client';

const AuthenticationButton = () => {
    const { user } = useUser();

    return (
        !user && (
            <div className="navbar-nav ml-auto">
                <LoginButton />
                <SignupButton />
            </div>
        ) ||
        user && (
            <LogoutButton />
        )
    )
};

export default AuthenticationButton;