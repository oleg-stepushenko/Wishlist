export default function ItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="p-4 bg-white/90 dark:bg-gray-700/70 shadow rounded-xl">
      <h3 className="text-lg font-bold">{item.title}</h3>
      <p className="text-sm opacity-90 whitespace-pre-wrap">{item.description}</p>
      <div className="mt-2 flex flex-col gap-1">
        {item.links?.map((l,i)=>(
          <a key={i} href={l} target="_blank" rel="noreferrer" className="text-sm underline text-blue-600 dark:text-blue-300">Посилання {i+1}</a>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <button onClick={onEdit} className="px-3 py-1 rounded bg-yellow-400">Ред.</button>
        <button onClick={onDelete} className="px-3 py-1 rounded bg-red-500 text-white">Видалити</button>
      </div>
    </div>
  );
}
