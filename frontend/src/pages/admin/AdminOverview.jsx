import React, { useEffect, useState } from 'react';
import { Users, BookOpen, Calendar, Clock } from 'lucide-react';
import api from '../../services/api'; // Make sure this path points to your api.js

const AdminOverview = () => {
  // 1. Create a state to hold the real count
  const [studentCount, setStudentCount] = useState('...'); 

  // 2. Fetch the data from your new Backend route
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/students/count');
        // Format the number with commas (e.g., 1,250)
        setStudentCount(response.data.count.toLocaleString());
      } catch (err) {
        console.error("Error fetching student count:", err);
        setStudentCount('0'); // Fallback if server is down
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { id: 1, label: 'Total Students', value: studentCount, icon: <Users size={24} />, color: '#4318ff' },
    { id: 2, label: 'Active Courses', value: '12', icon: <BookOpen size={24} />, color: '#05cd99' },
    { id: 3, label: 'Upcoming Events', value: '4', icon: <Calendar size={24} />, color: '#ff9900' },
    { id: 4, label: 'Pending Tasks', value: '8', icon: <Clock size={24} />, color: '#ee5d50' },
  ];

  return (
    <div className="overview-container">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="welcome-banner">
        <h2>Welcome Back, Admin! 👋</h2>
        <p>Here is what's happening with Trioslk Academy today.</p>
      </div>
    </div>
  );
};

export default AdminOverview;