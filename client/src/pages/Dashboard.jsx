import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import log from "loglevel";
import InterviewContext from "../context/InterviewContext";
import InterviewSetup from "../components/interview/InterviewSetup";
import InterviewList from "../components/interview/InterviewList";
import Spinner from "../components/layout/Spinner";

function Dashboard() {
  const { history, fetchHistory, loading, error } =
    useContext(InterviewContext);

  useEffect(() => {
    fetchHistory().catch((err) =>
      log.error("Dashboard fetch history error:", err)
    );
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <InterviewSetup />
      <h2 className="text-2xl font-bold my-6">Past Interviews</h2>
      {loading ? <Spinner /> : <InterviewList interviews={history} />}
    </div>
  );
}

export default Dashboard;
