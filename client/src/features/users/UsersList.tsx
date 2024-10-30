import { useAppSelector } from '../../app/hooks'
import { selectAllUsers } from './usersSlice'
import { UserPage } from './UserPage'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectCurrentUserId } from '../auth/authSlice'


export const UsersList = () => {
  const users = useAppSelector(selectAllUsers)
  const currentUserId = useAppSelector(selectCurrentUserId)
  const location = useLocation();
  let [query, setQuery] = useState(location.search.substring(4));
  const [userId, setUserId] = useState(query === "" ? currentUserId === users[0].id  ? users[1].id : users[0].id : query as string | null)

  console.log("userId -> ", query);
  const handleClick = (id: string) => {
    setUserId(id)
    setQuery(id);
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }

  const renderedUsers = users.map(user => (
    <li key={user.id} className={`py-2 px-4 hover:bg-gray-700 rounded-md ${query === user.id ? 'bg-gray-700' : ''}`}>
      <button className="text-gray-300 hover:text-white" onClick={() => handleClick(user.id)} disabled={query === user.id}>
        {user.name}
      </button>
    </li>
  )).filter(user => user.key !== currentUserId)

  return (
    <section className="m-6 flex gap-4">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-800 p-4">
        <h2 className="text-white text-lg mb-4">Users</h2>
        <ul>{renderedUsers}</ul>
      </aside>
      {/* Main Content */}
      <div className="w-3/4">
        { userId && <UserPage userId={userId} /> }
      </div>
    </section>
  )
}