import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Community = () => {
  const { user, setUser, logout } = useAuth();

  const handleJoinCommunity = async () => {
    try {
      const res = await API.post("/api/auth/join-community");
      setUser(res.data.user);
    } catch (error) {
      console.log("Join community failed", error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Community Dashboard</h1>

      <p>Welcome, {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      {user?.avatar && (
        <img
          src={user.avatar}
          alt="profile"
          width="80"
          style={{ borderRadius: "50%" }}
        />
      )}

      <hr />

      {user?.isCommunityJoined ? (
        <div>
          <h3>You have joined the community.</h3>
          <p>GitHub connect feature coming in next phase.</p>
        </div>
      ) : (
        <button onClick={handleJoinCommunity}>Join Community</button>
      )}

      <br />
      <br />

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Community;
