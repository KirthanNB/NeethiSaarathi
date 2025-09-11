"use client";

import React, { useState, useEffect } from "react";

interface Profile {
  session_id: string;
  state: string;
  gender: string;
  social_category: string;
  annual_income: string;
  has_disability: boolean;
  occupation: string;
  education_level?: string;
  field_of_study?: string;
  grades?: string;
  land_ownership?: boolean;
  land_size?: string;
  crop_type?: string;
  business_type?: string;
  business_needs?: string;
  highest_education?: string;
  employment_seeking?: boolean;
  pension_status?: boolean;
  health_needs?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ProfileManagerProps {
  sessionId: string;
  onUpdate: (data: any) => Promise<boolean>;
}

// Custom hook for responsive styles
const useResponsiveStyles = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 768;

  const container = {
    maxWidth: isMobile ? '95%' : '1000px',
    margin: '0 auto',
    padding: isMobile ? '1rem' : '1.5rem',
  };

  const header = {
    background: "linear-gradient(to right, #fff7ed, #f0fdf4)",
    borderRadius: "16px",
    padding: isMobile ? '1rem' : '1.5rem',
    marginBottom: "1.5rem",
    border: "1px solid #fed7aa",
  };

  const headerContent = {
    display: "flex",
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: "space-between",
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: isMobile ? '1rem' : '0.75rem',
  };

  const headerTitle = {
    fontSize: isMobile ? '1.25rem' : '1.5rem',
    fontWeight: "bold",
    color: "#111",
  };

  const headerSub = {
    color: "#666",
    fontSize: isMobile ? '0.8rem' : 'inherit',
  };

  const buttonGroup = {
    display: "flex",
    flexDirection: isMobile ? 'column' : 'row',
    gap: "0.75rem",
    width: isMobile ? '100%' : 'auto',
  };

  const button = {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    width: isMobile ? '100%' : 'auto',
  };

  const contentGrid = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "1.5rem",
  };

  const card = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  };

  const cardTitle = {
    fontSize: "1.125rem",
    fontWeight: 600,
    marginBottom: "1rem",
  };

  const formGroup = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const label = {
    fontSize: "0.9rem",
    fontWeight: 500,
    marginBottom: '0.25rem',
  };

  const input = {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
  };

  const radioGroup = {
    display: "flex",
    flexDirection: isMobile ? 'column' : 'row',
    gap: "1rem",
    marginTop: "0.5rem",
  };

  const infoGroup = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const saveButtonContainer = {
    textAlign: "center",
    marginTop: "1.5rem",
  };

  const saveButton = {
    padding: "0.75rem 2rem",
    background: "linear-gradient(to right, #f97316, #22c55e)",
    color: "white",
    fontWeight: 600,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const metadata = {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#666",
  };

  return {
    container,
    header,
    headerContent,
    headerTitle,
    headerSub,
    buttonGroup,
    button,
    contentGrid,
    card,
    cardTitle,
    formGroup,
    label,
    input,
    radioGroup,
    infoGroup,
    saveButtonContainer,
    saveButton,
    metadata,
    isMobile,
  };
};

const ProfileManager: React.FC<ProfileManagerProps> = ({
  sessionId,
  onUpdate,
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const responsiveStyles = useResponsiveStyles();

  useEffect(() => {
    fetchProfile();
  }, [sessionId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/profile?session_id=${sessionId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.profile);
          setFormData(data.profile);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const success = await onUpdate(formData);
    if (success) {
      await fetchProfile();
      setEditing(false);
    }
    setLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDeleteProfile = async () => {
    if (
      confirm(
        "Are you sure you want to delete your profile? This cannot be undone."
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/user/profile?session_id=${sessionId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          localStorage.removeItem("neethisaarathi_session_id");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            border: "3px solid #f3f3f3",
            borderTop: "3px solid orange",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#666" }}>No profile found.</p>
      </div>
    );
  }

  return (
    <div style={responsiveStyles.container}>
      {/* Profile Header */}
      <div style={responsiveStyles.header}>
        <div style={responsiveStyles.headerContent}>
          <div>
            <h1 style={responsiveStyles.headerTitle}>Your Profile</h1>
            <p style={responsiveStyles.headerSub}>Personalized legal assistance</p>
          </div>
          <div style={responsiveStyles.buttonGroup}>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                ...responsiveStyles.button,
                backgroundColor: "#f97316",
                color: "white",
              }}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
            <button
              onClick={handleDeleteProfile}
              style={{
                ...responsiveStyles.button,
                backgroundColor: "#ef4444",
                color: "white",
              }}
            >
              Delete Profile
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div style={responsiveStyles.contentGrid}>
        {/* Basic Information */}
        <div style={responsiveStyles.card}>
          <h2 style={responsiveStyles.cardTitle}>Basic Information</h2>
          {editing ? (
            <div style={responsiveStyles.formGroup}>
              {/* State */}
              <div>
                <label style={responsiveStyles.label}>State</label>
                <input
                  type="text"
                  value={formData.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  style={responsiveStyles.input}
                />
              </div>
              {/* Gender */}
              <div>
                <label style={responsiveStyles.label}>Gender</label>
                <select
                  value={formData.gender || ""}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  style={responsiveStyles.input}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* Social Category */}
              <div>
                <label style={responsiveStyles.label}>Social Category</label>
                <select
                  value={formData.social_category || ""}
                  onChange={(e) => handleInputChange("social_category", e.target.value)}
                  style={responsiveStyles.input}
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {/* Annual Income */}
              <div>
                <label style={responsiveStyles.label}>Annual Income</label>
                <select
                  value={formData.annual_income || ""}
                  onChange={(e) => handleInputChange("annual_income", e.target.value)}
                  style={responsiveStyles.input}
                >
                  <option value="">Select Income</option>
                  <option value="Less than ₹1 lakh">Less than ₹1 lakh</option>
                  <option value="₹1-3 lakh">₹1-3 lakh</option>
                  <option value="₹3-8 lakh">₹3-8 lakh</option>
                  <option value="Above ₹8 lakh">Above ₹8 lakh</option>
                </select>
              </div>
              {/* Disability */}
              <div>
                <label style={responsiveStyles.label}>Has Disability</label>
                <div style={responsiveStyles.radioGroup}>
                  <button
                    onClick={() => handleInputChange("has_disability", true)}
                    style={{
                      ...responsiveStyles.button,
                      backgroundColor:
                        formData.has_disability === true ? "#22c55e" : "#f3f4f6",
                      color: formData.has_disability === true ? "white" : "#333",
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleInputChange("has_disability", false)}
                    style={{
                      ...responsiveStyles.button,
                      backgroundColor:
                        formData.has_disability === false ? "#ef4444" : "#f3f4f6",
                      color: formData.has_disability === false ? "white" : "#333",
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={responsiveStyles.infoGroup}>
              <p>
                <strong>State:</strong> {profile.state}
              </p>
              <p>
                <strong>Gender:</strong> {profile.gender}
              </p>
              <p>
                <strong>Social Category:</strong> {profile.social_category}
              </p>
              <p>
                <strong>Annual Income:</strong> {profile.annual_income}
              </p>
              <p>
                <strong>Disability:</strong> {profile.has_disability ? "Yes" : "No"}
              </p>
            </div>
          )}
        </div>

        {/* Occupation Details */}
        <div style={responsiveStyles.card}>
          <h2 style={responsiveStyles.cardTitle}>Occupation Details</h2>
          {editing ? (
            <div style={responsiveStyles.formGroup}>
              <div>
                <label style={responsiveStyles.label}>Occupation</label>
                <select
                  value={formData.occupation || ""}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  style={responsiveStyles.input}
                >
                  <option value="">Select Occupation</option>
                  <option value="Student">Student</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Self-Employed/Artisan">Self-Employed/Artisan</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Salaried Employee">Salaried Employee</option>
                  <option value="Senior Citizen">Senior Citizen</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {formData.occupation === "Student" && (
                <>
                  <div>
                    <label style={responsiveStyles.label}>Education Level</label>
                    <input
                      type="text"
                      value={formData.education_level || ""}
                      onChange={(e) => handleInputChange("education_level", e.target.value)}
                      placeholder="e.g., Undergraduate"
                      style={responsiveStyles.input}
                    />
                  </div>
                  <div>
                    <label style={responsiveStyles.label}>Field of Study</label>
                    <input
                      type="text"
                      value={formData.field_of_study || ""}
                      onChange={(e) => handleInputChange("field_of_study", e.target.value)}
                      placeholder="e.g., Engineering"
                      style={responsiveStyles.input}
                    />
                  </div>
                  <div>
                    <label style={responsiveStyles.label}>Grades</label>
                    <input
                      type="text"
                      value={formData.grades || ""}
                      onChange={(e) => handleInputChange("grades", e.target.value)}
                      placeholder="e.g., 8.5 CGPA"
                      style={responsiveStyles.input}
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={responsiveStyles.infoGroup}>
              <p>
                <strong>Occupation:</strong> {profile.occupation}
              </p>
              {profile.education_level && (
                <p>
                  <strong>Education:</strong> {profile.education_level}
                </p>
              )}
              {profile.field_of_study && (
                <p>
                  <strong>Field:</strong> {profile.field_of_study}
                </p>
              )}
              {profile.grades && (
                <p>
                  <strong>Grades:</strong> {profile.grades}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      {editing && (
        <div style={responsiveStyles.saveButtonContainer}>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              ...responsiveStyles.saveButton,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* Metadata */}
      <div style={responsiveStyles.metadata}>
        <p>Profile created: {new Date(profile.created_at!).toLocaleDateString()}</p>
        {profile.updated_at && (
          <p>Last updated: {new Date(profile.updated_at).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileManager;