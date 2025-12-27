import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { ChevronLeft, ChevronRight, Wrench, Clock, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MaintenanceRequestData } from './RequestForm';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'];

const REQUESTS_STORAGE_KEY = 'gearguard_requests';

const getStoredRequests = (): MaintenanceRequestData[] => {
  try {
    const stored = localStorage.getItem(REQUESTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export default function CalendarView() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [requests, setRequests] = useState<MaintenanceRequestData[]>([]);

  // Load requests from localStorage
  useEffect(() => {
    const storedRequests = getStoredRequests();
    console.log('All stored requests:', storedRequests);
    setRequests(storedRequests);
  }, []);

  // Filter only Preventive requests that have scheduled date
  const preventiveRequests = useMemo(() => {
    const filtered = requests.filter(r => {
      const isPreventive = r.type === 'Preventive';
      const hasScheduledDate = r.scheduledDate && r.scheduledDate.length > 0;
      console.log(`Request: ${r.subject}, Type: ${r.type}, ScheduledDate: ${r.scheduledDate}, IsPreventive: ${isPreventive}, HasDate: ${hasScheduledDate}`);
      return isPreventive && hasScheduledDate;
    });
    console.log('Filtered preventive requests:', filtered);
    return filtered;
  }, [requests]);

  // Helper function to format date consistently (YYYY-MM-DD)
  const formatDateToString = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: { date: Date; dateStr: string; isCurrentMonth: boolean; events: MaintenanceRequestData[] }[] = [];
    
    // Add days from previous month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const dateStr = formatDateToString(date);
      days.push({ date, dateStr, isCurrentMonth: false, events: [] });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = formatDateToString(date);
      // Find events for this date
      const events = preventiveRequests.filter(r => {
        const matches = r.scheduledDate === dateStr;
        if (matches) {
          console.log(`Date ${dateStr} matched with request: ${r.subject}`);
        }
        return matches;
      });
      days.push({ date, dateStr, isCurrentMonth: true, events });
    }
    
    // Add days from next month to complete the grid
    const endPadding = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= endPadding; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = formatDateToString(date);
      days.push({ date, dateStr, isCurrentMonth: false, events: [] });
    }
    
    return days;
  }, [currentDate, preventiveRequests, formatDateToString]);

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

  const handleRequestClick = (requestId: string) => {
    navigate(`/requests/${requestId}`);
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
              const hasEvents = day.events.length > 0;
              const isSelected = selectedDate === day.dateStr;
              
              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day.dateStr, hasEvents)}
                  className={`calendar-day relative min-h-[80px] p-1 border rounded-lg ${
                    !day.isCurrentMonth ? 'opacity-40 bg-muted/30' : 'bg-card'
                  } ${isToday(day.date) ? 'bg-primary/10 border-primary border-2' : 'border-border'} ${
                    hasEvents ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30 border-blue-300' : ''
                  } ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/30' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(day.date) ? 'text-primary font-bold' : ''
                  }`}>
                    {day.date.getDate()}
                  </div>
                  
                  {/* Preventive Maintenance Indicator with Request & Equipment Name */}
                  {hasEvents && (
                    <div className="space-y-1">
                      {day.events.slice(0, 2).map((event) => (
                        <div key={event.id} className="bg-blue-100 dark:bg-blue-900/40 rounded px-1 py-0.5 border-l-2 border-blue-500">
                          <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 truncate">
                            {event.subject}
                          </p>
                          <p className="text-[9px] text-blue-600 dark:text-blue-400 truncate">
                            🔧 {event.equipmentName}
                          </p>
                        </div>
                      ))}
                      {day.events.length > 2 && (
                        <p className="text-[9px] text-blue-600 font-medium text-center">
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
                  onClick={() => handleRequestClick(event.id)}
                  className="p-4 rounded-lg bg-muted/50 border border-border cursor-pointer hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground hover:text-primary transition-colors">
                        {event.subject}
                      </h4>
                      {event.notes && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Equipment</p>
                        <p className="text-sm font-medium">{event.equipmentName || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Scheduled Date</p>
                        <p className="text-sm font-medium">
                          {event.scheduledDate ? new Date(event.scheduledDate).toLocaleDateString() : '-'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium">
                          {event.durationHours ? `${event.durationHours} hours` : 'Not specified'}
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

                  {event.teamName && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">Assigned Team</p>
                      <p className="text-sm font-medium mt-1">{event.teamName}</p>
                      {event.teamMembers && event.teamMembers.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {event.teamMembers.map((member) => (
                            <span 
                              key={member.id} 
                              className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                            >
                              {member.name}
                            </span>
                          ))}
                        </div>
                      )}
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
