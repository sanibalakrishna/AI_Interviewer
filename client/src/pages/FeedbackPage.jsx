import { useParams } from "react-router-dom";
import Feedback from "../components/interview/Feedback";

function FeedbackPage() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Feedback for Interview #{id}</h1>
      <Feedback />
    </div>
  );
}

export default FeedbackPage;
