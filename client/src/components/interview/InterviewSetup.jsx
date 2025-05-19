import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import InterviewContext from "../../context/InterviewContext";
import Button from "../common/Button";
import Spinner from "../layout/Spinner";
import log from "loglevel";

function InterviewSetup() {
  const { uploadResumeOnly, start, loading } = useContext(InterviewContext);
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onDropResume = (acceptedFiles) => {
    setResume(acceptedFiles[0]);
    setError(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropResume,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  });

  const handleStart = async () => {
    if (!resume || !jobDescription.trim()) {
      setError("Please upload resume and enter job description");
      return;
    }

    try {
      const { resumeUrl, resumeText } = await uploadResumeOnly(resume);
      const interview = await start({
        resumeUrl,
        resumeText,
        jobDescription,
      });
      log.info("Interview started:", interview._id);
      navigate(`/interview/${interview._id}`);
    } catch (err) {
      log.error("Interview start failed:", err);
      setError(err.message || "Something went wrong!");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Start AI Interview</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium">Resume (PDF)</label>
        <div
          {...getRootProps()}
          className="mt-2 border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:bg-gray-50"
        >
          <input {...getInputProps()} />
          <p>
            {resume ? resume.name : "Drag & drop or click to select resume"}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Job Description</label>
        <textarea
          rows={5}
          className="w-full border border-gray-300 rounded p-2 mt-1"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
        />
      </div>

      <Button onClick={handleStart} disabled={loading} className="w-full">
        {loading ? <Spinner /> : "Start Interview"}
      </Button>
    </div>
  );
}

export default InterviewSetup;
