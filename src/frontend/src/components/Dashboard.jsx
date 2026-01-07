import React, { useState, useEffect } from 'react';

function Dashboard({ items, onCategoryFilter }) {
  const [analytics, setAnalytics] = useState({
    totalItems: 0,
    avgContentLength: 0,
    topCollaborators: [],
    contentTypeBreakdown: {},
    recentAdditions: [],
    sectionStats: {}
  });

  useEffect(() => {
    if (items.length > 0) {
      calculateAnalytics();
    }
  }, [items]);

  const calculateAnalytics = () => {
    const totalItems = items.length;
    const avgContentLength = Math.round(
      items.reduce((sum, item) => sum + item.content.length, 0) / totalItems
    );

    // Top collaborators
    const collaboratorCount = {};
    items.forEach(item => {
      if (item.collaborators) {
        item.collaborators.forEach(collab => {
          collaboratorCount[collab] = (collaboratorCount[collab] || 0) + 1;
        });
      }
    });
    const topCollaborators = Object.entries(collaboratorCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Content type breakdown
    const contentTypeBreakdown = items.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {});

    // Recent additions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentAdditions = items
      .filter(item => new Date(item.created_at) > sevenDaysAgo)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);

    // Section stats
    const sectionStats = {};
    items.forEach(item => {
      if (item.sections) {
        Object.keys(item.sections).forEach(section => {
          sectionStats[section] = (sectionStats[section] || 0) + 1;
        });
      }
    });

    setAnalytics({
      totalItems,
      avgContentLength,
      topCollaborators,
      contentTypeBreakdown,
      recentAdditions,
      sectionStats
    });
  };

  const bulkOperations = [
    { id: 'export-all', label: 'Export All Data', icon: '📥' },
    { id: 'export-filtered', label: 'Export Filtered Results', icon: '🔍' },
    { id: 'generate-report', label: 'Generate Analytics Report', icon: '📊' },
    { id: 'backup-index', label: 'Backup Index', icon: '💾' }
  ];

  const executeBulkOperation = (operationId) => {
    switch (operationId) {
      case 'export-all':
        const allData = JSON.stringify(items, null, 2);
        downloadFile(allData, `music-index-full-export-${new Date().toISOString().split('T')[0]}.json`);
        break;
      case 'export-filtered':
        // This would need to be passed from parent component
        alert('Export filtered results from main interface');
        break;
      case 'generate-report':
        generateReport();
        break;
      case 'backup-index':
        alert('Index backup functionality would be implemented here');
        break;
      default:
        break;
    }
  };

  const downloadFile = (content, filename) => {
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(content);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
  };

  const generateReport = () => {
    const report = {
      generated_at: new Date().toISOString(),
      summary: analytics,
      recommendations: generateRecommendations()
    };
    downloadFile(JSON.stringify(report, null, 2), `analytics-report-${new Date().toISOString().split('T')[0]}.json`);
  };

  const generateRecommendations = () => {
    const recommendations = [];

    if (analytics.totalItems < 10) {
      recommendations.push("Consider adding more documents to build a comprehensive music library");
    }

    if (analytics.topCollaborators.length === 0) {
      recommendations.push("Add collaborator information to improve relationship mapping");
    }

    const sectionsCount = Object.keys(analytics.sectionStats).length;
    if (sectionsCount < 3) {
      recommendations.push("Encourage more structured content with clear sections (Verse, Chorus, etc.)");
    }

    return recommendations;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Analytics Dashboard</h2>
        <p>Command center insights and bulk operations</p>
      </div>

      <div className="analytics-grid">
        <div className="metric-card">
          <h3>Total Items</h3>
          <div className="metric-value">{analytics.totalItems}</div>
        </div>

        <div className="metric-card">
          <h3>Average Content Length</h3>
          <div className="metric-value">{analytics.avgContentLength}</div>
          <span className="metric-unit">characters</span>
        </div>

        <div className="metric-card">
          <h3>Content Types</h3>
          <div className="content-breakdown">
            {Object.entries(analytics.contentTypeBreakdown).map(([type, count]) => (
              <div key={type} className="breakdown-item">
                <span className="breakdown-label">{type}</span>
                <span className="breakdown-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-card">
          <h3>Sections Detected</h3>
          <div className="metric-value">{Object.keys(analytics.sectionStats).length}</div>
          <span className="metric-unit">types</span>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>👥 Top Collaborators</h3>
        <div className="collaborators-list">
          {analytics.topCollaborators.map(([name, count], index) => (
            <div key={name} className="collaborator-item">
              <span className="rank">#{index + 1}</span>
              <span className="name">{name}</span>
              <span className="count">{count} items</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>🆕 Recent Additions</h3>
        <div className="recent-list">
          {analytics.recentAdditions.map(item => (
            <div key={item.id} className="recent-item">
              <span className="recent-title">{item.title}</span>
              <span className="recent-date">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section">
        <h3>⚡ Bulk Operations</h3>
        <div className="bulk-operations">
          {bulkOperations.map(operation => (
            <button
              key={operation.id}
              onClick={() => executeBulkOperation(operation.id)}
              className="bulk-btn"
            >
              <span className="bulk-icon">{operation.icon}</span>
              <span className="bulk-label">{operation.label}</span>
            </button>
          ))}
        </div>
      </div>

      {analytics.recommendations && analytics.recommendations.length > 0 && (
        <div className="dashboard-section">
          <h3>💡 Recommendations</h3>
          <div className="recommendations">
            {analytics.recommendations.map((rec, index) => (
              <div key={index} className="recommendation">
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;