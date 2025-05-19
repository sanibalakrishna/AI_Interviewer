import { useEffect, useState, useContext, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import InterviewContext from "../../context/InterviewContext";
import Spinner from "../layout/Spinner";
import { useNavigate } from "react-router-dom";

function ChatInterface({ interviewId }) {
  const {
    fetchMessages,
    sendMessage,
    messages,
    loadingMessages,
    sending,
    error,
    end,
    feedback,
    setFeedback,
  } = useContext(InterviewContext);
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const interviewerQuestionsCount = messages.filter(
    (msg) => msg.sender === "ai"
  ).length;

  const isInterviewEnded = interviewerQuestionsCount >= 10;

  // Text-to-Speech for AI messages
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === "ai") {
      const utterance = new SpeechSynthesisUtterance(lastMessage.text);
      window.speechSynthesis.speak(utterance);
    }
  }, [messages]);

  // Auto end interview after 10th question
  useEffect(() => {
    const tryEndInterview = async () => {
      if (isInterviewEnded && interviewId && !feedback) {
        try {
          const feedbackResponse = await end(interviewId);
          setFeedback(feedbackResponse);
          navigate("/");
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
    resetTranscript();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setInput(transcript);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }

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
                <strong>Feedback:</strong>{" "}
                {typeof feedback === "string"
                  ? feedback
                  : feedback.detailedFeedback}
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
            placeholder="Type or speak your answer..."
            value={input || transcript}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`px-3 py-2 rounded ${
              listening ? "bg-red-500" : "bg-gray-200"
            }`}
            onClick={handleMicClick}
            title={listening ? "Stop recording" : "Start recording"}
          >
            🎤
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleSend}
            disabled={sending || (!input.trim() && !transcript.trim())}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatInterface;
