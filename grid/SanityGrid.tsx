import React from 'react'
import type {ArrayOfObjectsInputProps} from 'sanity'

function SanityGrid(props: ArrayOfObjectsInputProps) {
  const { value } = props

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
      {Array.isArray(value) && value.map((item, index) => (
        <div
          key={item._key || index}
          style={{
            backgroundColor: '#f0f0f0',
            padding: '1rem',
            flex: '0 0 auto'
          }}
        >
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(item, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  )
}

export default SanityGrid