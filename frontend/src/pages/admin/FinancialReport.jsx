import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Download, DollarSign, CreditCard, CheckCircle, PieChart } from 'lucide-react';
import './AdminDashboard.css';

const FinancialReport = () => {
    const [payments, setPayments] = useState([]);
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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Student', 'Course', 'Amount', 'Method', 'Date', 'Status'];
        const rows = payments.map(payment => [
            payment._id,
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
                            <option value="Card">Card</option>
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
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map(payment => (
                                    <tr key={payment._id}>
                                        <td>{payment.studentName}</td>
                                        <td>{payment.courseTitle}</td>
                                        <td>Rs. {payment.amount.toLocaleString()}</td>
                                        <td>{payment.method}</td>
                                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                                        <td><span className={`status-badge ${payment.status.toLowerCase()}`}>{payment.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <div className="no-data-message">No payments found.</div>}
                </div>
            </div>
        </div>
    );
};

export default FinancialReport;
