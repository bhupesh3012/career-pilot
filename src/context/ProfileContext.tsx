import React, { createContext, useContext, useState, useEffect } from "react";

export interface ProfileData {
  full_name: string;
  email: string;
  skills: string[];
  ats_score: number;
  profile_completion: number;
  identified_gaps: string[];
  active_applications: number;
}

export interface ProfileContextType {
  profile: ProfileData;
  isLoading: boolean;
  refreshProfileData: () => Promise<void>;
  updateProfileFromParsedResume: (parsedData: Partial<ProfileData>) => void;
  resetProfile: (isNewUser?: boolean) => void;
  /** Called immediately after login to stamp the authenticated user's identity onto the profile. */
  setProfileIdentity: (name: string, email: string) => void;
}

const DEFAULT_PROFILE: ProfileData = {
  full_name: "",
  email: "",
  skills: ["React", "Node.js", "JavaScript", "git"],
  ats_score: 78,
  profile_completion: 85,
  identified_gaps: [
    "Distributed Systems",
    "Cloud Engineering (AWS/GCP)",
    "Security & Compliance",
    "Business Alignment"
  ],
  active_applications: 3
};

const initialBlankProfile: ProfileData = {
  full_name: "",
  email: "",
  skills: [],
  ats_score: 0,
  profile_completion: 0,
  identified_gaps: [],
  active_applications: 0
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(initialBlankProfile);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("careerpilot_profile");
      if (cached) {
        setProfile(JSON.parse(cached));
      } else {
        setProfile(initialBlankProfile);
      }
    } catch (e) {
      console.error("Failed to load profile from localStorage:", e);
    }
  }, []);

  // Sync helper that updates state and localStorage
  const saveProfile = (newProfile: ProfileData) => {
    setProfile(newProfile);
    try {
      localStorage.setItem("careerpilot_profile", JSON.stringify(newProfile));
    } catch (e) {
      console.error("Failed to save profile to localStorage:", e);
    }
  };

  const refreshProfileData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate calling Supabase or external DB profile endpoint
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const cached = localStorage.getItem("careerpilot_profile");
      if (cached) {
        setProfile(JSON.parse(cached));
      } else {
        saveProfile(initialBlankProfile);
      }
    } catch (e) {
      console.error("Failed to refresh profile data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileFromParsedResume = (parsedData: Partial<ProfileData>) => {
    const updated: ProfileData = {
      ...profile,
      ...parsedData,
      // If profile completion is not provided, we dynamically scale completion or set to 95 if starting at 0
      profile_completion: parsedData.profile_completion 
        ? parsedData.profile_completion 
        : profile.profile_completion === 0 
          ? 95 
          : Math.min(100, Math.max(85, profile.profile_completion + 5)),
      // Set active_applications to 3 if starting at 0
      active_applications: parsedData.active_applications !== undefined
        ? parsedData.active_applications
        : profile.active_applications === 0 
          ? 3 
          : profile.active_applications
    };
    saveProfile(updated);
  };

  const resetProfile = (isNewUser?: boolean) => {
    const targetBase = isNewUser ? initialBlankProfile : DEFAULT_PROFILE;
    saveProfile(targetBase);
  };

  /**
   * Stamps the authenticated user's name and email onto the profile without
   * touching any other metrics. Called right after a successful login/sign-up
   * so the UI immediately reflects the correct identity.
   */
  const setProfileIdentity = (name: string, email: string) => {
    const updated: ProfileData = { ...profile, full_name: name, email };
    saveProfile(updated);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        refreshProfileData,
        updateProfileFromParsedResume,
        resetProfile,
        setProfileIdentity
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
