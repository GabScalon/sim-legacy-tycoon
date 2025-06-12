
import { GameEvent } from "../types/game";

interface StatsPanelProps {
  money: number;
  day: number;
  events: GameEvent[];
}

const StatsPanel = ({ money, day, events }: StatsPanelProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white">Status do Jogo</h2>
        <div className="text-sm dark:text-gray-300">
          <span className="font-semibold">Dia:</span> {day}
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-100 dark:border-blue-800">
        <div className="text-sm text-gray-600 dark:text-gray-400">Saldo Atual</div>
        <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">${money.toLocaleString()}</div>
      </div>
      
      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Eventos Recentes</h3>
        <div className="max-h-60 overflow-y-auto pr-1">
          {events.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">Nenhum evento recente</div>
          ) : (
            events.map((event) => (
              <div 
                key={event.id}
                className="mb-2 p-2 border-l-4 border-blue-400 dark:border-blue-500 bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex justify-between">
                  <span className="font-medium text-sm dark:text-gray-200">{event.title}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Dia {event.day}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                <div className={`text-sm font-medium ${
                  event.effect.includes('+') 
                    ? 'text-green-600 dark:text-green-400' 
                    : event.effect.includes('-') 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-blue-600 dark:text-blue-400'
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
