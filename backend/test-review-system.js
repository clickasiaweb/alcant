const fetch = require('node-fetch');

// Test the review system
async function testReviewSystem() {
  console.log('🧪 Testing Review System...\n');

  try {
    // Test 1: Create a review
    console.log('1️⃣ Testing review creation...');
    const createResponse = await fetch('http://localhost:5001/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: '00000000-0000-0000-0000-000000000000', // Replace with actual product ID
        rating: 5,
        review_text: 'This is an amazing product! Highly recommended for anyone looking for quality and style.'
      })
    });

    const createData = await createResponse.json();
    console.log('✅ Create Review Response:', createData);

    if (createResponse.ok) {
      const reviewId = createData.data.id;
      
      // Test 2: Get reviews for product
      console.log('\n2️⃣ Testing review fetch...');
      const getResponse = await fetch(`http://localhost:5001/api/reviews/${createData.data.product_id}`);
      const getData = await getResponse.json();
      console.log('✅ Get Reviews Response:', getData);

      // Test 3: Get rating summary
      console.log('\n3️⃣ Testing rating summary...');
      const summaryResponse = await fetch(`http://localhost:5001/api/reviews/summary/${createData.data.product_id}`);
      const summaryData = await summaryResponse.json();
      console.log('✅ Rating Summary Response:', summaryData);

      console.log('\n🎉 All tests completed successfully!');
      console.log('\n📋 Test Results:');
      console.log(`   - Average Rating: ${summaryData.average_rating}`);
      console.log(`   - Total Reviews: ${summaryData.review_count}`);
      console.log(`   - 5-star reviews: ${summaryData.distribution[5] || 0}`);
      console.log(`   - 4-star reviews: ${summaryData.distribution[4] || 0}`);
      console.log(`   - 3-star reviews: ${summaryData.distribution[3] || 0}`);
      console.log(`   - 2-star reviews: ${summaryData.distribution[2] || 0}`);
      console.log(`   - 1-star reviews: ${summaryData.distribution[1] || 0}`);
    } else {
      console.log('❌ Create Review Failed:', createData);
    }

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

// Test with multiple reviews
async function testMultipleReviews() {
  console.log('\n🔄 Testing multiple reviews...');
  
  const productId = '00000000-0000-0000-0000-000000000000'; // Replace with actual product ID
  
  const reviews = [
    { rating: 5, review_text: 'Excellent product! Exceeded my expectations.' },
    { rating: 4, review_text: 'Very good quality, would recommend.' },
    { rating: 3, review_text: 'Average product, works as expected.' },
    { rating: 2, review_text: 'Not great, had some issues.' },
    { rating: 1, review_text: 'Poor quality, would not recommend.' }
  ];

  for (let i = 0; i < reviews.length; i++) {
    console.log(`\n📝 Adding review ${i + 1}/5...`);
    
    const response = await fetch('http://localhost:5001/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        rating: reviews[i].rating,
        review_text: reviews[i].review_text
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ Review ${i + 1} added successfully`);
    } else {
      console.log(`❌ Review ${i + 1} failed:`, data.error);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Check final ratings
  console.log('\n📊 Checking final ratings...');
  const finalResponse = await fetch(`http://localhost:5001/api/reviews/summary/${productId}`);
  const finalData = await finalResponse.json();
  
  console.log('✅ Final Rating Summary:', finalData);
}

// Run tests
if (require.main === module) {
  testReviewSystem()
    .then(() => testMultipleReviews())
    .catch(console.error);
}

module.exports = { testReviewSystem, testMultipleReviews };
