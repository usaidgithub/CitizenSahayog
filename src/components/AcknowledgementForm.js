import React, { useState,useEffect } from "react";
import "./AcknowledgementForm.css"; // External CSS for styling
import { useParams,useNavigate} from "react-router-dom"; // Import useParams
const AcknowledgementForm = () => {
  const navigate=useNavigate();
  const { postId } = useParams(); // Extract post ID from URL
  const [formData, setFormData] = useState({
    postId: postId || "",  // Automatically set the post ID,
    officerName: "",
    designation: "",
    department: "",
    expectedResolution: "",
    assignedAuthority: "",
    status: "Acknowledged",
    ward: "",
    remarks: "",
    actionPlan: "",
    expectedCost: "",
  });
  useEffect(() => {
    if (postId) {
      setFormData((prevData) => ({
        ...prevData,
        postId: postId, // Set postId only if available
      }));
    }
  }, [postId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:5000/acknowledgement", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            navigate('/adminhome');
            setFormData({
                postId: "",
                officerName: "",
                designation: "",
                department: "",
                expectedResolution: "",
                assignedAuthority: "",
                status: "Acknowledged",
                ward: "",
                remarks: "",
                actionPlan: "",
                expectedCost: ""
            });
        } else {
            alert("Failed to submit acknowledgement.");
        }
    } catch (error) {
        console.error("Error submitting acknowledgement:", error);
    }
};


  return (
    <div className="form-container">
      <h2>Acknowledgement Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="postId">Post ID:</label>
          <input
            type="text"
            id="postId"
            name="postId"
            placeholder="Enter the Post ID related to the issue"
            value={formData.postId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="officerName">Officer Name:</label>
          <input
            type="text"
            id="officerName"
            name="officerName"
            placeholder="Enter the officer's full name"
            value={formData.officerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="designation">Designation:</label>
          <input
            type="text"
            id="designation"
            name="designation"
            placeholder="Enter your official designation"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            name="department"
            placeholder="Enter the relevant department name"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expectedResolution">Expected Resolution Date:</label>
          <input
            type="date"
            id="expectedResolution"
            name="expectedResolution"
            value={formData.expectedResolution}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="assignedAuthority">Assigned Authority:</label>
          <input
            type="text"
            id="assignedAuthority"
            name="assignedAuthority"
            placeholder="Enter the name of the assigned authority"
            value={formData.assignedAuthority}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} required>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ward">Ward Handling the Case:</label>
          <input
            type="text"
            id="ward"
            name="ward"
            placeholder="Enter the ward handling the case (e.g., E Ward, L Ward)"
            value={formData.ward}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="remarks">Remarks:</label>
          <textarea
            id="remarks"
            name="remarks"
            placeholder="Enter any additional details or updates about the resolution"
            value={formData.remarks}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="actionPlan">Action Plan:</label>
          <textarea
            id="actionPlan"
            name="actionPlan"
            placeholder="Describe the action plan for resolving this issue"
            value={formData.actionPlan}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="expectedCost">Expected Cost:</label>
          <input
            type="number"
            id="expectedCost"
            name="expectedCost"
            placeholder="Enter the estimated cost for issue resolution (if applicable)"
            value={formData.expectedCost}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AcknowledgementForm;
