import '../styles/loader.css'
export const Spinner = ({ text = '', size = '5em' }) => {
  const header = text ? <h4 style={{color: 'white'}}>{text}</h4> : null
  return (
    <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} className="spinner">
      {header}
      <div className="mt-4 loader w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-transparent relative animate-spin">
        <div className="after bg-transparent w-3/4 h-3/4 rounded-full absolute inset-0 m-auto"></div>
      </div>
    </div>
  )
}