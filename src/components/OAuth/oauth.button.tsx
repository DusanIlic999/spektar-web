export default function OAuthButton() {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button
        onClick={handleGoogleLogin}
        className="w-fit h-fit px-3 py-2 bg-blue-800/80 rounded-sm cursor-pointer select-none"
      >
        Prijavi se preko Google-a
      </button>
    </div>
  );
}
