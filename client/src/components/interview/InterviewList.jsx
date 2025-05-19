import { Link } from "react-router-dom";
import log from "loglevel";

function InterviewList({ interviews }) {
  if (!interviews || interviews.length === 0) {
    log.info("No interviews found for InterviewList");
    return <p className="text-gray-500">No past interviews.</p>;
  }

  return (
    <div className="grid gap-4">
      {interviews.map((interview) => (
        <div
          key={interview.id}
          className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold">
              Interview #{interview.id} -{" "}
              {new Date(interview.createdAt).toLocaleDateString()}
            </h3>
            <p className="text-gray-600">
              Status: {interview.status || "Completed"}
            </p>
          </div>
          <Link
            to={`/feedback/${interview._id}`}
            className="text-primary hover:underline"
          >
            View Feedback
          </Link>
        </div>
      ))}
    </div>
  );
}

export default InterviewList;
