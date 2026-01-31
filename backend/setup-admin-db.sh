#!/bin/bash

# Admin Panel Database Setup Script
# This script sets up the complete database for the admin panel

echo "🚀 Admin Panel Database Setup"
echo "=============================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create it from .env.example"
    exit 1
fi

# Load environment variables
source .env

# Check if required variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing required environment variables:"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   Please check your .env file"
    exit 1
fi

echo "✅ Environment variables loaded"

# Function to execute SQL file
execute_sql() {
    local sql_file=$1
    local description=$2
    
    echo "🔧 Executing: $description"
    echo "📁 File: $sql_file"
    
    # Using curl to execute SQL via Supabase REST API
    response=$(curl -s -X POST \
        "$SUPABASE_URL/rest/v1/rpc/execute_sql" \
        -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
        -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"sql\": $(cat "$sql_file" | jq -Rs .)}")
    
    if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
        echo "❌ Error executing $description:"
        echo "$response" | jq -r '.error'
        return 1
    else
        echo "✅ $description completed successfully"
        return 0
    fi
}

# Alternative: Using psql if PostgreSQL client is available
execute_sql_psql() {
    local sql_file=$1
    local description=$2
    
    if command -v psql &> /dev/null; then
        echo "🔧 Executing: $description (using psql)"
        echo "📁 File: $sql_file"
        
        # Extract connection details from SUPABASE_URL
        if [[ $SUPABASE_URL =~ postgresql://([^:]+):([^@]+)@([^:]+):([0-9]+)/(.+) ]]; then
            export PGPASSWORD="${BASH_REMATCH[2]}"
            psql_host="${BASH_REMATCH[3]}"
            psql_port="${BASH_REMATCH[4]}"
            psql_dbname="${BASH_REMATCH[5]}"
            psql_user="${BASH_REMATCH[1]}"
            
            if PGPASSWORD="$PGPASSWORD" psql -h "$psql_host" -p "$psql_port" -U "$psql_user" -d "$psql_dbname" -f "$sql_file"; then
                echo "✅ $description completed successfully"
                return 0
            else
                echo "❌ Error executing $description with psql"
                return 1
            fi
        else
            echo "⚠️  Could not parse SUPABASE_URL for psql connection"
            return 1
        fi
    else
        echo "⚠️  psql not found, skipping direct database execution"
        echo "   Please run the SQL files manually in Supabase SQL editor:"
        echo "   1. supabase-schema.sql"
        echo "   2. migrations/admin-panel-schema.sql"
        return 1
    fi
}

echo ""
echo "📋 Setup Steps:"
echo "==============="

# Step 1: Main schema
echo ""
echo "1️⃣  Setting up main database schema..."
if [ -f "supabase-schema.sql" ]; then
    if execute_sql_psql "supabase-schema.sql" "Main Schema"; then
        echo "✅ Main schema setup completed"
    else
        echo "⚠️  Please run supabase-schema.sql manually in Supabase SQL editor"
    fi
else
    echo "❌ supabase-schema.sql not found"
fi

# Step 2: Admin panel schema
echo ""
echo "2️⃣  Setting up admin panel schema..."
if [ -f "migrations/admin-panel-schema.sql" ]; then
    if execute_sql_psql "migrations/admin-panel-schema.sql" "Admin Panel Schema"; then
        echo "✅ Admin panel schema setup completed"
    else
        echo "⚠️  Please run migrations/admin-panel-schema.sql manually in Supabase SQL editor"
    fi
else
    echo "❌ migrations/admin-panel-schema.sql not found"
fi

# Step 3: Run Node.js setup script
echo ""
echo "3️⃣  Running Node.js setup script..."
if [ -f "scripts/setup-admin-database.js" ]; then
    if node scripts/setup-admin-database.js; then
        echo "✅ Node.js setup script completed"
    else
        echo "❌ Node.js setup script failed"
        exit 1
    fi
else
    echo "❌ scripts/setup-admin-database.js not found"
fi

echo ""
echo "🎉 Database setup completed!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Check your Supabase dashboard for the created admin user"
echo "2. Set up authentication for: admin@industrialsolutions.com"
echo "3. Start your backend server: npm run dev"
echo "4. Start your admin panel: cd ../admin-panel && npm run dev"
echo "5. Login to the admin panel with the created credentials"
echo ""
echo "🔐 Default Admin Email: admin@industrialsolutions.com"
echo "🔑 Password: (Set in Supabase Auth dashboard)"
echo ""
echo "📚 For more information, check the documentation."
