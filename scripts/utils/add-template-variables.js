#!/usr/bin/env node

import axios from 'axios';

const GRAFANA_URL = 'http://localhost:3001';
const USERNAME = 'admin';
const PASSWORD = 'admin';

const auth = {
  username: USERNAME,
  password: PASSWORD
};

// Template variables to add to dashboards
const templateVariables = [
  {
    name: 'datasource',
    type: 'datasource',
    label: 'Data Source',
    description: 'Select data source for queries',
    query: 'prometheus',
    refresh: 'on-dashboard-load',
    options: [],
    current: {
      selected: false,
      text: 'default',
      value: 'default'
    },
    hide: 0,
    includeAll: false,
    multi: false,
    regex: '',
    skipUrlSync: false,
    sort: 0,
    tagValuesQuery: '',
    tags: [],
    tagsQuery: '',
    useTags: false
  },
  {
    name: 'environment',
    type: 'custom',
    label: 'Environment',
    description: 'Select environment for filtering',
    query: 'development,staging,production',
    refresh: 'never',
    options: [
      { text: 'Development', value: 'development', selected: true },
      { text: 'Staging', value: 'staging', selected: false },
      { text: 'Production', value: 'production', selected: false }
    ],
    current: {
      selected: true,
      text: 'Development',
      value: 'development'
    },
    hide: 0,
    includeAll: true,
    multi: false,
    allValue: '.*',
    regex: '',
    skipUrlSync: false,
    sort: 0,
    tagValuesQuery: '',
    tags: [],
    tagsQuery: '',
    useTags: false
  },
  {
    name: 'service',
    type: 'query',
    label: 'Service',
    description: 'Select service for filtering metrics',
    query: 'label_values(up{job=~".*parker.*"}, job)',
    refresh: 'on-time-range-change',
    datasource: '$datasource',
    options: [],
    current: {
      selected: false,
      text: 'All',
      value: '$__all'
    },
    hide: 0,
    includeAll: true,
    multi: true,
    allValue: '.*',
    regex: '',
    skipUrlSync: false,
    sort: 1,
    tagValuesQuery: '',
    tags: [],
    tagsQuery: '',
    useTags: false
  },
  {
    name: 'instance',
    type: 'query',
    label: 'Instance',
    description: 'Select instance for detailed monitoring',
    query: 'label_values(up{job=~"$service"}, instance)',
    refresh: 'on-time-range-change',
    datasource: '$datasource',
    options: [],
    current: {
      selected: false,
      text: 'All',
      value: '$__all'
    },
    hide: 0,
    includeAll: true,
    multi: true,
    allValue: '.*',
    regex: '',
    skipUrlSync: false,
    sort: 1,
    tagValuesQuery: '',
    tags: [],
    tagsQuery: '',
    useTags: false
  }
];

async function getDashboards() {
  try {
    const response = await axios.get(`${GRAFANA_URL}/api/search`, { auth });
    return response.data.filter(dashboard => 
      dashboard.title && dashboard.title.includes('Parker Flight')
    );
  } catch (error) {
    console.error('Error fetching dashboards:', error.message);
    return [];
  }
}

async function getDashboard(uid) {
  try {
    const response = await axios.get(`${GRAFANA_URL}/api/dashboards/uid/${uid}`, { auth });
    return response.data;
  } catch (error) {
    console.error(`Error fetching dashboard ${uid}:`, error.message);
    return null;
  }
}

async function updateDashboard(dashboardData) {
  try {
    const response = await axios.post(`${GRAFANA_URL}/api/dashboards/db`, dashboardData, { 
      auth,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating dashboard:', error.message);
    return null;
  }
}

async function addTemplateVariables() {
  console.log('🔧 Adding template variables to Parker Flight dashboards...\n');
  
  const dashboards = await getDashboards();
  console.log(`Found ${dashboards.length} Parker Flight dashboards\n`);
  
  let updatedCount = 0;
  
  for (const dashboardMeta of dashboards) {
    console.log(`Processing: ${dashboardMeta.title}`);
    
    const dashboardData = await getDashboard(dashboardMeta.uid);
    if (!dashboardData || !dashboardData.dashboard) {
      console.log(`  ❌ Could not fetch dashboard data`);
      continue;
    }
    
    const dashboard = dashboardData.dashboard;
    
    // Initialize templating if it doesn't exist
    if (!dashboard.templating) {
      dashboard.templating = { list: [] };
    }
    
    // Check if template variables already exist
    const existingVarNames = dashboard.templating.list.map(v => v.name);
    const varsToAdd = templateVariables.filter(v => !existingVarNames.includes(v.name));
    
    if (varsToAdd.length === 0) {
      console.log(`  ✅ Already has template variables`);
      continue;
    }
    
    // Add new template variables
    dashboard.templating.list = [...dashboard.templating.list, ...varsToAdd];
    
    // Update panels to use template variables (basic example)
    if (dashboard.panels) {
      dashboard.panels.forEach(panel => {
        if (panel.targets) {
          panel.targets.forEach(target => {
            if (target.expr && typeof target.expr === 'string') {
              // Add datasource variable reference
              target.datasource = '$datasource';
              
              // Add environment filtering to queries where applicable
              if (target.expr.includes('up{') && !target.expr.includes('environment')) {
                target.expr = target.expr.replace(
                  /up\{([^}]*)\}/g, 
                  'up{$1,environment=~"$environment"}'
                );
              }
            }
          });
        }
      });
    }
    
    const updateData = {
      dashboard: dashboard,
      message: 'Added template variables for optimization',
      overwrite: true
    };
    
    const result = await updateDashboard(updateData);
    if (result) {
      console.log(`  ✅ Added ${varsToAdd.length} template variables`);
      updatedCount++;
    } else {
      console.log(`  ❌ Failed to update dashboard`);
    }
  }
  
  console.log(`\n🎉 Successfully updated ${updatedCount} dashboards with template variables`);
  console.log('\nTemplate variables added:');
  templateVariables.forEach(v => {
    console.log(`  • ${v.name} (${v.type}): ${v.description}`);
  });
}

async function main() {
  try {
    await addTemplateVariables();
  } catch (error) {
    console.error('Script failed:', error.message);
    process.exit(1);
  }
}

main();
