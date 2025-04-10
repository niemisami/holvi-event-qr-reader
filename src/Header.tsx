
const Header = ({ onLogout }: { onLogout?: () => void }) => {
  return (
    <nav>
      <div className='header'>
        <h2>Holvi Event QR-code Reader</h2>
        {onLogout
          ? (
            <button
              onClick={onLogout}>
              🚪 Log out
            </button>
          ) : null}
      </div>
    </nav >
  )
}

export default Header
