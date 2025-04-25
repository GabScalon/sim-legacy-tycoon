
import { GameEvent } from "../types/game";

interface StatsPanelProps {
  money: number;
  day: number;
  events: GameEvent[];
}

const StatsPanel = ({ money, day, events }: StatsPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Game Status</h2>
        <div className="text-sm">
          <span className="font-semibold">Day:</span> {day}
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
        <div className="text-sm text-gray-600">Current Balance</div>
        <div className="text-2xl font-bold text-blue-800">${money.toLocaleString()}</div>
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Recent Events</h3>
        <div className="max-h-60 overflow-y-auto pr-1">
          {events.length === 0 ? (
            <div className="text-sm text-gray-500 italic">No recent events</div>
          ) : (
            events.map((event) => (
              <div 
                key={event.id}
                className="mb-2 p-2 border-l-4 border-blue-400 bg-gray-50"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-sm">{event.title}</span>
                  <span className="text-xs text-gray-500">Day {event.day}</span>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
                <div className={`text-sm font-medium ${
                  event.effect.includes('+') 
                    ? 'text-green-600' 
                    : event.effect.includes('-') 
                      ? 'text-red-600' 
                      : 'text-blue-600'
                }`}>
                  {event.effect}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
