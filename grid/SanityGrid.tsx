import React, {useEffect, useRef, useState} from 'react'
import {
  ArrayOfObjectsInputProps,
  ArraySchemaType,
  PatchEvent,
  set,
  setIfMissing,
  unset,
  insert,
} from 'sanity'
import {Button, Stack, Card} from '@sanity/ui'
import useEventListener from './utils/hooks/useEventListener'
import {createProtoValue, randomKey, getMemberType} from './utils'
import RenderItemValue from './components/itemValue'
import styles from './component.module.css'

function pathStartsWith(path: any[], prefix: any[]): boolean {
  if (prefix.length > path.length) return false
  for (let i = 0; i < prefix.length; i++) {
    const pVal = prefix[i]
    const pathVal = path[i]
    if (
      typeof pVal === 'object' &&
      pVal !== null &&
      '_key' in pVal &&
      '_key' in pathVal
    ) {
      if (pVal._key !== pathVal._key) return false
    } else if (pVal !== pathVal) {
      return false
    }
  }
  return true
}

export default function SanityGrid(props: ArrayOfObjectsInputProps<any, ArraySchemaType>) {
  const {
    value = [],
    schemaType,
    onChange,
    readOnly,
    members = [],
    focusPath = []
  } = props

  const colFallback = 6
  const rowFallback = 4
  const rows = rowFallback
  const columns = colFallback

  const gridRef = useRef<HTMLUListElement>(null)
  const draggedItemKeyRef = useRef<string | null>(null)

  const [gridDetails] = useState(() => ({
    rowHeight: 0,
    columnWidth: 0,
    gap: 5,
  }))

  // Recalculate row/col size on container resize
  const updateGridDetails = () => {
    if (!gridRef.current) return
    gridDetails.rowHeight = gridRef.current.offsetHeight / rows
    gridDetails.columnWidth = gridRef.current.offsetWidth / columns
  }

  useEventListener('resize', updateGridDetails)

  useEffect(() => {
    updateGridDetails()
  }, [])

  const handleItemDragStart = (e: React.DragEvent<HTMLLIElement>, itemKey: string) => {
    draggedItemKeyRef.current = itemKey
  }

  // We need to allow drop
  const handleDragOver = (e: React.DragEvent<HTMLUListElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLUListElement>) => {
    e.preventDefault()

    const itemKey = draggedItemKeyRef.current
    if (!itemKey) return

    const foundItem = (value || []).find((element: any) => element._key === itemKey)
    if (!foundItem) return

    const gridBounding = gridRef.current?.getBoundingClientRect()
    if (!gridBounding) return

    const x = e.clientX - gridBounding.left
    const y = e.clientY - gridBounding.top

    const pos = {
      col: Math.round(x / gridDetails.columnWidth) + 1,
      row: Math.round(y / gridDetails.rowHeight) + 1,
    }

    const newItem = {...foundItem}
    if (!newItem.settings) newItem.settings = {}
    newItem.settings.posX = pos.col
    newItem.settings.posY = pos.row

    onChange(PatchEvent.from([set(newItem)]))

    draggedItemKeyRef.current = null
  }

  const handleItemChange = (patchEvent: PatchEvent, item: any) => {
    if (!item) {
      console.error("handleItemChange received no valid item, skipping update")
      return
    }
    let updatedItem = item
    const patchZero = patchEvent.patches[0] as any
    const componentx = patchZero?.value?.component?.[0];
    // if (componentx && componentx._type) {
    //   updatedItem._componenttype = componentx._type
    //   updatedItem._componentkey = componentx._key
    // if(!updatedItem._componentMembers) {
    //   updatedItem._componentMembers = []
    // }
    // updatedItem._componentMembers.push(componentx);
    // }
    updatedItem.component = componentx;
    // updatedItem._key = item._key

    const memberType = getMemberType(item, schemaType)
    if (!memberType || memberType.readOnly) {
      return
    }
    // let key = item._key
    // if (!key) {
    //   key = randomKey(12)
    //   item._key = key
    // }
    // const tmpMembers = updatedItem._componentMembers
    // delete updatedItem._componentMembers

    onChange(
      PatchEvent.from(set(updatedItem, [{_key: updatedItem._key}]))
    )

    // updatedItem._componentMembers = tmpMembers
  }

  const handleAddItem = () => {
    if (!schemaType?.of?.[0]) {
      console.error("Grid schema type is missing 'of' definition. Could not add item.")
      return
    }
    const newValue = {
      ...createProtoValue(schemaType.of[0]),
      component: [],
    }
    onChange(PatchEvent.from([setIfMissing([]), insert([newValue], 'after', [-1])]))
  }

  const removeItem = (item: any) => {
    onChange(
      PatchEvent.from([
        unset(
          item._key
            ? [{_key: item._key}]
            : [value.indexOf(item)]
        )
      ])
    )
  }

  const handleRemoveItem = (item: any) => {
    removeItem(item)
  }

  const renderShadowGrid = (cols: number, rowCount: number) => {
    const items = []
    for (let i = 0; i < cols * rowCount; i++) {
      items.push(<span key={i}></span>)
    }
    return items
  }

  const renderGrid = () => {
    if (!value || !value.length) {
      return <p style={{color: '#666'}}>No grid items created yet</p>
    }
    const gridStyles: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      position: 'relative',
      gap: '5px',
    }
    return (
      <ul
        ref={gridRef}
        className={styles.grid_field}
        style={gridStyles}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {value.map((item: any, i: number) => {
          const isItemFocused = pathStartsWith(focusPath, [{_key: item._key}])
          const childFocusPath = isItemFocused ? focusPath.slice(1) : []
          const {width, height, posX, posY} = item.settings || {}
          return (
            <li
              className={styles.grid_item}
              key={item._key || i}
              data-key={item._key || i}
              draggable={!readOnly}
              onDragStart={(e) => handleItemDragStart(e, item._key)}
              style={{
                gridColumnStart: posX || 'auto',
                gridColumnEnd: width ? `span ${width}` : 'auto',
                gridRowStart: posY || 'auto',
                gridRowEnd: height ? `span ${height}` : 'auto',
              }}
            >
              <RenderItemValue
                parentType={schemaType}
                value={item}
                readOnly={readOnly}
                onRemove={handleRemoveItem}
                onChange={(patchEvent: PatchEvent) => handleItemChange(patchEvent, item)}
                members={[]}
                focusPath={childFocusPath}
              />
            </li>
          )
        })}
        <div className={styles.grid_field_shadow} style={gridStyles}>
          {renderShadowGrid(columns, rows)}
        </div>
      </ul>
    )
  }

  return (
    <Card padding={3} style={{border: '1px solid #eee'}}>
      <Stack space={3}>
        {renderGrid()}
        {!readOnly && (
          <Button text="Add Grid Item" tone="primary" onClick={handleAddItem} />
        )}
      </Stack>
    </Card>
  )
}