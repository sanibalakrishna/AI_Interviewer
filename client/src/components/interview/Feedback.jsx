import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import log from "loglevel";
import InterviewContext from "../../context/InterviewContext";
import Spinner from "../layout/Spinner";

function Feedback() {
  const { loading, error, feedback, fetchFeedback } =
    useContext(InterviewContext);
  const { id } = useParams();

  useEffect(() => {
    fetchFeedback(id).catch((err) =>
      log.error("Failed to load feedback:", err)
    );
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!feedback) {
    return <p className="text-gray-500">No feedback available.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-3xl font-bold text-center mb-4">
        Interview Feedback
      </h2>

      <div>
        <h3 className="text-xl font-semibold">Overall Score</h3>
        <p className="text-lg text-blue-600 font-bold">
          {feedback.overallScore} / 5
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Strengths</h3>
        <ul className="list-disc list-inside text-green-700">
          {feedback.strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Areas for Improvement</h3>
        <ul className="list-disc list-inside text-red-700">
          {feedback.areasForImprovement.map((area, i) => (
            <li key={i}>{area}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Technical Assessment</h3>
        <p>{feedback.technicalAssessment}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Communication Assessment</h3>
        <p>{feedback.communicationAssessment}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Job Fit Assessment</h3>
        <p>{feedback.jobFitAssessment}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Recommended Resources</h3>
        <ul className="list-disc list-inside text-gray-700">
          {feedback.recommendedResources.map((res, i) => (
            <li key={i}>{res}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Detailed Feedback</h3>
        <p>{feedback.detailedFeedback}</p>
      </div>
    </div>
  );
}

export default Feedback;
