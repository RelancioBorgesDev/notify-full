export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="
    animate-spin
    rounded-full
    h-8 w-8
    border-4
    border-t-transparent
    border-zinc-950
    dark:border-white
    mx-auto
  "
        aria-label="Carregando..."
      />
    </div>
  );
}
