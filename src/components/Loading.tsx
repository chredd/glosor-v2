export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="relative">
        {/* Animated emojis */}
        <div className="text-5xl animate-bounce">📚</div>
        <div
          className="absolute -top-2 -right-2 text-2xl animate-sparkle"
          style={{ animationDelay: '0.2s' }}
        >
          ✨
        </div>
        <div
          className="absolute -bottom-1 -left-2 text-2xl animate-sparkle"
          style={{ animationDelay: '0.5s' }}
        >
          ⭐
        </div>
      </div>
      <p className="mt-4 text-white font-bold text-lg">Laddar glosor...</p>
      <div className="flex gap-1 mt-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
