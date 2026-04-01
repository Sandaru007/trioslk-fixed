import React from 'react';
import { GraduationCap, MapPin, MessageSquare, Mic, BookOpenText, Target, ChevronRight, Search } from 'lucide-react';

const DashboardHome = () => {
  // Static data matching the image for now
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="dashboard-grid">
      
      {/* LEFT COLUMN */}
      <div className="main-content-col">
        {/* Welcome Banner */}
        <div className="lms-card welcome-banner">
          <div className="welcome-text">
            <span className="welcome-date">April 20, Tuesday</span>
            <h2>Welcome back, Kavishka!</h2>
            <p>You've finished 80% of your weekly goal!</p>
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
            {/* Course 1 */}
            <div className="course-item-card">
              <div className="course-icon-container purple">
                <MapPin size={40} strokeWidth={1.5}/>
              </div>
              <h5>Product Management</h5>
              <span className="course-instructor">Prof. Jennifer Gomez</span>
              <div className="course-progress-bar">
                <div className="progress-fill" style={{ width: '80%' }}></div>
              </div>
            </div>

            {/* Course 2 */}
            <div className="course-item-card">
              <div className="course-icon-container orange">
                <MapPin size={40} strokeWidth={1.5} />
              </div>
              <h5>Advanced Geography</h5>
              <span className="course-instructor">Prof. Jennifer Gomez</span>
              <div className="course-progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
            </div>

            {/* Course 3 */}
            <div className="course-item-card">
              <div className="course-icon-container pink">
                <Mic size={40} strokeWidth={1.5} />
              </div>
              <h5>Mass Communication</h5>
              <span className="course-instructor">Prof. Jennifer Gomez</span>
              <div className="course-progress-bar">
                <div className="progress-fill" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="lms-card">
          <h3>Achievements</h3>
          {/* Placeholder for achievements - add your specific UI here */}
          <p style={{color: 'var(--text-muted)', marginTop: '15px'}}>Your completed certificates will appear here.</p>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="side-content-col">
        {/* Schedule/Calendar */}
        <div className="lms-card">
          <h4>My Schedule</h4>
          <div className="calendar-widget mt-3">
            <div className="calendar-header">December</div>
            <div className="calendar-days-grid">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="cal-day-label">{day}</div>
              ))}
              {dates.map(date => (
                <div 
                  key={date} 
                  className={`cal-date ${date === 20 ? 'active' : ''} ${[5, 12, 18, 26].includes(date) ? 'has-event' : ''}`}
                >
                  {date}
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
            <div className="task-item">
              <div className="task-icon-status red"><Mic size={18}/></div>
              <div className="task-details">
                <span className="task-name">Demo Speech</span>
                <span className="task-course">Mass Communication</span>
              </div>
              <ChevronRight size={18} className="text-muted" />
            </div>

            <div className="task-item">
              <div className="task-icon-status orange"><BookOpenText size={18}/></div>
              <div className="task-details">
                <span className="task-name">Globalization Essay</span>
                <span className="task-course">Advanced Geography</span>
              </div>
              <ChevronRight size={18} className="text-muted" />
            </div>

            <div className="task-item">
              <div className="task-icon-status purple"><Target size={18}/></div>
              <div className="task-details">
                <span className="task-name">Management Quiz</span>
                <span className="task-course">Product Management</span>
              </div>
              <ChevronRight size={18} className="text-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;