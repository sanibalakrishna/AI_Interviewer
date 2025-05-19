import { useParams } from "react-router-dom";
import ChatInterface from "../components/interview/ChatInterface";
import Spinner from "../components/layout/Spinner";
import { useContext } from "react";
import InterviewContext from "../context/InterviewContext";

function InterviewPage() {
  const { id } = useParams();
  const { interview, loading, error } = useContext(InterviewContext);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!interview || interview._id !== id) {
    return <p className="text-gray-500">Interview not found.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Interview #{id}</h1>
      <ChatInterface interviewId={id} />
    </div>
  );
}

export default InterviewPage;
