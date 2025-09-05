"use client";

import React, { useState, useEffect } from 'react';

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

const ProfileManager: React.FC<ProfileManagerProps> = ({ sessionId, onUpdate }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchProfile();
  }, [sessionId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/user/profile?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.profile);
          setFormData(data.profile);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
    if (confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:8000/api/user/profile?session_id=${sessionId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          localStorage.removeItem('neethisaarathi_session_id');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error deleting profile:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No profile found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-2xl p-6 mb-6 border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
            <p className="text-gray-600">Personalized legal assistance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={handleDeleteProfile}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Delete Profile
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
          
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={formData.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Social Category</label>
                <select
                  value={formData.social_category || ''}
                  onChange={(e) => handleInputChange('social_category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                <select
                  value={formData.annual_income || ''}
                  onChange={(e) => handleInputChange('annual_income', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Income</option>
                  <option value="Less than ₹1 lakh">Less than ₹1 lakh</option>
                  <option value="₹1-3 lakh">₹1-3 lakh</option>
                  <option value="₹3-8 lakh">₹3-8 lakh</option>
                  <option value="Above ₹8 lakh">Above ₹8 lakh</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Has Disability</label>
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => handleInputChange('has_disability', true)}
                    className={`px-4 py-2 rounded-lg ${
                      formData.has_disability === true 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleInputChange('has_disability', false)}
                    className={`px-4 py-2 rounded-lg ${
                      formData.has_disability === false 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p><span className="font-semibold">State:</span> {profile.state}</p>
              <p><span className="font-semibold">Gender:</span> {profile.gender}</p>
              <p><span className="font-semibold">Social Category:</span> {profile.social_category}</p>
              <p><span className="font-semibold">Annual Income:</span> {profile.annual_income}</p>
              <p><span className="font-semibold">Disability:</span> {profile.has_disability ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>

        {/* Occupation Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Occupation Details</h2>
          
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                <select
                  value={formData.occupation || ''}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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

              {/* Add occupation-specific fields here based on selected occupation */}
              {formData.occupation === 'Student' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Education Level</label>
                    <input
                      type="text"
                      value={formData.education_level || ''}
                      onChange={(e) => handleInputChange('education_level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Undergraduate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                    <input
                      type="text"
                      value={formData.field_of_study || ''}
                      onChange={(e) => handleInputChange('field_of_study', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Engineering"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grades</label>
                    <input
                      type="text"
                      value={formData.grades || ''}
                      onChange={(e) => handleInputChange('grades', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., 8.5 CGPA"
                    />
                  </div>
                </>
              )}

              {/* Add similar fields for other occupations */}
            </div>
          ) : (
            <div className="space-y-3">
              <p><span className="font-semibold">Occupation:</span> {profile.occupation}</p>
              {profile.education_level && <p><span className="font-semibold">Education:</span> {profile.education_level}</p>}
              {profile.field_of_study && <p><span className="font-semibold">Field:</span> {profile.field_of_study}</p>}
              {profile.grades && <p><span className="font-semibold">Grades:</span> {profile.grades}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      {editing && (
        <div className="mt-6 text-center">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Profile Metadata */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Profile created: {new Date(profile.created_at!).toLocaleDateString()}</p>
        {profile.updated_at && <p>Last updated: {new Date(profile.updated_at).toLocaleDateString()}</p>}
      </div>
    </div>
  );
};

export default ProfileManager;
