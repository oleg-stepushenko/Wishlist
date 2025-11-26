export default function ListCard({ list, onOpen, onEdit, onDelete }) {
  return (
    <div className="p-4 bg-white/80 dark:bg-gray-700/70 shadow rounded-2xl cursor-pointer hover:shadow-xl transition">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold">{list.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-300">{list.items?.length || 0} пунктів</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="px-2 py-1 rounded bg-yellow-300 dark:bg-yellow-500">Редагувати</button>
          <button onClick={onDelete} className="px-2 py-1 rounded bg-red-400 text-white">Видалити</button>
        </div>
      </div>
      <div className="mt-3">
        <button onClick={onOpen} className="w-full text-left text-blue-600 dark:text-blue-300 underline">Відкрити список</button>
      </div>
    </div>
  );
}
