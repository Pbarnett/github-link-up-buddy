#!/bin/bash
# Parker Flight Dashboard Version Control Script

echo "🚀 Parker Flight Dashboard Backup"
echo "================================="
echo "Timestamp: $(date)"
echo "Dashboards exported: 0"
echo ""

# Add to git if git is available
if command -v git &> /dev/null; then
    echo "📚 Adding to git version control..."
    git add monitoring/grafana/backups/
    git commit -m "Dashboard backup: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
    echo "✅ Version control update complete"
else
    echo "ℹ️ Git not available, skipping version control"
fi

echo ""
echo "📊 Dashboard backup complete!"
echo "Location: ./monitoring/grafana/backups/"
