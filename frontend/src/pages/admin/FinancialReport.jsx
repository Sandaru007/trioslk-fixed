import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Download, DollarSign, CreditCard, CheckCircle, PieChart, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

const FinancialReport = () => {
    const [payments, setPayments] = useState([]);
    const [allPayments, setAllPayments] = useState([]);
    const [activeChartTab, setActiveChartTab] = useState('monthly');
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        paymentMethod: '',
        status: ''
    });

    useEffect(() => {
        fetchPayments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/payments');
            
            setAllPayments(data);

            // Apply filters
            let filteredData = data;
            filteredData = filteredData.filter(payment => {
                const paymentDate = new Date(payment.date);
                const paymentMonth = paymentDate.getMonth() + 1;
                const paymentYear = paymentDate.getFullYear();

                const matchesMonth = paymentMonth === parseInt(filters.month);
                const matchesYear = paymentYear === parseInt(filters.year);
                const matchesMethod = filters.paymentMethod ? payment.method === filters.paymentMethod : true;
                const matchesStatus = filters.status ? payment.status === filters.status : true;

                return matchesMonth && matchesYear && matchesMethod && matchesStatus;
            });

            setPayments(filteredData);
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (paymentId, newStatus) => {
        try {
            await api.put(`/payments/${paymentId}`, { status: newStatus });
            setPayments(prev => prev.map(p => p._id === paymentId ? { ...p, status: newStatus } : p));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update payment status');
        }
    };

    const handleDeletePayment = async (paymentId) => {
        if (!window.confirm("Are you sure you want to completely delete this payment record? This cannot be undone.")) {
            return;
        }
        try {
            await api.delete(`/payments/${paymentId}`);
            setPayments(prev => prev.filter(p => p._id !== paymentId));
        } catch (error) {
            console.error('Error deleting payment:', error);
            alert('Failed to delete payment completely');
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const exportToCSV = () => {
        const headers = ['Payment ID', 'Student ID', 'Student Name', 'Course', 'Amount', 'Method', 'Date', 'Status'];
        const rows = payments.map(payment => [
            payment.generatedID || payment._id,
            payment.studentId || 'N/A',
            payment.studentName,
            payment.courseTitle,
            payment.amount,
            payment.method,
            new Date(payment.date).toLocaleDateString(),
            payment.status
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `financial_report_${filters.year}_${filters.month}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const stats = {
        totalIncome: payments.reduce((sum, p) => p.status === 'Completed' ? sum + p.amount : sum, 0),
        totalPayments: payments.length,
        pendingPayments: payments.filter(p => p.status === 'Pending').length,
        completedPayments: payments.filter(p => p.status === 'Completed').length,
        methodDistribution: payments.reduce((acc, p) => {
            acc[p.method] = (acc[p.method] || 0) + 1;
            return acc;
        }, {})
    };

    // Chart Data Aggregation
    const getChartData = () => {
        const completedPayments = allPayments.filter(p => p.status === 'Completed');
        
        if (activeChartTab === 'daily') {
            const dailyData = {};
            completedPayments.forEach(p => {
                const dateKey = new Date(p.date).toISOString().split('T')[0];
                dailyData[dateKey] = (dailyData[dateKey] || 0) + p.amount;
            });
            return Object.entries(dailyData)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .slice(-14) // last 14 active days
                .map(([dateKey, amount]) => {
                    const d = new Date(dateKey);
                    return { name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), Income: amount };
                });
        } else if (activeChartTab === 'yearly') {
            const yearlyData = {};
            completedPayments.forEach(p => {
                const year = new Date(p.date).getFullYear();
                yearlyData[year] = (yearlyData[year] || 0) + p.amount;
            });
            return Object.entries(yearlyData)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([year, amount]) => ({ name: year, Income: amount }));
        } else {
            // monthly
            const monthlyData = {};
            completedPayments.forEach(p => {
                const d = new Date(p.date);
                const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                monthlyData[monthKey] = (monthlyData[monthKey] || 0) + p.amount;
            });
            return Object.entries(monthlyData)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .slice(-12) // last 12 active months
                .map(([monthKey, amount]) => {
                    const [y, m] = monthKey.split('-');
                    const date = new Date(y, m - 1);
                    return { name: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), Income: amount };
                });
        }
    };
    
    const chartData = getChartData();

    return (
        <div className="admin-dashboard-container">
            <div className="dashboard-header">
                <h2>Financial Report</h2>
                <p>Monitor payments, income, and financial health</p>
            </div>

            <div className="filter-card">
                <div className="filter-grid">
                    <div className="filter-group">
                        <label>Month</label>
                        <select name="month" value={filters.month} onChange={handleFilterChange}>
                            {[...Array(12)].map((_, i) => (
                                <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Year</label>
                        <select name="year" value={filters.year} onChange={handleFilterChange}>
                            {[...Array(10)].map((_, i) => {
                                const year = new Date().getFullYear() - i;
                                return <option key={year} value={year}>{year}</option>;
                            })}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Method</label>
                        <select name="paymentMethod" value={filters.paymentMethod} onChange={handleFilterChange}>
                            <option value="">All Methods</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Status</label>
                        <select name="status" value={filters.status} onChange={handleFilterChange}>
                            <option value="">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                </div>
                <button className="export-btn" onClick={exportToCSV}><Download size={18} /> Export CSV</button>
            </div>

            <div className="stats-grid">
                <div className="stat-card income">
                    <div className="stat-icon"><DollarSign size={24} /></div>
                    <div className="stat-content">
                        <h3>Total Income</h3>
                        <p>Rs. {stats.totalIncome.toLocaleString()}</p>
                        <p className="stat-description">Completed payments</p>
                    </div>
                </div>
                <div className="stat-card completed">
                    <div className="stat-icon"><CheckCircle size={24} /></div>
                    <div className="stat-content">
                        <h3>Completed</h3>
                        <p>{stats.completedPayments}</p>
                        <p className="stat-description">Successful</p>
                    </div>
                </div>
                <div className="stat-card pending">
                    <div className="stat-icon"><CreditCard size={24} /></div>
                    <div className="stat-content">
                        <h3>Pending</h3>
                        <p>{stats.pendingPayments}</p>
                        <p className="stat-description">Awaiting confirmation</p>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <div className="chart-header">
                        <h4>Payment Methods</h4>
                        <PieChart size={20} />
                    </div>
                    <div className="chart-content">
                        {Object.keys(stats.methodDistribution).length > 0 ? (
                            <div className="pie-chart">
                                {Object.entries(stats.methodDistribution).map(([method, count]) => (
                                    <div key={method} className="pie-slice">
                                        <span className="method-label">{method}</span>
                                        <span className="method-count">{count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="no-data">No data available</p>}
                    </div>
                </div>
            </div>

            <div className="table-card">
                <h3>Payment Records</h3>
                <div className="table-responsive">
                    {loading ? (
                        <div className="loading-spinner">Loading payments...</div>
                    ) : payments.length > 0 ? (
                        <table className="financial-table">
                            <thead>
                                <tr>
                                    <th>Payment ID</th>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Course</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Receipt</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(payment => (
                                    <tr key={payment._id}>
                                        <td><span className="text-primary fw-bold">{payment.generatedID || 'N/A'}</span></td>
                                        <td><span className="text-secondary fw-medium">{payment.studentId && payment.studentId !== 'New Student' ? payment.studentId : 'N/A'}</span></td>
                                        <td>{payment.studentName}</td>
                                        <td>{payment.courseTitle}</td>
                                        <td>Rs. {payment.amount.toLocaleString()}</td>
                                        <td>{payment.method}</td>
                                        <td>
                                            {payment.receiptUrl ? (
                                                <a href={payment.receiptUrl.includes(".pdf") ? payment.receiptUrl.replace(/\.pdf$/i, ".jpg") : payment.receiptUrl}
                                                    target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary" style={{ padding: '2px 8px', fontSize: '12px' }}>
                                                    View Receipt
                                                </a>
                                            ) : (
                                                <span className="text-muted" style={{ fontSize: '12px' }}>N/A</span>
                                            )}
                                        </td>
                                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                                        <td>
                                            <select
                                                className={`form-select form-select-sm border-0 fw-bold status-badge ${payment.status.toLowerCase()}`}
                                                value={payment.status}
                                                onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                                                style={{ cursor: 'pointer', outline: 'none', boxShadow: 'none' }}
                                            >
                                                <option value="Pending" className="text-dark">Pending</option>
                                                <option value="Completed" className="text-dark">Completed</option>
                                                <option value="Failed" className="text-dark">Failed</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-danger border-0"
                                                onClick={() => handleDeletePayment(payment._id)}
                                                title="Delete Record"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <div className="no-data-message">No payments found.</div>}
                </div>
            </div>

            {/* Smart Income Analysis Section */}
            <div className="smart-analysis-section">
                <div className="analysis-header">
                    <div>
                        <h3>Smart Income Analysis</h3>
                        <p>Track your revenue growth across different timeframes</p>
                    </div>
                    <div className="chart-tabs">
                        <div className="chart-tabs-bg">
                            <div className={`tab-slider slider-${activeChartTab}`}></div>
                            <button 
                                className={`chart-tab ${activeChartTab === 'daily' ? 'active' : ''}`}
                                onClick={() => setActiveChartTab('daily')}
                            >
                                Daily
                            </button>
                            <button 
                                className={`chart-tab ${activeChartTab === 'monthly' ? 'active' : ''}`}
                                onClick={() => setActiveChartTab('monthly')}
                            >
                                Monthly
                            </button>
                            <button 
                                className={`chart-tab ${activeChartTab === 'yearly' ? 'active' : ''}`}
                                onClick={() => setActiveChartTab('yearly')}
                            >
                                Yearly
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="chart-container">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData} margin={{ top: 30, right: 30, left: 20, bottom: 10 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4318ff" stopOpacity={0.9}/>
                                        <stop offset="95%" stopColor="#4318ff" stopOpacity={0.6}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e5f2" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a3aed0', fontSize: 13, fontWeight: 500 }} dy={15} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a3aed0', fontSize: 13, fontWeight: 500 }} tickFormatter={(value) => `Rs.${value >= 1000 ? (value/1000).toFixed(1)+'k' : value}`} dx={-10} />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(67, 24, 255, 0.04)' }}
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '15px 20px' }}
                                    itemStyle={{ color: '#1b2559', fontWeight: 700, fontSize: '16px' }}
                                    labelStyle={{ color: '#a3aed0', marginBottom: '5px', fontSize: '14px', fontWeight: 600 }}
                                />
                                <Bar dataKey="Income" fill="url(#colorIncome)" radius={[8, 8, 0, 0]} maxBarSize={60} animationDuration={1000} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="no-data-message" style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p>No income data available to analyze.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinancialReport;
