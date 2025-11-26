import { useEffect, useState } from 'react'
import ListCard from './components/ListCard'
import ItemCard from './components/ItemCard'
import Modal from './components/Modal'
import * as api from './api'
import { motion } from 'framer-motion'

export default function App(){
  const [lists, setLists] = useState([])
  const [activeList, setActiveList] = useState(null)
  const [modal, setModal] = useState(null)
  const [workingList, setWorkingList] = useState({name:'', password:''})
  const [unlockPass, setUnlockPass] = useState('')
  const [error, setError] = useState('')
  const [workingItem, setWorkingItem] = useState({title:'', description:'', links: ['']})

  async function load(){
    const data = await api.getLists()
    setLists(data)
  }

  useEffect(()=>{ load() }, [])

  // create list
  async function createList(){
    if(!workingList.name.trim()) return
    await api.createList(workingList.name, workingList.password)
    setWorkingList({name:'', password:''})
    load()
    setModal(null)
  }

  async function openList(id){
    const res = await api.getList(id)
    if(res && res._id){
      setActiveList(res)
    }
  }

  async function tryUnlock(id){
    const res = await api.unlockList(id, unlockPass)
    if(res.ok){
      const res2 = await api.getList(id)
      setActiveList(res2)
      setUnlockPass('')
      setModal(null)
      setError('')
    } else {
      setError('Невірний пароль')
    }
  }

  function openNewItem(){
    setWorkingItem({title:'', description:'', links: ['']})
    setModal('newItem')
  }

  async function saveNewItem(){
    const res = await api.addItem(activeList._id, workingItem)
    setActiveList(res)
    setModal(null)
  }

  function openEditItem(item){
    setWorkingItem({...item})
    setModal('editItem')
  }

  async function saveEditItem(){
    const res = await api.editItem(activeList._id, workingItem._id || workingItem.id, workingItem)
    setActiveList(res)
    setModal(null)
  }

  async function handleDeleteItem(itemId){
    if(!confirm('Видалити пункт?')) return
    await api.deleteItem(activeList._id, itemId)
    const res = await api.getList(activeList._id)
    setActiveList(res)
  }

  async function handleDeleteList(listId){
    if(!confirm('Видалити список?')) return
    await api.deleteList(listId)
    load()
  }

  async function saveEditList(){
    await api.editList(workingList._id, { name: workingList.name, password: workingList.password })
    setModal(null)
    load()
  }

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">🌟 Мій Вішлист</h1>
        </header>

        {!activeList && (
          <>
            <div className="mb-4 flex gap-3">
              <button onClick={()=>{ setWorkingList({name:'', password:''}); setModal('newList') }} className="px-4 py-2 bg-blue-500 text-white rounded-xl">Новий список</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lists.map(l=>(
                <motion.div key={l._id || l.id} whileHover={{ scale: 1.02 }}>
                  <ListCard list={l} onOpen={()=>openList(l._id || l.id)} onEdit={() => { setWorkingList(l); setModal('editList') }} onDelete={() => handleDeleteList(l._id || l.id)} />
                </motion.div>
              ))}
            </div>
          </>
        )}

        {activeList && (
          <>
            <div className="mb-4 flex items-center gap-3">
              <button onClick={()=>setActiveList(null)} className="px-3 py-2 bg-gray-300 rounded-xl">⬅ Назад</button>
              <h2 className="text-xl font-semibold">{activeList.name}</h2>
              <div className="ml-auto flex gap-3">
                <button onClick={openNewItem} className="px-3 py-2 bg-green-500 text-white rounded-xl">Додати пункт</button>
                <button onClick={()=>{ setWorkingList(activeList); setModal('editList') }} className="px-3 py-2 bg-yellow-400 rounded-xl">Редагувати список</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              { (activeList.items || []).map(it=>(
                <ItemCard key={it._id || it.id} item={it} onEdit={()=>openEditItem(it)} onDelete={()=>handleDeleteItem(it._id || it.id)} />
              )) }
            </div>
          </>
        )}

      </div>

      {/* Modals */}
      <Modal open={modal === 'newList'} onClose={()=>setModal(null)} title="Новий список">
        <input className="w-full p-2 mb-2 rounded text-black dark:text-white" placeholder="Назва" value={workingList.name} onChange={e=>setWorkingList({...workingList, name: e.target.value})} />
        <input className="w-full p-2 mb-2 rounded text-black dark:text-white" placeholder="Пароль (опційно)" value={workingList.password} onChange={e=>setWorkingList({...workingList, password: e.target.value})} />
        <div className="flex gap-2">
          <button onClick={createList} className="px-3 py-2 bg-blue-500 text-white rounded">Створити</button>
          <button onClick={()=>setModal(null)} className="px-3 py-2 bg-gray-300 rounded">Відміна</button>
        </div>
      </Modal>

      <Modal open={modal === 'editList'} onClose={()=>setModal(null)} title="Редагувати список">
        <input className="w-full p-2 mb-2 rounded text-black dark:text-white" placeholder="Назва" value={workingList.name} onChange={e=>setWorkingList({...workingList, name: e.target.value})} />
        <input className="w-full p-2 mb-2 rounded text-black dark:text-white" placeholder="Пароль" value={workingList.password} onChange={e=>setWorkingList({...workingList, password: e.target.value})} />
        <div className="flex gap-2">
          <button onClick={saveEditList} className="px-3 py-2 bg-blue-500 text-white rounded">Зберегти</button>
          <button onClick={()=>setModal(null)} className="px-3 py-2 bg-gray-300 rounded">Відміна</button>
        </div>
      </Modal>

      <Modal open={modal === 'unlock'} onClose={()=>setModal(null)} title="Введіть пароль">
        <input className="w-full p-2 mb-2 rounded text-black dark:text-white" placeholder="Пароль" value={unlockPass} onChange={e=>setUnlockPass(e.target.value)} />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button onClick={()=>tryUnlock(workingList._id || workingList.id)} className="px-3 py-2 bg-blue-500 text-white rounded">Відкрити</button>
          <button onClick={()=>setModal(null)} className="px-3 py-2 bg-gray-300">Відміна</button>
        </div>
      </Modal>

      <Modal open={modal === 'newItem'} onClose={()=>setModal(null)} title="Новий пункт">
        <input className="w-full p-2 mb-2 rounded text-black dark:text-white" placeholder="Назва" value={workingItem.title} onChange={e=>setWorkingItem({...workingItem, title: e.target.value})} />
        <textarea className="w-full p-2 mb-2 rounded text-black dark:text-white" placeholder="Опис" value={workingItem.description} onChange={e=>setWorkingItem({...workingItem, description: e.target.value})} />
        {workingItem.links.map((l,i)=>(
          <input key={i} className="w-full p-2 mb-2 rounded text-black dark:text-white" placeholder={`Посилання ${i+1}`} value={l} onChange={e=>{ const nxt=[...workingItem.links]; nxt[i]=e.target.value; setWorkingItem({...workingItem, links: nxt}) }} />
        ))}
        <div className="flex gap-2">
          <button onClick={()=>setWorkingItem({...workingItem, links: [...workingItem.links, '']})} className="px-3 py-2 bg-gray-200 rounded">Додати ще посилання</button>
          <button onClick={saveNewItem} className="px-3 py-2 bg-green-500 text-white rounded">Зберегти</button>
        </div>
      </Modal>

      <Modal open={modal === 'editItem'} onClose={()=>setModal(null)} title="Редагувати пункт">
        <input className="w-full p-2 mb-2 rounded text-black dark:text-white" placeholder="Назва" value={workingItem.title} onChange={e=>setWorkingItem({...workingItem, title: e.target.value})} />
        <textarea className="w-full p-2 mb-2 rounded text-black dark:text-white" placeholder="Опис" value={workingItem.description} onChange={e=>setWorkingItem({...workingItem, description: e.target.value})} />
        {workingItem.links.map((l,i)=>(
          <input key={i} className="w-full p-2 mb-2 rounded text-black dark:text-white" placeholder={`Посилання ${i+1}`} value={l} onChange={e=>{ const nxt=[...workingItem.links]; nxt[i]=e.target.value; setWorkingItem({...workingItem, links: nxt}) }} />
        ))}
        <div className="flex gap-2">
          <button onClick={()=>setWorkingItem({...workingItem, links: [...workingItem.links, '']})} className="px-3 py-2 bg-gray-200 rounded">Додати ще посилання</button>
          <button onClick={saveEditItem} className="px-3 py-2 bg-green-500 text-white rounded">Зберегти</button>
        </div>
      </Modal>

    </div>
  )
}
