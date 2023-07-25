// pages/profile/[username].js
import { useRouter } from 'next/router';
import socket from '../../socket';

const ProfilePage = ({ profile, notFound }) => {
    const router = useRouter();
    const { username } = router.query;

    if (notFound) {
        return <div>Profile not found!</div>;
    }
    return (
        <div className="bg-dark-tremor-background h-screen overflow-hidden text-white">
            <h1 className="border-b-2 border-dark-tremor-border p-2 m-2 flex items-center justify-between">Profile Page</h1>
            <p className="mb-2">Username: {username}</p>
            {profile ? (
                <>
                    <p className="mb-2">Created At: {profile[0].created_at}</p>
                    <p className="mb-4">Updated At: {profile[0].updated_at}</p>
                    <img
                        src={profile[0].picture}
                        alt="Profile Picture"
                        className="w-48 h-48 object-cover rounded"
                    />
                </>
            ) : (
                <div className="text-red-500 font-bold">Profile not found!</div>
            )}
        </div>
    );
};

export async function getServerSideProps({ params }) {
    // Here, you can implement your logic to fetch profile data from a database or API
    // For this example, I'll use dummy data

    return new Promise((resolve) => {
        socket.emit('requestUser', params.username);

        socket.on('sendUser', (profile) => {
            if (profile === false) {
                resolve({
                    props: {
                        notFound: true,
                    },
                });
            } else {
                resolve({
                    props: {
                        profile,
                    },
                });
            }
        });
    });

}

export default ProfilePage;
