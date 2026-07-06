import Profile from "../Profile/Profile";

function ProfileSetup() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Profile isSetupMode={true} />
    </div>
  );
}

export default ProfileSetup;
