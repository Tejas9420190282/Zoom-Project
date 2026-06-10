// MeetingRoom.jsx

import { useParams } from "react-router-dom";
import {
  Mic,
  Video,
  MessageSquare,
  MonitorUp,
  PhoneOff,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

function MeetingRoom() {
  const { roomId } = useParams();

  const [participants, setParticipants] = useState([]);
  const [showChat, setShowChat] = useState(true);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    const getParticipants = async () => {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:1819/api/room/${roomId}/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setParticipants(response.data.participants);

      console.log(response.data.participants);
    };

    getParticipants();
  }, [roomId]);

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("user-joined", async (message) => {
      console.log("SOCKET EVENT:", message);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:1819/api/room/${roomId}/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setParticipants(response.data.participants);
    });

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("user-joined");
      socket.off("receive-message");
    };
  }, [roomId]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `http://localhost:1819/api/chat/${roomId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error loading chat:", error);
      }
    };

    getMessages();
  }, [roomId]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId,
      sender: "Tejas",
      message,
    });

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Meeting Area */}
        <div className="flex-1 p-6">
          <div className="h-full bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">MeetClone</h1>

                <p className="text-sm text-gray-500 mt-1">Room ID</p>

                <p className="font-mono text-blue-600">{roomId}</p>
              </div>

              <div className="flex items-center gap-3 relative">
                <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                  🟢 Active
                </div>

                <div
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="cursor-pointer bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Users size={16} />
                  {participants.length}
                </div>

                {/* Participants Popup */}
                {showParticipants && (
                  <div className="absolute right-0 top-14 z-[9999]">
                    <div className="w-80 bg-white rounded-xl shadow-2xl border p-4 max-h-80 overflow-y-auto">
                      <h3 className="font-bold text-lg mb-3">
                        Participants ({participants.length})
                      </h3>

                      {participants.length === 0 ? (
                        <p className="text-gray-500">No participants found</p>
                      ) : (
                        participants.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                          >
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <p className="font-medium">{user.name}</p>

                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Area Placeholder */}
            <div className="flex flex-col h-full">
              <div className="flex-1 bg-[#1c1c1c] rounded-xl flex items-center justify-center">
                <div className="flex-1 bg-[#1c1c1c] rounded-xl flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-blue-600 text-white text-5xl font-bold flex items-center justify-center">
                      T
                    </div>

                    <p className="mt-4 text-white text-xl">Tejas</p>

                    <p className="text-gray-400 text-sm">Camera Off</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-5">
                <div className="bg-black/90 px-6 py-3 rounded-full flex gap-4 shadow-xl">
                  <button className="p-3 bg-gray-700 rounded-full text-white hover:bg-gray-600">
                    <Mic size={20} />
                  </button>

                  <button className="p-3 bg-gray-700 rounded-full text-white hover:bg-gray-600">
                    <Video size={20} />
                  </button>

                  <button
                    className={`p-3 rounded-full text-white ${
                      showChat ? "bg-blue-600" : "bg-gray-700"
                    }`}
                    onClick={() => setShowChat(!showChat)}
                  >
                    <MessageSquare size={20} />
                  </button>

                  <button className="p-3 bg-gray-700 rounded-full text-white hover:bg-gray-600">
                    <MonitorUp size={20} />
                  </button>

                  <button className="p-3 bg-red-600 rounded-full text-white hover:bg-red-700">
                    <PhoneOff size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Right Side Panel */}
        <div
          className={`
    bg-white border-l shadow-lg flex flex-col
    transition-all duration-300 overflow-hidden
    ${showChat ? "w-[350px]" : "w-0"}
  `}
        >
          <div className="w-[350px] bg-white border-l shadow-lg flex flex-col">
            <div className="p-5 border-b">
              <h2 className="text-2xl font-bold">Chat</h2>
            </div>

            {messages.map((msg, index) => (
              <div key={index} className="mb-3">
                <p className="font-semibold">{msg.sender}</p>

                <p>{msg.message}</p>
              </div>
            ))}

            <div className="p-4 border-t">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                className="w-full mt-3 bg-blue-600 text-white py-3 rounded-lg"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetingRoom;
