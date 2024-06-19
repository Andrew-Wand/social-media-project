import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

const FindUsers = () => {
  const [myFollowers, setMyFollowers] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [allUserList, setAllUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const userIdParam = window.location.pathname.slice(-1);

  const user = AuthService.getCurrentUser();

  const fetchUserById = async (id) => {
    try {
      const currentUserInfo = await UserService.getUserById(id);
      setUserInfo(currentUserInfo.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserById(userIdParam);
  }, []);

  const fetchMyFollowers = async (id) => {
    try {
      const myFollowList = await UserService.findMyFollowers(id);
      setMyFollowers(myFollowList.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyFollowers(Number(userIdParam));
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const userList = await UserService.getAllUsers();
        const listData = userList.data;
        const filteredUserList = listData?.filter((j) => j.id !== user.id);
        setAllUserList(filteredUserList);
        setFilteredList(filteredUserList);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();
  }, []);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    const filteredItems = allUserList?.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredList(filteredItems);
  };

  return (
    <div className="bg-base-300 min-h-screen ">
      <div>
        <h2 className="text-3xl text-center pt-5">Find Users</h2>
      </div>

      <div className="flex justify-center mt-5">
        <input
          type="text"
          placeholder="Search Users"
          className="input "
          onChange={handleInputChange}
        />
      </div>

      <div className="flex xl:justify-center xl:flex-row flex-col items-center ">
        {filteredList?.map((user) => (
          <div className="card w-80 mx-2 bg-base-100 shadow-xl my-5 ">
            <div className="card-body">
              <div className="avatar justify-center">
                <div className="w-24 rounded-full">
                  <img src={user.image_url} />
                </div>
              </div>
              <h2 className="card-title justify-center mb-3">
                {user.username}
              </h2>
              <div className="card-actions justify-center">
                <Link
                  to={`/profile/${user.id}`}
                  className="btn btn-primary justify-center "
                >
                  Profile
                </Link>
                {/* <button className="btn btn-primary">Follow</button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindUsers;
