export default function Header({ user }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>MoEngage Explorer</h1>
        <div className="header-status">
          <span className="status-dot live" />
          <span>SDK: Live</span>
          {user && <span className="user-info">User: {user}</span>}
        </div>
      </div>
    </header>
  );
}
