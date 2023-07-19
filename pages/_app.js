import '../styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Helmet } from 'react-helmet';

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Synthy1</title>
        <link rel="canonical" href="https://catgirlsaresexy.org" />
        <meta name="description" content="A chat app written with modern web technologies" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Necrozma" />
        <meta name="keywords" content="js, jsx, react, next, nextjs, socket, socket.io, chat, chat app, chatapp, chat-app, chatroom, chat room, chatroom app, chatroom-app, chatroomapp, chatroom app, chatroom-app, chatroomapp, chatroom application, chatroom-application, chatroomapplication, chatroom application, chatroom-application, chatroomapplication, chatroom web app, chatroom-web-app, chatroomwebapp, chatroom web app, chatroom-web-app, chatroomwebapp, chatroom web application, chatroom-web-application, chatroomwebapplication" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@sadan9921" />
        <meta name="twitter:title" content="Synthy1" />
        <meta name="twitter:description" content="A chat app written with modern web technologies" />
        <meta name="twitter:image" content="https://catgirlsaresexy.org/public/bg.gif" />
        <meta property="og:title" content="Synthy1" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://catgirlsaresexy.org" />
        <meta property="og:image" content="https://catgirlsaresexy.org/public/bg.gi" />
        <meta property="og:description" content="A chat app written with modern web technologies" />
        <meta property="og:site_name" content="Synthy1" />
      </Helmet>
      <Component {...pageProps} />
    </UserProvider>
  );
}