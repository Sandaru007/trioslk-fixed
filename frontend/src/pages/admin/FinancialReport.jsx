import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { Download, DollarSign, CreditCard, CheckCircle, PieChart, Trash2, FileText } from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    const [chartTimeframe, setChartTimeframe] = useState('monthly');
    const reportRef = useRef(null);

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

    const generatePDFReport = async () => {
        if (!reportRef.current) return;
        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.text("Financial Report", 14, 15);
            pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
            pdf.save(`financial_charts_report_${new Date().getTime()}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF report.");
        }
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

    const getBarChartData = () => {
        const dataMap = {};
        payments.forEach(p => {
            if (p.status !== 'Completed') return;
            const date = new Date(p.date);
            let key = '';
            if (chartTimeframe === 'daily') {
                key = date.toLocaleDateString('en-GB');
            } else if (chartTimeframe === 'monthly') {
                key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            } else {
                key = date.getFullYear().toString();
            }
            dataMap[key] = (dataMap[key] || 0) + p.amount;
        });
        return Object.keys(dataMap).map(key => ({ name: key, Income: dataMap[key] }));
    };

    const barChartData = getBarChartData();
    const pieChartData = Object.keys(stats.methodDistribution).map(key => ({
        name: key,
        value: stats.methodDistribution[key]
    }));
    const COLORS = ['#4318ff', '#05cd99', '#ff9900', '#ee5d50'];

    return (
        <div className="admin-dashboard-container">
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2>Financial Report</h2>
                    <p>Monitor payments, income, and financial health</p>
                </div>
                <button className="export-pdf-btn" onClick={generatePDFReport} style={{ background: '#4318ff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    <FileText size={18} /> Generate PDF Report
                </button>
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

            <div ref={reportRef} className="report-capture-area" style={{ padding: '10px', background: 'transparent' }}>
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

                <div className="charts-grid-modern" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', marginBottom: '25px' }}>
                    <div className="chart-card large-chart">
                        <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h4>Income Over Time</h4>
                            <div className="timeframe-toggles" style={{ display: 'flex', gap: '10px' }}>
                                <button className={`filter-tag ${chartTimeframe === 'daily' ? 'active' : ''}`} onClick={() => setChartTimeframe('daily')}>Daily</button>
                                <button className={`filter-tag ${chartTimeframe === 'monthly' ? 'active' : ''}`} onClick={() => setChartTimeframe('monthly')}>Monthly</button>
                                <button className={`filter-tag ${chartTimeframe === 'yearly' ? 'active' : ''}`} onClick={() => setChartTimeframe('yearly')}>Yearly</button>
                            </div>
                        </div>
                        <div className="chart-content" style={{ height: '300px' }}>
                            {barChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e5f2" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#a3aed0' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a3aed0' }} />
                                        <Tooltip cursor={{ fill: '#f4f7fe' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Bar dataKey="Income" fill="#4318ff" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : <p className="no-data">No completed income data available.</p>}
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-header">
                            <h4>Payment Methods</h4>
                            <PieChart size={20} />
                        </div>
                        <div className="chart-content" style={{ height: '300px' }}>
                            {pieChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            ) : <p className="no-data">No data available</p>}
                        </div>
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
                                                <a href={payment.receiptUrl.startsWith('/uploads') ? `http://localhost:8000${payment.receiptUrl}` : payment.receiptUrl}
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
        </div>
    );
};

export default FinancialReport;
