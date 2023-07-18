"use client";

import { useState, useEffect } from "react";

import {
    Card,
    Grid,
    Title,
    Text,
    Tab,
    TabList,
    TabGroup,
    TabPanel,
    TabPanels,
    Metric,
    Button,
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    Badge,
    TextInput
} from "@tremor/react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { HiHome } from "react-icons/hi";
import { FaSearch as SearchIcon } from "react-icons/fa";
import socket from "../../socket";
import ss from "socket.io-stream";

export default function DashboardExample() {
    const { user } = useUser();
    const [users, setUsers] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [messagesCount, setMessagesCount] = useState(0);
    const [messages, setMessages] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageModelText, setMessageModelText] = useState("");
    function openAuth0() {
        window.open("https://manage.auth0.com/dashboard/us/dev-dc57y-7a/users");
    }

    function setMessageModelInput(e) {
        setMessageModelText(e.target.value);
    }

    function requestLogs() {
        socket.emit("requestLogs");
        socket.on("sendLogs", (data) => {
            window.open("http://localhost:3002/api/export");
        });
    }

    function sendMessage() {
        if (messageModelText === "") {
            alert("Message cannot be empty!");
            return;
        }
        let data = {
            user: "admin",
            message: messageModelText,
            timestamp: Date.now(),
        };
        socket.emit("message", data);
        setShowMessageModal(false);
    }

    function refreshData() {
        console.log("refreshing data");
        socket.emit("requestUsers");
        socket.emit("requestUsersCount");
        socket.emit("requestMessagesCount");
    }
    function formatUnixTime(unixTime) {
        const dateObject = new Date(unixTime);

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const day = String(dateObject.getDate()).padStart(2, '0');
        const hours = String(dateObject.getHours()).padStart(2, '0');
        const minutes = String(dateObject.getMinutes()).padStart(2, '0');
        const seconds = String(dateObject.getSeconds()).padStart(2, '0');

        const formattedDate = `${month}/${day}/${year}, ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }
    const handleSearchChange = (e) => {
        e.preventDefault();
        let userInput = e.target.value;
        userInput = userInput.toLowerCase();

        const filteredUsers = users.filter((user) => {
            return (
                user.username.toLowerCase().includes(userInput) ||
                user.nickname.toLowerCase().includes(userInput) ||
                user.email.toLowerCase().includes(userInput)
            );
        });
        if (userInput === '') {
        } else {
            setUsers(filteredUsers);
        }
        setSearchInput(e.target.value);
    };


    useEffect(() => {
        socket.emit("requestMessages");
        socket.on("sendUsersCount", (data) => {
            setUsersCount(data);
            socket.emit("requestUsers");
        });
        socket.emit("requestMessagesCount");
        socket.on("sendMessagesCount", (data) => {
            setMessagesCount(data);
        });
        socket.on("sendUsers", (data) => {
            setUsers(data);
        });
        socket.on("sendMessages", (data) => {
            setMessages(data);
        });

        refreshData();

        socket.on("refresh", () => {
            refreshData();
        });
        socket.on("message", (data) => {
            setMessages((messages) => [...messages, data]);
        });
        return () => {
            // Clean up event listeners
            socket.off("sendUsersCount");
            socket.off("sendMessagesCount");
            socket.off("refresh");
            socket.off("message");
        };
    }, []);

    if (user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        return (
            <div className = "h-screen bg-dark-tremor-background">
            <main className="px-12 py-12 bg-dark-tremor-background">
                <Title className="font-medium text-dark-tremor-title text-dark-tremor-content-emphasis">
                    Synthy1 Dashboard
                </Title>
                <Text className="text-dark-tremor-content">
                    Welcome {user.nickname}!
                </Text>

                <div className="mt-6">
                    <Button className="mr-4" onClick={openAuth0}>Create New User</Button>
                    <Button className="mr-4" onClick={() => setShowMessageModal(true)}>Send Message</Button>
                    <Button className="mr-4" onClick={() => requestLogs()}>Export Logs</Button>
                    <Button className="mr-4" onClick={refreshData}>Refresh Data Manually</Button>
                </div>

                {showMessageModal ? (
                    <Card className="mx-auto mt-4" decoration="bottom" decorationColor="indigo">
                        <Title className="font-medium text-dark-tremor-title text-dark-tremor-content-emphasis"> Send Message </Title>
                        <Text className="text-dark-tremor-content"> Send a message to all users. </Text>
                        <TextInput className="mt-5" placeholder="Message" onChange={setMessageModelInput}></TextInput>
                        <div className="mt-6">
                            <Button className="mr-4" onClick={(e) => sendMessage()}>Send</Button>
                            <Button className="mr-4" onClick={() => setShowMessageModal(false)}>Cancel</Button>
                        </div>
                        
                  </Card>
                ) : null }

                <TabGroup className="mt-6">
                    <TabList>
                        <Tab>Overview</Tab>
                        <Tab>Users</Tab>
                        <Tab>Message Logs</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
                                <Card>
                                    <Text>
                                        <span className="text-dark-tremor-content-muted">Users: </span>
                                    </Text>
                                    <Metric>{usersCount}</Metric>
                                    {/* Placeholder to set height */}
                                    <div className="h-fit" />
                                </Card>
                                <Card>
                                    <Text>
                                        <span className="text-dark-tremor-content-muted">Legacy Users: </span>
                                    </Text>
                                    <Metric>4</Metric>
                                    {/* Placeholder to set height */}
                                    <div className="h-fit" />
                                </Card>
                                <Card>
                                    <Text>
                                        <span className="text-dark-tremor-content-muted">Messages: </span>
                                    </Text>
                                    <Metric>{messagesCount}</Metric>
                                    {/* Placeholder to set height */}
                                    <div className="h-fit" />
                                </Card>
                            </Grid>
                        </TabPanel>
                        <TabPanel>
                            <div className="mt-6">
                                <Card>
                                    <Title>List of Registered Users</Title>
                                    <TextInput icon={SearchIcon} placeholder="Search..." className="mt-5" onChange={(e) => handleSearchChange(e)} value={searchInput} onKeyDown={(e) => { if (e.key === 'Backspace') { setSearchInput("") } }}

                                    />
                                    <Table className="mt-5">
                                        <TableHead>
                                            <TableRow>
                                                <TableHeaderCell>Last IP</TableHeaderCell>
                                                <TableHeaderCell>Username</TableHeaderCell>
                                                <TableHeaderCell>Nickname</TableHeaderCell>
                                                <TableHeaderCell>Email</TableHeaderCell>
                                                <TableHeaderCell>Last Login</TableHeaderCell>
                                                <TableHeaderCell>Status</TableHeaderCell>
                                                <TableHeaderCell>Created At</TableHeaderCell>
                                                <TableHeaderCell>Login Count</TableHeaderCell>
                                                <TableHeaderCell>Actions</TableHeaderCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
        
                                                {users.map((item) => (
                                                    <TableRow key={item.email}>
                                                        <TableCell>
                                                            <Text>{item.lastIP}</Text>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Text>{item.username}</Text>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Text>{item.nickname}</Text>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Text>{item.email}</Text>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Text>{item.lastLogin}</Text>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge color={item.emailVerified ? "emerald" : "orange"}>
                                                                {item.emailVerified ? "Verified" : "Unverified"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Text>{item.createdAt}</Text>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Text>{item.loginsCount}</Text>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="secondary">Delete</Button>
                                                        </TableCell>

                                                    </TableRow>
                                                    // Render user data
                                                ))
                                         }


                                        </TableBody>
                                    </Table>

                                    <div className="h-96" />
                                </Card>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="mt-6">
                                <Card>
                                    <Title>Message Logs</Title>
                                    <TextInput icon={SearchIcon} placeholder="Search..." />
                                    <Table className="mt-5">
                                        <TableHead>
                                            <TableRow>
                                                <TableHeaderCell>Username</TableHeaderCell>
                                                <TableHeaderCell>Time</TableHeaderCell>
                                                <TableHeaderCell>Message</TableHeaderCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {messages.map((item) => {
                                                let time = formatUnixTime(item.timestamp);
                                                return (
                                                    <TableRow key={item.timestamp}>
                                                        <TableCell>
                                                            <Text>{item.username || item.user}</Text>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Text>{item.message}</Text>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Text>{time}</Text>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                            }
                                        </TableBody>
                                    </Table>

                                    <div className="h-96" />
                                </Card>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </TabGroup>
                <div className="pt-6 flex items-center justify-center space-x-2 text-sm font-semibold leading-6 text-slate-600 transition-all">
                    <div className="group flex space-x-2 items-center">
                        <a
                            href="/">
                            <div className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all flex items-center">
                                <HiHome className="h-5 w-5" />
                                <span className="ml-1">Home</span>
                            </div>

                        </a>
                    </div>
                </div>
            </main>
            </div>
        );
    } else {
        return (
            <main className="px-12 py-12">
                <Title className="font-medium text-dark-tremor-title text-dark-tremor-content-emphasis">
                    Dashboard
                </Title>
                <Text className="text-dark-tremor-content">
                    You are not authorized to view this page.
                </Text>
            </main>
        );
    }
}
