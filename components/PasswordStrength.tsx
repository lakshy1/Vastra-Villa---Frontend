export default function PasswordStrength({ password }: any) {
  const getStrength = () => {
    if (password.length > 10) return "Strong";
    if (password.length > 6) return "Medium";
    if (password.length > 0) return "Weak";
    return "";
  };

  const strength = getStrength();

  if (!strength) return null;

  return (
    <div className="mt-3">
      <div className="h-2 rounded-full bg-softSilk overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            strength === "Weak"
              ? "bg-deepRoseGold w-1/3"
              : strength === "Medium"
              ? "bg-champagne w-2/3"
              : "bg-obsidian w-full"
          }`}
        />
      </div>

      <p className="text-sm mt-2 text-obsidian/70">
        Password Strength: {strength}
      </p>
    </div>
  );
}