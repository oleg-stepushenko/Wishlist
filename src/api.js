import { API_BASE } from './config';

export async function getLists(){
  const res = await fetch(`${API_BASE}/api/lists`);
  return res.json();
}

export async function createList(name, password){
  const res = await fetch(`${API_BASE}/api/lists`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ name, password })
  });
  return res.json();
}

export async function getList(id){
  const res = await fetch(`${API_BASE}/api/lists/${id}`);
  return res.json();
}

export async function unlockList(id, password){
  const res = await fetch(`${API_BASE}/api/lists/${id}/unlock`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password })
  });
  return res.json();
}

export async function addItem(listId, item){
  const res = await fetch(`${API_BASE}/api/lists/${listId}/items`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(item)
  });
  return res.json();
}

export async function editItem(listId, itemId, item){
  const res = await fetch(`${API_BASE}/api/lists/${listId}/items/${itemId}`, {
    method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(item)
  });
  return res.json();
}

export async function deleteItem(listId, itemId){
  const res = await fetch(`${API_BASE}/api/lists/${listId}/items/${itemId}`, {
    method:'DELETE'
  });
  return res.json();
}

export async function deleteList(listId){
  const res = await fetch(`${API_BASE}/api/lists/${listId}`, { method:'DELETE' });
  return res.json();
}

export async function editList(listId, payload){
  const res = await fetch(`${API_BASE}/api/lists/${listId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  return res.json();
}
