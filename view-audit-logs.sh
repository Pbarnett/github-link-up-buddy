#!/bin/bash
# Customer Lifecycle Audit Log Viewer

echo "🔍 Customer Lifecycle Audit Trail"
echo "=================================="

# Show recent audit entries
echo "📋 Recent Audit Entries:"
curl -s -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     -H "apikey: $SUPABASE_ANON_KEY" \
     "https://bbonngdyfyfjqfhvoljl.supabase.co/rest/v1/customer_lifecycle_audit?select=*&order=performed_at.desc&limit=10" | \
     jq -r '.[] | "⏰ \(.performed_at) | 👤 \(.customer_id) | 📝 \(.action) | 💬 \(.reason)"'

echo ""
echo "📊 Summary by Action:"
curl -s -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     -H "apikey: $SUPABASE_ANON_KEY" \
     "https://bbonngdyfyfjqfhvoljl.supabase.co/rest/v1/customer_lifecycle_audit?select=action&limit=1000" | \
     jq -r 'group_by(.action) | .[] | "\(.[0].action): \(length) records"'

echo ""
echo "🗂️  To see full details, run:"
echo "curl -H \"Authorization: Bearer \$SUPABASE_SERVICE_ROLE_KEY\" \\"
echo "     -H \"apikey: \$SUPABASE_ANON_KEY\" \\"
echo "     \"https://bbonngdyfyfjqfhvoljl.supabase.co/rest/v1/customer_lifecycle_audit?select=*&order=performed_at.desc\""
