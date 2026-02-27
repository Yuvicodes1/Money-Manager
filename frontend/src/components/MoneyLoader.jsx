export default function MoneyLoader({ size = "md", text = "Loading..." }) {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`border-r-2 rounded-full border-yellow-500 bg-yellow-300 animate-bounce
        aspect-square ${sizes[size]} flex justify-center items-center
        text-yellow-700 font-bold shadow-lg shadow-yellow-200`}>
        $
      </div>
      {text && (
        <p className="text-sm text-lightMuted dark:text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
}