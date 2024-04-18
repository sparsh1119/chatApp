import React, { useState, useEffect } from "react";
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID_MESSAGES,
} from "../appwriteConfig";
import { ID, Query, Permission, Role } from "appwrite";
import Header from "../components/Header";
import { FaTrashCan } from "react-icons/fa6";
import { BsFillSendFill } from "react-icons/bs";
import { useAuth } from "../utils/AuthContext";

const Room = () => {
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A MESSAGE WAS CREATED");
          setMessages((prevState) => [response.payload, ...prevState]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A MESSAGE WAS DELETED!!!");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    //console.log("unsubscribe:", unsubscribe);

    return () => {
      unsubscribe();

    };
  }, []);

  const getMessages = async () => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderDesc("$createdAt"), Query.limit(100)]
    );

   //console.log(response.documents);
    setMessages(response.documents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("MESSAGE:", messageBody);

    const permissions = [Permission.write(Role.user(user.$id))];

    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
      permissions
    );

    console.log("RESPONSE:", response);

    setMessageBody("");
  };

  const deleteMessage = async (id) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, id);
  };

  return (
    <main className="h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600">
      <Header />

      <div className="flex flex-col justify-between h-5/6 gap-2">

        {/* Chat box */}
        <div className="bg-ChatBg p-4 rounded-lg shadow-md w-11/12 mt-4 mx-auto overflow-y-auto">

          <div className="mt-4">
          {messages.slice().reverse().map((message) => (
          <div
            key={message.$id}
            className={
              "flex flex-col " +
              (message.user_id === user.$id ? "items-end" : "items-start")
            }
              >
                <div
                  className={
                    "py-4 px-6 rounded break-words mt-2" +
                    (message.user_id === user.$id
                      ? " bg-blue-800 text-gray-100 rounded-l-3xl"
                      : " bg-gray-800 text-gray-100 rounded-r-3xl")
                  }
                >
                  <p className="font-semibold">
                    {message?.username ? message?.username + ": " : ""}
                  </p>
                  <span>{message.body}</span>
                  <p className="text-sm text-gray-100">
                    {new Date(message.$createdAt).toLocaleString()}
                  </p>
                </div>
                {message.$permissions.includes(
                  `delete(\"user:${user.$id}\")`
                ) && (
                  <FaTrashCan
                    className="transition duration-300 cursor-pointer text-2xl text-slate-800 hover:text-red-700"
                    onClick={() => {
                      deleteMessage(message.$id);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>



            {/* message box form */}
        <div className="bg-white p-4 rounded-lg shadow-md w-11/12  m-auto">
          <form id="message-form" onSubmit={handleSubmit}>
            <textarea
              required
              maxLength="300"
              placeholder="Message"
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            ></textarea>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white text-2xl rounded-md py-2 px-6 focus:outline-none"
              >
                <BsFillSendFill />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Room;
