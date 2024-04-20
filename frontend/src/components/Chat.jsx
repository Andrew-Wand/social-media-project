import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import MessageService from "../services/message.service";

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [allMessageList, setAllMessageList] = useState([]);
  const [allUserList, setAllUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [btnvisible, setBtnVisible] = useState(false);
  const [drawerVisible, setDrawerVisibile] = useState(false);
  const [messageId, setMessageId] = useState("");

  const user = AuthService.getCurrentUser();
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const allUserList = await UserService.getAllUsers();
        setAllUserList(allUserList.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllUsers();
  }, []);

  // Fetch all messages from DB
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messageList = await MessageService.getMessageList();
        setAllMessageList(messageList.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, []);

  const filteredMessageList = allMessageList.filter(
    (message) =>
      selectedUser === message.owner ||
      selectedUser === message.receiver ||
      currentUser.id === message.receiver ||
      currentUser.id === message.owner
  );

  const userListFiltered = allUserList.filter((j) => j.id === user.id);
  const followers = userListFiltered.flatMap((follower) => {
    return follower.userFollowers;
  });

  const userFilteredOnSelect = allUserList.filter(
    (user) => user.id == selectedUser
  );

  const onChangeSelect = (e) => {
    const selection = e.target.value;
    setSelectedUser(selection);
    setBtnVisible(true);
    setMessageId(selection);
    setDrawerVisibile(false);
  };
  const messageURL = "/message/" + selectedUser;
  console.log(allMessageList);

  return (
    <div>
      {user ? (
        <div>
          {/* MOBILE friends list */}
          <div>
            <div className="drawer xl:hidden">
              {userFilteredOnSelect.map((user, i) => (
                <h1 key={i} className="text-2xl mt-6 ml-5">
                  Chatting with
                  <span className="text-black underline"> {user.username}</span>
                </h1>
              ))}

              {drawerVisible ? (
                <input
                  id="my-drawer"
                  type="checkbox"
                  className="drawer-toggle"
                  checked
                />
              ) : (
                <input
                  id="my-drawer"
                  type="checkbox"
                  className="drawer-toggle"
                />
              )}

              <div className="drawer-content flex justify-end mr-2">
                {/* Page content here */}

                <label
                  htmlFor="my-drawer"
                  className="btn btn-primary drawer-button mb-2 mt-5"
                  onClick={() => {
                    drawerVisible
                      ? setDrawerVisibile(false)
                      : setDrawerVisibile(true);
                  }}
                >
                  Friends List
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="my-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>

                <div className="bg-slate-500 h-[3rem] w-full text-center flex">
                  <button
                    onClick={() => setDrawerVisibile(false)}
                    className="btn btn-sm btn-info mt-1 ml-5"
                  >
                    Back
                  </button>
                  <h3 className="text-2xl mt-1 ml-20">Friends List</h3>
                </div>
                <select
                  className="xl:block w-full min-h-full bg-base-100 text-base-content p-0 mt-10 "
                  size={10}
                  name=""
                  id=""
                  onChange={onChangeSelect}
                >
                  {followers.map((user, i) => (
                    <>
                      <option
                        className="text-2xl border-solid border-b-[1px] border-slate-500 bg-white text-black h-[5rem]"
                        value={user.id}
                        key={i}
                      >
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-16 mr-10 mt-2">
                            <span className="text-xl">
                              {user.username.slice(0, 1)}
                            </span>
                          </div>
                        </div>
                        {user.username}
                      </option>
                    </>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Chat Area for DESKTOP AND MOBILE / Friends list DESKTOP */}
          <div className="flex justify-center xl:justify-end xl:mr-10">
            <select
              className="hidden xl:block xl:w-60 min-h-full bg-slate-400 text-base-content p-0 mt-10 xl:rounded-xl xl:shadow-lg"
              size={5}
              name=""
              id=""
              onChange={onChangeSelect}
            >
              {followers.map((user, i) => (
                <option
                  value={user.id}
                  key={i}
                  className="text-2xl border-solid border-b-[1px] border-slate-500 bg-white text-black h-[5rem]"
                >
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-16 mr-10 mt-2">
                      <span className="text-xl">
                        {user.username.slice(0, 1)}
                      </span>
                    </div>
                  </div>
                  {user.username}
                </option>
              ))}
            </select>
            <div className="w-full h-[26rem] xl:w-[46rem] xl:h-[27rem] xl:mt-10 artboard artboard-horizontal bg-slate-200 shadow-lg overflow-auto flex flex-col-reverse">
              {/* Messages in chat room box */}
              <ul>
                {filteredMessageList.map((message, i) => (
                  <div key={i}>
                    {message.receiver !== selectedUser ? (
                      <div className="chat chat-start">
                        {followers.map((user, i) => (
                          <div key={i} className="chat-header">
                            {user.username}
                          </div>
                        ))}

                        <div className="chat-bubble chat-bubble-error static">
                          {message.text}
                        </div>
                      </div>
                    ) : (
                      <div className="chat chat-end">
                        <div className="chat-header">
                          {currentUser.username}
                        </div>
                        <div className="chat-bubble chat-bubble-info static">
                          {message.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </ul>
            </div>
          </div>

          {btnvisible ? (
            <div className="xl:flex xl:mr-10 xl:mt-10 xl:justify-end mt-10 flex justify-center">
              <Link className="btn btn-secondary" to={messageURL}>
                Send message
              </Link>
            </div>
          ) : (
            <div className="xl:flex xl:mr-10 xl:mt-10 xl:justify-end mt-10 ml-5">
              <button className="btn btn-secondary" disabled>
                Send Message
              </button>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Chat;
