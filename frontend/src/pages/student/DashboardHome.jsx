import React, { useState, useEffect } from 'react';
import { GraduationCap, MapPin, MessageSquare, Mic, BookOpenText, Target, ChevronRight, Search } from 'lucide-react';
import api from '../../services/api';

const DashboardHome = () => {
  // Get the logged-in user's name from localStorage
  const userInfo = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('trioslk_userInfo') || '{}');
    } catch {
      return {};
    }
  })();
  const firstName = userInfo.name ? userInfo.name.split(' ')[0] : 'Student';
  const studentId = userInfo.studentId;

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) return;
      try {
        setLoading(true);
        
        // Fetch enrolled courses
        const coursesRes = await api.get(`/students/${encodeURIComponent(studentId)}/courses`);
        const enrolled = coursesRes.data;
        setEnrolledCourses(enrolled);
        
        const courseCodes = enrolled.map(c => c.courseCode);

        // Fetch sessions
        const sessionsRes = await api.get('/sessions');
        const filteredSessions = sessionsRes.data.filter(s => courseCodes.includes(s.courseCode));
        setSessions(filteredSessions);

        // Fetch assignments
        const assignmentsRes = await api.get('/assignments');
        const filteredAssignments = assignmentsRes.data.filter(a => courseCodes.includes(a.courseCode));
        setAssignments(filteredAssignments);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  // Calendar logic
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthName = today.toLocaleString('default', { month: 'long' });
  const formattedToday = today.toLocaleString('default', { month: 'long', day: 'numeric', weekday: 'long' });

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust for Monday start (0=Mon, 6=Sun)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const calendarDays = [];
  // Empty slots for previous month
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push({ day: null, hasEvent: false });
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    // Check if any session or assignment is on this day
    const hasSession = sessions.some(s => {
      const sDate = new Date(s.date);
      return sDate.getDate() === d && sDate.getMonth() === currentMonth && sDate.getFullYear() === currentYear;
    });
    const hasAssignment = assignments.some(a => {
      const aDate = new Date(a.dueDate);
      return aDate.getDate() === d && aDate.getMonth() === currentMonth && aDate.getFullYear() === currentYear;
    });

    calendarDays.push({ 
      day: d, 
      hasEvent: hasSession || hasAssignment,
      isToday: d === today.getDate()
    });
  }

  // Combine upcoming tasks (Sessions & Assignments)
  const upcomingTasks = [
    ...sessions.map(s => ({ ...s, type: 'session', sortDate: new Date(s.date) })),
    ...assignments.map(a => ({ ...a, type: 'assignment', sortDate: new Date(a.dueDate) }))
  ]
  .filter(t => t.sortDate >= new Date().setHours(0,0,0,0)) // Future tasks
  .sort((a, b) => a.sortDate - b.sortDate)
  .slice(0, 4);

  return (
    <div className="dashboard-grid">
      
      {/* LEFT COLUMN */}
      <div className="main-content-col">
        {/* Welcome Banner */}
        <div className="lms-card welcome-banner">
          <div className="welcome-text">
            <span className="welcome-date">{formattedToday}</span>
            <h2>Welcome back, {firstName}!</h2>
            <p>Ready to continue your learning journey?</p>
          </div>
          <GraduationCap size={100} className="cap-icon" color="white" strokeWidth={1} />
        </div>

        {/* My Courses */}
        <div className="lms-card">
          <div className="card-header-inline">
            <h3>My Courses</h3>
            <a href="#" className="view-all-link">See All</a>
          </div>
          
          <div className="courses-grid">
            {loading ? (
              <p>Loading courses...</p>
            ) : enrolledCourses.length > 0 ? (
              enrolledCourses.map((course, index) => {
                const colors = ['purple', 'orange', 'pink', 'blue', 'green'];
                const colorClass = colors[index % colors.length];
                
                return (
                  <div className="course-item-card" key={course._id || index}>
                    <div className={`course-icon-container ${colorClass}`}>
                      <BookOpenText size={40} strokeWidth={1.5} />
                    </div>
                    <h5>{course.title || 'Course Title'}</h5>
                    <span className="course-instructor">Code: {course.courseCode}</span>
                    <div className="course-progress-bar">
                      <div className="progress-fill" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>You have not enrolled in any courses yet.</p>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="lms-card">
          <h3>Achievements</h3>
          <p style={{color: 'var(--text-muted)', marginTop: '15px'}}>Your completed certificates will appear here.</p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="side-content-col">
        {/* Schedule/Calendar */}
        <div className="lms-card">
          <h4>My Schedule</h4>
          <div className="calendar-widget mt-3">
            <div className="calendar-header">{monthName} {currentYear}</div>
            <div className="calendar-days-grid">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="cal-day-label">{day}</div>
              ))}
              {calendarDays.map((item, index) => (
                <div 
                  key={index} 
                  className={`cal-date ${item.isToday ? 'active' : ''} ${item.hasEvent ? 'has-event' : ''}`}
                >
                  {item.day}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="lms-card">
          <div className="card-header-inline">
            <h4>Upcoming Tasks</h4>
            <a href="#" className="view-all-link">See All</a>
          </div>

          <div className="tasks-list">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task, idx) => (
                <div className="task-item" key={idx}>
                  <div className={`task-icon-status ${task.type === 'session' ? 'orange' : 'purple'}`}>
                    {task.type === 'session' ? <Mic size={18}/> : <Target size={18}/>}
                  </div>
                  <div className="task-details">
                    <span className="task-name">{task.title}</span>
                    <span className="task-course">{task.courseCode} • {new Date(task.sortDate).toLocaleDateString()}</span>
                  </div>
                  <ChevronRight size={18} className="text-muted" />
                </div>
              ))
            ) : (
              <p className="text-muted">No upcoming tasks.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;