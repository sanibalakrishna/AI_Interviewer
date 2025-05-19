import { useEffect, useState, useContext, useRef } from "react";
import InterviewContext from "../../context/InterviewContext";
import Spinner from "../layout/Spinner";

function ChatInterface({ interviewId }) {
  const {
    fetchMessages,
    sendMessage,
    messages,
    loadingMessages,
    sending,
    error,
    end,
  } = useContext(InterviewContext);

  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const chatEndRef = useRef(null);

  const interviewerQuestionsCount = messages.filter(
    (msg) => msg.sender === "ai"
  ).length;

  const isInterviewEnded = interviewerQuestionsCount >= 10;

  // Auto end interview after 10th question
  useEffect(() => {
    const tryEndInterview = async () => {
      if (isInterviewEnded && interviewId && !feedback) {
        try {
          const feedbackResponse = await end(interviewId);
          setFeedback(feedbackResponse);
        } catch (err) {
          console.error("Failed to end interview:", err);
        }
      }
    };
    tryEndInterview();
  }, [isInterviewEnded, interviewId]);

  useEffect(() => {
    fetchMessages(interviewId);
  }, [interviewId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isInterviewEnded) return;
    await sendMessage(interviewId, input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loadingMessages) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col h-[75vh] border rounded shadow p-4">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[70%] ${
              msg.sender === "user"
                ? "bg-blue-100 self-end text-right"
                : "bg-gray-100 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {isInterviewEnded && (
          <div className="bg-green-100 self-start p-3 rounded-lg max-w-[70%] text-sm text-gray-700">
            Interview completed. Thank you for your responses.
            {feedback && (
              <div className="mt-2 text-gray-800">
                <strong>Feedback:</strong> {feedback}
              </div>
            )}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {!isInterviewEnded && (
        <div className="flex items-center gap-2">
          <textarea
            className="flex-1 border p-2 rounded resize-none"
            rows={2}
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleSend}
            disabled={sending || !input.trim()}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;
