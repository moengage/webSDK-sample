export default function Dashboard({ events }) {
  return (
    <div className="dashboard">
      <section className="section">
        <h2>Try asking ChatGPT:</h2>
        <div className="examples">
          <p>"Identify me as user123"</p>
          <p>"Track a purchase event"</p>
          <p>"Set my plan to premium"</p>
        </div>
      </section>

      <section className="section">
        <h3>Recent Activity</h3>
        {events.length > 0 ? (
          <div className="event-feed">
            {events.map(({ ts, name }, idx) => (
              <div key={idx} className="event-item">
                <span className="event-time">{ts}</span>
                <span className="event-name">● {name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No events yet. Talk to ChatGPT to get started!</p>
        )}
      </section>
    </div>
  );
}
