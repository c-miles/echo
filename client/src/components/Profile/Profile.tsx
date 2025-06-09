import React, { useEffect, useRef } from "react";
import { User, Edit } from "lucide-react";
import { ProfileProps } from "../../types/profileTypes";
import { Button, Input } from "../atoms";

const Profile: React.FC<ProfileProps> = ({
  username,
  setUsername,
  handleSubmit,
  error,
  userInfo,
  isEditing,
  setIsEditing,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsEditing]);

  const formatDate = (date?: Date): string => {
    if (!date) return "Date not available";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const joinedDate = formatDate(userInfo?.createdAt);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8">
      <div className="w-full max-w-md bg-surface p-8 rounded-lg border border-slate-700">
        <div className="flex flex-col items-center">
          {userInfo?.picture ? (
            <img
              src={userInfo.picture}
              alt={userInfo?.username || "User"}
              className="w-32 h-32 rounded-full mb-6"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center mb-6">
              <User size={48} className="text-text" />
            </div>
          )}
          
          <h2 className="text-3xl font-bold text-text mb-2">
            {userInfo?.username}
          </h2>
          
          <p className="text-text-muted mb-6">
            Joined yap: {joinedDate}
          </p>
          
          {!isEditing && (
            <Button
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit size={16} />
              Edit Profile
            </Button>
          )}
        </div>
        
        {isEditing && (
          <form ref={formRef} onSubmit={handleSubmit} className="mt-8">
            <label className="block text-sm font-medium text-text mb-2">
              Username
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={error}
              placeholder="Enter new username"
              className="mb-4"
            />
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
            >
              Update Username
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
