export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
