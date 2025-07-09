// Script to remove old cdnav/cdfooter components from pages
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../../../.env.local') })

// Configure Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

console.log('🔧 Using project:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || import.meta.env.SANITY_STUDIO_PROJECT_ID)
console.log('🔧 Using dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET || 'production')

async function removeOldComponents() {
  try {
    console.log('🚀 Starting cleanup of old components...\n')
    
    // Fetch all pages and homepage with old components
    const documents = await client.fetch(`
      *[_type in ["page", "homepage"] && defined(components) && count(components[_type in ["cdnav", "cdfooter"]]) > 0]{
        _id,
        _type,
        _rev,
        title,
        "oldComponentCount": count(components[_type in ["cdnav", "cdfooter"]]),
        components
      }
    `)
    
    console.log(`📄 Found ${documents.length} documents with old components\n`)
    
    if (documents.length === 0) {
      console.log('✅ No documents found with old components. Your data is already clean!')
      return
    }
    
    for (const doc of documents) {
      console.log(`\n🔄 Processing ${doc._type}: ${doc.title || doc._id}`)
      console.log(`   Found ${doc.oldComponentCount} old components to remove`)
      
      // Filter out old components
      const updatedComponents = doc.components.filter(component => {
        if (component._type === 'cdnav' || component._type === 'cdfooter') {
          console.log(`   ❌ Removing ${component._type}`)
          return false
        }
        return true
      })
      
      // Update the document
      try {
        await client
          .patch(doc._id)
          .set({ components: updatedComponents })
          .commit()
        
        console.log(`   ✅ Successfully cleaned ${doc._type}: ${doc.title || doc._id}`)
        console.log(`   📊 Components: ${doc.components.length} → ${updatedComponents.length}`)
      } catch (error) {
        console.error(`   ❌ Failed to update ${doc._id}:`, error.message)
      }
    }
    
    console.log('\n✨ Cleanup complete!')
    console.log('\n📝 Next steps:')
    console.log('   1. Go to Sanity Studio')
    console.log('   2. Add new Navigation and Footer reference components to your pages')
    console.log('   3. Select the global components you created')
    console.log('   4. Publish the changes')
    
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error)
    console.error('Error details:', error.message)
    console.error('\n💡 Make sure you have:')
    console.error('   - Valid Sanity API token in SANITY_API_TOKEN')
    console.error('   - Correct project ID and dataset')
    console.error('   - The token has write permissions')
  }
}

// Run the cleanup
removeOldComponents()