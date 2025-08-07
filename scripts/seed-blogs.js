const fs = require('fs');
const path = require('path');

// Configuration
const STRAPI_URL = 'http://localhost:1337';

// Sample blog data
const sampleBlogs = [
  {
    Heading: "How to build a successful brand and business",
    SubHeading: "A comprehensive guide to building a lasting brand that resonates with your audience and drives business growth",
    category: "Education",
    body: [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "Building a successful brand goes far beyond creating a memorable logo or catchy tagline. It's about creating a meaningful connection with your audience and delivering consistent value that sets you apart from the competition."
          }
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "children": [
          {
            "type": "text",
            "text": "Understanding Your Brand Identity"
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "Your brand identity is the foundation of everything you do. It encompasses your mission, values, personality, and the promise you make to your customers. Take time to clearly define what your brand stands for and how you want to be perceived in the market."
          }
        ]
      },
      {
        "type": "list",
        "format": "unordered",
        "children": [
          {
            "type": "list-item",
            "children": [
              {
                "type": "text",
                "text": "Define your core values and mission statement"
              }
            ]
          },
          {
            "type": "list-item",
            "children": [
              {
                "type": "text",
                "text": "Identify your unique selling proposition"
              }
            ]
          },
          {
            "type": "list-item",
            "children": [
              {
                "type": "text",
                "text": "Research your target audience thoroughly"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    Heading: "The difference between UI and UX",
    SubHeading: "Understanding the crucial distinction between User Interface and User Experience design and how they work together",
    category: "Mentorship",
    body: [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "Many people use UI and UX interchangeably, but they're actually two distinct aspects of design that work together to create great digital experiences. Understanding the difference is crucial for anyone working in digital product development."
          }
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "children": [
          {
            "type": "text",
            "text": "What is User Interface (UI)?"
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "UI design focuses on the visual elements that users interact with. This includes buttons, icons, typography, colors, and layout. It's about making sure the interface is visually appealing, consistent, and aligned with the brand."
          }
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "children": [
          {
            "type": "text",
            "text": "What is User Experience (UX)?"
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "UX design is about the overall feel and functionality of the product. It encompasses user research, information architecture, wireframing, and ensuring the entire user journey is smooth and intuitive."
          }
        ]
      }
    ]
  },
  {
    Heading: "Optimizing your website for SEO and getting more traffic",
    SubHeading: "Practical strategies to improve your search engine rankings and drive organic traffic to your website",
    category: "Education",
    body: [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "Search Engine Optimization (SEO) is essential for driving organic traffic to your website. With the right strategies, you can improve your visibility in search results and attract more qualified visitors to your site."
          }
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "children": [
          {
            "type": "text",
            "text": "Keyword Research and Strategy"
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "Start by identifying the keywords your target audience is searching for. Use tools like Google Keyword Planner, SEMrush, or Ahrefs to find relevant keywords with good search volume and manageable competition."
          }
        ]
      },
      {
        "type": "list",
        "format": "ordered",
        "children": [
          {
            "type": "list-item",
            "children": [
              {
                "type": "text",
                "text": "Conduct thorough keyword research"
              }
            ]
          },
          {
            "type": "list-item",
            "children": [
              {
                "type": "text",
                "text": "Optimize your on-page elements (title tags, meta descriptions, headers)"
              }
            ]
          },
          {
            "type": "list-item",
            "children": [
              {
                "type": "text",
                "text": "Create high-quality, valuable content"
              }
            ]
          },
          {
            "type": "list-item",
            "children": [
              {
                "type": "text",
                "text": "Build authoritative backlinks"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    Heading: "Supporting Education in Ethiopia: Making a Real Difference",
    SubHeading: "How educational sponsorship programs are transforming lives and communities across Ethiopia",
    category: "Education",
    body: [
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "Education is the key to breaking the cycle of poverty and creating sustainable change in communities. In Ethiopia, educational sponsorship programs are providing children with opportunities they never thought possible."
          }
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "children": [
          {
            "type": "text",
            "text": "The Impact of Educational Support"
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "When a child receives educational support, the benefits extend far beyond the individual. Families gain hope, communities develop, and entire regions experience positive transformation. Studies show that every year of education increases earning potential by 8-13%."
          }
        ]
      },
      {
        "type": "quote",
        "children": [
          {
            "type": "text",
            "text": "Education is the most powerful weapon which you can use to change the world."
          }
        ]
      },
      {
        "type": "paragraph",
        "children": [
          {
            "type": "text",
            "text": "Through our sponsorship program, we've seen remarkable transformations. Children who once had no access to education are now pursuing careers in medicine, engineering, and teaching, giving back to their communities in meaningful ways."
          }
        ]
      }
    ]
  }
];

// Function to seed blog posts
async function seedBlogs() {
  console.log('\n📝 STRAPI BLOG SEEDER');
  console.log('=' .repeat(50));
  
  console.log(`\n📊 Seeding ${sampleBlogs.length} sample blog posts...`);
  
  let successCount = 0;
  let failureCount = 0;
  const errors = [];
  
  for (let i = 0; i < sampleBlogs.length; i++) {
    const blog = sampleBlogs[i];
    
    console.log(`\n[${i + 1}/${sampleBlogs.length}] Creating blog: "${blog.Heading}"`);
    
    try {
      const response = await fetch(`${STRAPI_URL}/api/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: blog
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`  ✅ Created successfully (ID: ${result.data.id})`);
        successCount++;
      } else {
        const errorText = await response.text();
        console.log(`  ❌ Failed: ${response.status} - ${errorText}`);
        failureCount++;
        errors.push({ blog: blog.Heading, error: `${response.status}: ${errorText}` });
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      failureCount++;
      errors.push({ blog: blog.Heading, error: error.message });
    }
    
    // Small delay to avoid overwhelming the server
    if (i < sampleBlogs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 SEEDING SUMMARY');
  console.log('=' .repeat(50));
  console.log(`✅ Successfully created: ${successCount} blog posts`);
  console.log(`❌ Failed: ${failureCount} blog posts`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(({ blog, error }) => {
      console.log(`  • ${blog}: ${error}`);
    });
  }
  
  console.log('\n✨ Blog seeding process completed!\n');
  
  return { successCount, failureCount, errors };
}

// Main execution
if (require.main === module) {
  seedBlogs().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { seedBlogs };