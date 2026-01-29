import React, { useState } from 'react';

const DropshippingCourse = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const quizQuestions = [
    {
      question: "What is the main advantage of the dropshipping business model?",
      options: [
        "You always have the fastest shipping times",
        "You can charge higher prices than competitors",
        "You don't need to purchase inventory upfront",
        "You have complete control over product quality"
      ],
      correct: 2
    },
    {
      question: "What should you do BEFORE listing a product in your store?",
      options: [
        "Wait for a customer to order it",
        "Order a sample to test the quality",
        "Copy the supplier's description exactly",
        "Set the lowest price possible"
      ],
      correct: 1
    },
    {
      question: "What is a recommended markup for dropshipping products?",
      options: [
        "5-10%",
        "15-20%",
        "30-50%",
        "100-200%"
      ],
      correct: 2
    },
    {
      question: "Which of these is NOT mentioned as a popular dropshipping niche?",
      options: [
        "Pet supplies",
        "Phone accessories",
        "Health and wellness",
        "Industrial machinery"
      ],
      correct: 3
    },
    {
      question: "What percentage of expected revenue should you start with for marketing?",
      options: [
        "5-10%",
        "20-30%",
        "40-50%",
        "60-70%"
      ],
      correct: 1
    },
    {
      question: "What business structure is recommended for most dropshippers?",
      options: [
        "Sole Proprietorship",
        "Corporation",
        "LLC (Limited Liability Company)",
        "Partnership"
      ],
      correct: 2
    },
    {
      question: "When should you respond to customer inquiries?",
      options: [
        "Within 24 hours or less",
        "Within 2-3 days",
        "Within a week",
        "Only when you have time"
      ],
      correct: 0
    },
    {
      question: "What is the dropshipping order process?",
      options: [
        "Buy inventory → Customer orders → Ship product",
        "Customer orders → You ship → Supplier reimburses",
        "Supplier ships → Customer orders → You pay",
        "Customer orders → You forward to supplier → Supplier ships"
      ],
      correct: 3
    }
  ];

  const handleOptionClick = (questionIndex, optionIndex) => {
    if (!submitted) {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionIndex]: optionIndex
      });
    }
  };

  const handleSubmit = () => {
    if (Object.keys(selectedAnswers).length !== quizQuestions.length) {
      alert('Please answer all questions before submitting!');
      return;
    }

    let correctCount = 0;
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setSubmitted(true);
  };

 const getOptionClass = (questionIndex, optionIndex) => {
  if (!submitted) {
    return selectedAnswers[questionIndex] === optionIndex
      ? "bg-purple-600/30 border-purple-400 text-white"
      : "bg-white/10 border-white/20 text-gray-200 hover:bg-white/20 hover:border-purple-400";
  }

  const isCorrect = quizQuestions[questionIndex].correct === optionIndex;
  const isSelected = selectedAnswers[questionIndex] === optionIndex;

  if (isCorrect) return "bg-green-600/30 border-green-400 text-green-200";
  if (isSelected && !isCorrect) return "bg-red-600/30 border-red-400 text-red-200";
  return "bg-white/10 border-white/20 text-gray-400";
};


  const percentage = (score / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0F1A] via-[#111827] to-[#0B0F1A]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center p-10 bg-black/40 rounded-2xl mb-10 border border-gray-800 backdrop-blur-sm">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            🚀 Dropshipping Mastery Course
          </h1>
          <p className="text-gray-400 text-xl">
            Your Complete Guide to Building a Successful Dropshipping Business
          </p>
        </header>

        {/* Section 1 */}
        <section className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 mb-8 rounded-xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-5 pb-3 border-b-2 border-gray-700">
            1. Introduction to Dropshipping
          </h2>
          <p className="mb-4 text-gray-300">
            Dropshipping is a retail fulfillment method where a store doesn't keep the products it sells in stock. Instead, when you sell a product, you purchase the item from a third party and have it shipped directly to the customer. As a result, you never handle the product directly.
          </p>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">How Dropshipping Works</h3>
          <ol className="list-decimal ml-6 space-y-3 text-gray-300">
            <li><strong>Customer places an order:</strong> A customer browses your online store and purchases a product</li>
            <li><strong>You forward the order:</strong> You send the order details to your supplier along with payment</li>
            <li><strong>Supplier ships the product:</strong> The supplier packages and ships the product directly to your customer</li>
            <li><strong>You keep the profit:</strong> The difference between what the customer paid and what you paid the supplier is your profit</li>
          </ol>

        

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Advantages of Dropshipping</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Low startup costs:</strong> No need to invest in inventory upfront</li>
            <li><strong>Easy to start:</strong> You can launch a store quickly without worrying about warehouse space</li>
            <li><strong>Flexible location:</strong> Run your business from anywhere with an internet connection</li>
            <li><strong>Wide product selection:</strong> Offer a vast array of products without managing inventory</li>
            <li><strong>Scalability:</strong> As you grow, most of the work is handled by suppliers</li>
          </ul>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Challenges of Dropshipping</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Lower profit margins:</strong> Competition and supplier costs can squeeze profits</li>
            <li><strong>Inventory issues:</strong> You don't control stock levels, leading to potential availability problems</li>
            <li><strong>Shipping complexities:</strong> Working with multiple suppliers can create shipping challenges</li>
            <li><strong>Supplier errors:</strong> You're responsible for issues caused by suppliers</li>
            <li><strong>High competition:</strong> Low barriers to entry mean many competitors</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 mb-8 rounded-xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-5 pb-3 border-b-2 border-gray-700">
            2. Finding Your Niche
          </h2>
          <p className="mb-4 text-gray-300">
            Choosing the right niche is crucial for dropshipping success. A niche is a specific segment of the market that you'll focus on. The right niche will have adequate demand, manageable competition, and good profit potential.
          </p>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Criteria for Selecting a Profitable Niche</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Passion and interest:</strong> Choose something you're interested in to maintain motivation</li>
            <li><strong>Market demand:</strong> Use tools like Google Trends to verify people are searching for products</li>
            <li><strong>Profit potential:</strong> Products should sell for at least 3x their cost to ensure healthy margins</li>
            <li><strong>Competition level:</strong> Avoid oversaturated markets unless you have a unique angle</li>
            <li><strong>Target audience:</strong> Define who your ideal customer is and what they need</li>
          </ul>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Popular Dropshipping Niches</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li>Health and wellness products</li>
            <li>Pet supplies and accessories</li>
            <li>Home organization and improvement</li>
            <li>Phone and tech accessories</li>
            <li>Fashion and jewelry</li>
            <li>Hobby and craft supplies</li>
            <li>Baby and children's products</li>
            <li>Outdoor and camping gear</li>
          </ul>

         ]
        </section>

        {/* Section 3 */}
        <section className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 mb-8 rounded-xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-5 pb-3 border-b-2 border-gray-700">
            3. Finding Reliable Suppliers
          </h2>
          <p className="mb-4 text-gray-300">
            Your supplier relationship is the backbone of your dropshipping business. The right suppliers will provide quality products, reliable shipping, and good customer service.
          </p>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Popular Supplier Platforms</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>AliExpress:</strong> Massive product selection, beginner-friendly, but longer shipping times</li>
            <li><strong>Oberlo:</strong> Integrates directly with Shopify, simplifies product importing</li>
            <li><strong>Spocket:</strong> Features US and EU suppliers for faster shipping</li>
            <li><strong>SaleHoo:</strong> Verified supplier directory with quality control</li>
            <li><strong>Wholesale2B:</strong> Large catalog with automated order processing</li>
          </ul>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Evaluating Suppliers</h3>
          <ol className="list-decimal ml-6 space-y-3 text-gray-300">
            <li><strong>Order samples:</strong> Always test product quality before listing</li>
            <li><strong>Check reviews:</strong> Look for consistent positive feedback from other sellers</li>
            <li><strong>Test communication:</strong> Ensure they respond quickly and professionally</li>
            <li><strong>Verify shipping times:</strong> Confirm realistic delivery timeframes</li>
            <li><strong>Compare pricing:</strong> Balance cost with quality and service</li>
          </ol>

          
        </section>

        {/* Section 4 */}
        <section className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 mb-8 rounded-xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-5 pb-3 border-b-2 border-gray-700">
            4. Setting Up Your Online Store
          </h2>
          <p className="mb-4 text-gray-300">
            Your online store is your digital storefront. It needs to be professional, user-friendly, and optimized for conversions.
          </p>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Choosing an E-commerce Platform</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Shopify:</strong> Most popular for dropshipping, easy to use, extensive app ecosystem ($29-299/month)</li>
            <li><strong>WooCommerce:</strong> WordPress plugin, highly customizable, requires more technical knowledge (free + hosting)</li>
            <li><strong>BigCommerce:</strong> Built-in features, no transaction fees, scales well ($29-299/month)</li>
            <li><strong>Wix:</strong> Beginner-friendly, drag-and-drop builder, limited dropshipping apps ($23-49/month)</li>
          </ul>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Essential Store Elements</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Professional design:</strong> Clean, mobile-responsive theme that builds trust</li>
            <li><strong>Clear navigation:</strong> Easy-to-use menus and search functionality</li>
            <li><strong>High-quality images:</strong> Multiple product photos from different angles</li>
            <li><strong>Compelling descriptions:</strong> Detailed, benefit-focused product copy</li>
            <li><strong>Trust signals:</strong> Customer reviews, secure checkout badges, clear policies</li>
            <li><strong>About page:</strong> Build credibility with your brand story</li>
            <li><strong>Contact information:</strong> Make it easy for customers to reach you</li>
          </ul>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Pricing Strategy</h3>
          <p className="mb-3 text-gray-300">Effective pricing balances competitiveness with profitability:</p>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Cost-plus pricing:</strong> Add a markup (typically 30-50%) to supplier cost</li>
            <li><strong>Value-based pricing:</strong> Price based on perceived value to customer</li>
            <li><strong>Competitive pricing:</strong> Match or slightly undercut competitors</li>
            <li><strong>Psychological pricing:</strong> Use $19.99 instead of $20 for better conversion</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 mb-8 rounded-xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-5 pb-3 border-b-2 border-gray-700">
            5. Marketing Your Dropshipping Store
          </h2>
          <p className="mb-4 text-gray-300">
            Marketing drives traffic to your store and converts visitors into customers. A multi-channel approach typically works best.
          </p>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Social Media Marketing</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Facebook Ads:</strong> Powerful targeting options, large audience reach, start with $5-10/day budget</li>
            <li><strong>Instagram:</strong> Visual platform perfect for product showcases, use stories and reels</li>
            <li><strong>TikTok:</strong> Trending platform for reaching younger audiences with creative content</li>
            <li><strong>Pinterest:</strong> Ideal for lifestyle and visual products, high purchase intent</li>
          </ul>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Content Marketing</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Blog posts:</strong> Create helpful content related to your niche for SEO</li>
            <li><strong>Product guides:</strong> Help customers make informed decisions</li>
            <li><strong>Video content:</strong> Product demonstrations, tutorials, unboxings</li>
            <li><strong>Email marketing:</strong> Build a list and nurture relationships with subscribers</li>
          </ul>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Search Engine Optimization (SEO)</h3>
          <ol className="list-decimal ml-6 space-y-3 text-gray-300">
            <li><strong>Keyword research:</strong> Find what your customers are searching for</li>
            <li><strong>On-page optimization:</strong> Optimize titles, descriptions, and content</li>
            <li><strong>Link building:</strong> Get quality backlinks from relevant sites</li>
            <li><strong>Technical SEO:</strong> Ensure fast loading, mobile-friendly site</li>
          </ol>

          
        </section>

        {/* Section 6 */}
        <section className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 mb-8 rounded-xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
          <h2 className="text-3xl font-bold text-purple-400 mb-5 pb-3 border-b-2 border-purple-400/30">
            6. Customer Service and Order Fulfillment
          </h2>
          <p className="mb-4 text-gray-300">
            Excellent customer service differentiates successful dropshipping businesses from failures. Since you don't control fulfillment, communication becomes even more critical.
          </p>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Order Processing Best Practices</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Automate when possible:</strong> Use apps to automatically forward orders to suppliers</li>
            <li><strong>Send confirmation emails:</strong> Keep customers informed about their order status</li>
            <li><strong>Provide tracking information:</strong> Share tracking numbers as soon as available</li>
            <li><strong>Monitor orders:</strong> Check regularly for issues or delays</li>
            <li><strong>Be proactive:</strong> Contact customers about potential delays before they contact you</li>
          </ul>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Handling Customer Inquiries</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Respond quickly:</strong> Aim to reply within 24 hours or less</li>
            <li><strong>Be professional:</strong> Stay courteous even with difficult customers</li>
            <li><strong>Offer solutions:</strong> Focus on solving problems, not making excuses</li>
            <li><strong>Go the extra mile:</strong> Surprise customers with exceptional service</li>
          </ul>

          <h3 className="text-2xl font-semibold text-pink-400 mt-6 mb-4">Managing Returns and Refunds</h3>
          <ol className="list-decimal ml-6 space-y-3 text-gray-300">
            <li><strong>Clear policy:</strong> Have a transparent return policy on your website</li>
            <li><strong>Coordinate with supplier:</strong> Understand their return process</li>
            <li><strong>Quick resolution:</strong> Process returns and refunds promptly</li>
            <li><strong>Learn from returns:</strong> Track reasons to identify product or supplier issues</li>
          </ol>
        </section>

        {/* Section 7 */}
        <section className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 mb-8 rounded-xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-5 pb-3 border-b-2 border-gray-700">
            7. Scaling Your Business
          </h2>
          <p className="mb-4 text-gray-300">
            Once you've established a profitable operation, focus on scaling strategically to maximize growth while managing risks.
          </p>

          <h3 className="text-2xl font-semibold text-gray-100 mt-6 mb-4">Strategies for Growth</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Expand product line:</strong> Add complementary products to your existing niche</li>
            <li><strong>Increase ad spend:</strong> Gradually increase budget for profitable campaigns</li>
            <li><strong>Explore new channels:</strong> Test additional marketing platforms</li>
            <li><strong>Build a brand:</strong> Transition from generic dropshipping to a recognized brand</li>
            <li><strong>Optimize conversions:</strong> A/B test everything to improve conversion rates</li>
            <li><strong>Outsource tasks:</strong> Hire virtual assistants for customer service, order processing</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-100 mt-6 mb-4">Financial Management</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Track all expenses:</strong> Use accounting software like QuickBooks or Wave</li>
            <li><strong>Monitor key metrics:</strong> Track CAC (customer acquisition cost), LTV (lifetime value), profit margins</li>
            <li><strong>Maintain cash reserves:</strong> Keep funds available for inventory purchases and ad spend</li>
            <li><strong>Reinvest profits:</strong> Allocate percentage of profits back into marketing and growth</li>
          </ul>

         
        </section>

        {/* Section 8 */}
        <section className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 mb-8 rounded-xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-5 pb-3 border-b-2 border-gray-700">
            8. Legal and Business Considerations
          </h2>
          <p className="mb-4 text-gray-300">
            Proper legal setup protects you and legitimizes your business in customers' eyes.
          </p>

          <h3 className="text-2xl font-semibold text-gray-100 mt-6 mb-4">Business Structure</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Sole Proprietorship:</strong> Simplest structure, but no personal liability protection</li>
            <li><strong>LLC:</strong> Protects personal assets, relatively easy to set up (recommended for most)</li>
            <li><strong>Corporation:</strong> More complex, suitable for larger operations</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-100 mt-6 mb-4">Essential Legal Requirements</h3>
          <ul className="list-disc ml-6 space-y-2 text-gray-300">
            <li><strong>Business license:</strong> Check local requirements for online businesses</li>
            <li><strong>Sales tax:</strong> Understand nexus laws and collect sales tax where required</li>
            <li><strong>Privacy policy:</strong> Required by law, explain how you handle customer data</li>
            <li><strong>Terms of service:</strong> Outline rules for using your website</li>
            <li><strong>Return policy:</strong> Clearly state your return and refund procedures</li>
            <li><strong>Business bank account:</strong> Keep business and personal finances separate</li>
          </ul>
        </section>

        {/* Quiz Section */}
        <section className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 p-8 mb-8 rounded-xl border border-purple-500/20 backdrop-blur-sm shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-5 pb-3 border-b-2 border-gray-700">
            📝 Test Your Knowledge
          </h2>
          <p className="mb-6 text-gray-300">
            Answer these questions to test your understanding of dropshipping fundamentals.
          </p>

          {quizQuestions.map((q, qIndex) => (
            <div key={qIndex} className="bg-black/60 p-6 mb-6 rounded-lg border border-gray-700">
              <h4 className="text-gray-100 font-semibold mb-4 text-lg">
                Question {qIndex + 1}: {q.question}
              </h4>
              <div className="space-y-3">
                {q.options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    onClick={() => handleOptionClick(qIndex, oIndex)}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      submitted ? 'cursor-default' : 'cursor-pointer'
                    } ${getOptionClass(qIndex, oIndex)} ${
                      !submitted && 'hover:translate-x-1'
                    }`}
                  >
                    {String.fromCharCode(65 + oIndex)}) {option}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={submitted}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-lg text-lg font-semibold shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {submitted ? 'Quiz Completed' : 'Submit Quiz'}
          </button>

          {submitted && (
            <div className={`mt-6 p-6 rounded-lg text-center text-xl border-2 ${
              percentage >= 70 
                ? 'bg-green-500/20 border-green-400 text-green-400' 
                : 'bg-red-500/20 border-red-400 text-red-400'
            }`}>
              {percentage >= 70 ? (
                <>
                  🎉 Congratulations! You scored {score}/{quizQuestions.length} ({percentage.toFixed(0)}%)
                  <br />
                  You're ready to start your dropshipping journey!
                </>
              ) : (
                <>
                  📚 You scored {score}/{quizQuestions.length} ({percentage.toFixed(0)}%)
                  <br />
                  Review the material and try again to master the concepts!
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DropshippingCourse;