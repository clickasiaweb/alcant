// Fix the backend to use correct case for status values
const fs = require('fs');
const path = require('path');

// Read the current order controller
const controllerPath = path.join(__dirname, 'controllers', 'orderControllerSupabase.js');
let controllerContent = fs.readFileSync(controllerPath, 'utf8');

// Fix the case issues
controllerContent = controllerContent.replace(
  "payment_status: paymentDetails?.paidAt ? 'paid' : 'pending',",
  "payment_status: paymentDetails?.paidAt ? 'Paid' : 'Pending',"
);

controllerContent = controllerContent.replace(
  "order_status: 'pending',",
  "order_status: 'Pending',"
);

controllerContent = controllerContent.replace(
  "status: 'Pending',",
  "status: 'Pending',"
);

// Write the fixed content back
fs.writeFileSync(controllerPath, controllerContent);

console.log('✅ Fixed backend case sensitivity issues');
console.log('📝 Updated payment_status to use proper case');
console.log('📝 Updated order_status to use proper case');
console.log('');
console.log('🔄 Please redeploy the backend to apply these changes');
