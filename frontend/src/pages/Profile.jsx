import { useState, useEffect } from "react";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import FollowService from "../services/follow.service";
const Profile = () => {
  const [userProfileData, setUserProfileData] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const profileIdParams = window.location.pathname.slice(-1);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const fetchUserById = async (id) => {
    try {
      const currentUserProfile = await UserService.getUserById(id);
      setUserProfileData(currentUserProfile.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserById(profileIdParams);
  }, []);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleFollowSubmit = async (e) => {
    e.preventDefault();

    const user = AuthService.getCurrentUser();
    const userId = user?.id;
    const name = user.username;
    const followerId = Number(profileIdParams);

    FollowService.createFollower(name, userId, followerId).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);

        fetchUserById(response.config.data.slice(-2, -1));
        // setIsLoading(false);
        // fetchAllPosts(response.config.data.slice(-2, -1));
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  const userFollowersFiltered = userProfileData.userFollowers?.filter(
    (follower) => follower.id === currentUser.id
  );

  return (
    <div>
      <div className="min-h-screen bg-slate-800">
        <h2 className="text-2xl underline text-center p-5">
          {userProfileData.username}'s Profile
        </h2>

        <form onSubmit={handleFollowSubmit}>
          {userFollowersFiltered?.map((follower, i) => (
            <div key={i}>
              {follower.id === currentUser.id ? (
                <button className="btn">Unfollow</button>
              ) : (
                ""
                // <button>Follow</button>
              )}
            </div>
          ))}

          {/* {currentUser?.id === profileIdParams && ""} */}

          {userFollowersFiltered?.length === 0 ? (
            <button
              className={
                currentUser?.id === Number(profileIdParams) ? "hidden" : "btn"
              }
            >
              Follow
            </button>
          ) : (
            ""
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
