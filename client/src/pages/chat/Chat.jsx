import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Chat() {
  const { claimId } = useParams();
  const { user } = useAuth();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadConversation = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/chat/claims/${claimId}`);

        setConversation(response.data.conversation);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to open this conversation."
        );
      } finally {
        setLoading(false);
      }
    };

    if (claimId) {
      loadConversation();
    }
  }, [claimId]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversation?._id) return;

      try {
        const response = await api.get(
          `/chat/conversations/${conversation._id}/messages`
        );

        setMessages(response.data.messages);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load messages."
        );
      }
    };

    loadMessages();
  }, [conversation]);

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!messageText.trim() || !conversation?._id || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await api.post(
        `/chat/conversations/${conversation._id}/messages`,
        {
          text: messageText.trim(),
        }
      );

      setMessages((currentMessages) => [
        ...currentMessages,
        response.data.data,
      ]);

      setMessageText("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Opening chat...</p>
      </div>
    );
  }

  if (error && !conversation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="text-center">
          <p className="text-red-400">{error}</p>

          <Link
            to="/dashboard"
            className="mt-5 inline-block text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const otherParticipant = conversation?.participants?.find(
    (participant) => participant._id !== user?._id
  );

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col">
        <Link
          to="/dashboard"
          className="mb-6 inline-block text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl backdrop-blur-xl"
        >
          {/* Chat Header */}
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
              CampusFind Chat
            </p>

            <h1 className="mt-2 text-2xl font-bold">
              {otherParticipant?.name || "CampusFind User"}
            </h1>

            <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
              <span>
                {otherParticipant?.branch || "—"}
              </span>

              <span>•</span>

              <span>
                {otherParticipant?.usn || "—"}
              </span>
            </div>

            {/* Item Details */}
            {conversation?.item && (
              <div className="mt-4 rounded-2xl border border-indigo-400/10 bg-indigo-400/[0.05] px-4 py-3">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Item
                </p>

                <p className="mt-1 font-semibold">
                  {conversation.item.title}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {conversation.item.category} ·{" "}
                  {conversation.item.location}
                </p>
              </div>
            )}

            {/* Return Confirmation */}
            <Link
              to={`/returns/${claimId}`}
              className="mt-4 block rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.06] px-5 py-4 transition hover:bg-indigo-400/[0.1]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-indigo-300">
                    🤝 Return Confirmation
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Confirm the item handover and complete the
                    return.
                  </p>
                </div>

                <span className="text-slate-400">→</span>
              </div>
            </Link>
          </div>

          {/* Messages */}
          <div className="flex min-h-[450px] flex-col gap-4 overflow-y-auto px-5 py-6 sm:px-6">
            {messages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-center">
                <div>
                  <p className="text-lg font-semibold">
                    Start the conversation
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Discuss ownership details and arrange the
                    item handover.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isMine =
                  message.sender?._id === user?._id;

                return (
                  <div
                    key={message._id}
                    className={`flex ${
                      isMine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        isMine
                          ? "bg-indigo-500 text-white"
                          : "border border-white/10 bg-white/[0.05] text-slate-200"
                      }`}
                    >
                      {!isMine && (
                        <p className="mb-1 text-xs font-semibold text-indigo-400">
                          {message.sender?.name || "User"}
                        </p>
                      )}

                      <p className="text-sm leading-6">
                        {message.text}
                      </p>

                      <p
                        className={`mt-1 text-[10px] ${
                          isMine
                            ? "text-indigo-100"
                            : "text-slate-500"
                        }`}
                      >
                        {new Date(
                          message.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="px-6 pb-3">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-white/10 p-4 sm:p-5"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={messageText}
                onChange={(event) =>
                  setMessageText(event.target.value)
                }
                placeholder="Type your message..."
                maxLength={1000}
                className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-400/40 focus:bg-white/[0.06]"
              />

              <button
                type="submit"
                disabled={
                  sending || !messageText.trim()
                }
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Chat;