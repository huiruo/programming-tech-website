```tsx
import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { XCircle } from 'lucide-react';

interface DraggableBoxProps {
  isOpen: boolean
  onClose(): void
}

export const DraggableBox = (props: DraggableBoxProps) => {
  const [doc, setDoc] = useState('');
  const { isOpen, onClose } = props

  const handleChange = (event) => {
    setDoc(event.target.value);
  };

  const onSubmit = () => {
    console.log('doc', doc)
  }

  return <>
    {isOpen && (
      <div style={{ height: '100vh' }}>
        <Rnd
          default={{
            // x: 0,
            // y: 0,
            // center
            // x: (window.innerWidth - 500) / 2,
            // y: (window.innerHeight - 200) / 2,
            // upper right corner
            x: window.innerWidth - 520,
            y: 20,
            width: 450,
            height: 230,
          }}
          minWidth={280}
          minHeight={190}
          maxWidth={800}
          maxHeight={500}
          bounds='window'
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            background: '#fff',
            borderRadius: '8px',
            border: '1px solid #9c27b0'
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
          }}>
            <div style={{ position: 'relative', height: '20px' }}>
              <XCircle style={{ cursor: 'pointer' }} color="#9c27b0" size={20} onClick={() => onClose()} />
            </div>

            <textarea style={{ width: '100%',height:'75%',boxSizing: 'border-box',border: '1px solid ghostwhite' }} value={doc} onChange={handleChange} />

            <div style={{position: 'relative', height: '10%', }}>
            <div style={{
              position: 'absolute',
              // bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              <button
                style={{
                  width: '150px',
                  height: '30px',
                  background: '#9c27b0',
                  color: '#fff',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={onSubmit}>Submit</button>
            </div>
            </div>
          </div>
        </Rnd>
      </div >
    )}
  </>
};
```