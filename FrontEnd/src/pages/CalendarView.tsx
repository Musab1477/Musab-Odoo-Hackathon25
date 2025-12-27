import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { maintenanceRequests } from '@/data/mockData';
import { ChevronLeft, ChevronRight, Wrench, Clock, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const preventiveRequests = maintenanceRequests.filter(r => r.type === 'Preventive');

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: { date: Date; isCurrentMonth: boolean; events: typeof preventiveRequests }[] = [];
    
    // Add days from previous month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false, events: [] });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const events = preventiveRequests.filter(r => r.scheduledDate === dateStr);
      days.push({ date, isCurrentMonth: true, events });
    }
    
    // Add days from next month to complete the grid
    const endPadding = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= endPadding; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, events: [] });
    }
    
    return days;
  }, [currentDate, preventiveRequests]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Get events for selected date
  const selectedDateEvents = selectedDate 
    ? preventiveRequests.filter(r => r.scheduledDate === selectedDate)
    : [];

  const handleDateClick = (dateStr: string, hasEvents: boolean) => {
    if (hasEvents) {
      setSelectedDate(dateStr === selectedDate ? null : dateStr);
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title font-display">Maintenance Calendar</h1>
            <p className="text-muted-foreground mt-1">View preventive maintenance schedule</p>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="bg-card rounded-xl border border-border p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold font-display">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dateStr = day.date.toISOString().split('T')[0];
              const hasEvents = day.events.length > 0;
              const isSelected = selectedDate === dateStr;
              
              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(dateStr, hasEvents)}
                  className={`calendar-day relative ${
                    !day.isCurrentMonth ? 'opacity-50' : ''
                  } ${isToday(day.date) ? 'bg-primary/10 border-primary' : ''} ${
                    hasEvents ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30' : ''
                  } ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/30' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(day.date) ? 'text-primary' : ''
                  }`}>
                    {day.date.getDate()}
                  </div>
                  
                  {/* Preventive Maintenance Indicator */}
                  {hasEvents && (
                    <div className="space-y-1 mt-1">
                      {day.events.slice(0, 2).map((event) => (
                        <div key={event.id} className="bg-blue-100 dark:bg-blue-900/40 rounded px-1 py-0.5">
                          <p className="text-[10px] font-medium text-blue-700 dark:text-blue-300 truncate">
                            {event.equipment?.name}
                          </p>
                          <p className="text-[9px] text-blue-600 dark:text-blue-400 truncate">
                            {event.subject}
                          </p>
                        </div>
                      ))}
                      {day.events.length > 2 && (
                        <p className="text-[9px] text-muted-foreground text-center">
                          +{day.events.length - 2} more
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Detail Panel */}
        {selectedDate && selectedDateEvents.length > 0 && (
          <div className="mt-6 bg-card rounded-xl border border-border p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Preventive Maintenance</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {selectedDateEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{event.subject}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Equipment</p>
                        <p className="text-sm font-medium">{event.equipment?.name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Scheduled Date</p>
                        <p className="text-sm font-medium">
                          {new Date(event.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium">
                          {event.duration ? `${event.duration} hours` : 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                        event.status === 'New' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : event.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>

                  {event.assignedTechnician && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">Assigned Technician</p>
                      <p className="text-sm font-medium mt-1">{event.assignedTechnician.name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Preventive Maintenance (PM)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary/20 border border-primary" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
