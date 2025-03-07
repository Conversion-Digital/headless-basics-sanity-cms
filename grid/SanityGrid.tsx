import React, {forwardRef, useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import {Preview, set, setIfMissing, unset, insert, PatchEvent} from 'sanity'
import {Button, Stack, Card} from '@sanity/ui'
import gsap from 'gsap'
import Draggable from 'gsap/Draggable'
import useEventListener from './utils/hooks/useEventListener'
import {createProtoValue, randomKey, getMemberType} from './utils'
import RenderItemValue from './components/itemValue'
import styles from './component.module.css'

// Local function to replicate startsWith check on array paths
function pathStartsWith(path: any[], prefix: any[]): boolean {
  if (prefix.length > path.length) return false
  for (let i = 0; i < prefix.length; i++) {
    const pVal = prefix[i]
    const pathVal = path[i]
    if (typeof pVal === 'object' && pVal !== null && '_key' in pVal && '_key' in pathVal) {
      if (pVal._key !== pathVal._key) return false
    } else if (pVal !== pathVal) {
      return false
    }
  }
  return true
}

gsap.registerPlugin(Draggable)

const NO_MARKERS: any[] = []

interface GridItem {
  _key?: string
  _type?: string
  settings?: {
    width?: number
    height?: number
    posX?: number
    posY?: number
  }
  [key: string]: any
}

interface GridProps {
  level: number
  value?: GridItem[]
  type: {
    of: any[]
    name?: string
    title?: string
    readOnly?: boolean
  }
  document?: any
  onChange: (event: PatchEvent) => void
  readOnly?: boolean
  markers?: any[]
  focusPath?: any[]
  onFocus?: (path: any[]) => void
  onBlur?: () => void
  filterField?: (type: any, field: any) => boolean
}

const colFallback = 6
const rowFallback = 4

const SanityGrid = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  const {
    level,
    value = [],
    type,
    document,
    onChange,
    readOnly,
    markers = [],
    focusPath = [],
    onFocus,
    onBlur,
    filterField,
  } = props

  const gridRef = useRef<HTMLUListElement>(null)
  const draggableRef = useRef<any>(null)

  const rows = document?.sanitygrid?.layoutSettings?.rows || rowFallback
  const columns = document?.sanitygrid?.layoutSettings?.columns || colFallback

  const gridDetails = {
    rowHeight: 0,
    columnWidth: 0,
    gap: 5,
  }

  const handleDragEnd = (e: any) => {
    const closestElement = e.target?.closest(`.${styles.grid_item}`)
    if (!closestElement) {
      console.error('Sanity Grid Input could not find the dragged element.')
      return
    }

    const {rowHeight, columnWidth} = gridDetails
    const itemKey = closestElement.dataset.key
    const foundItem = (value || []).find((element) => element._key === itemKey)
    if (!foundItem) return

    const gridBounding = gridRef.current?.getBoundingClientRect()
    const elementBounding = closestElement.getBoundingClientRect()
    if (!gridBounding) return

    const diffs = {
      x: Math.round(elementBounding.left - gridBounding.left),
      y: Math.round(elementBounding.top - gridBounding.top),
    }

    const pos = {
      col: Math.round(diffs.x / columnWidth) + 1,
      row: Math.round(diffs.y / rowHeight) + 1,
    }

    let newItem = {...foundItem}
    if (!newItem.settings) newItem.settings = {}
    newItem.settings.posX = pos.col
    newItem.settings.posY = pos.row

    onChange(PatchEvent.from([set(newItem)]))

    gsap.set(closestElement, {
      transform: '',
      gridColumnStart: pos.col,
      gridRowStart: pos.row,
    })
  }

  const createDraggable = () => {
    const snap = (val: number, snapTo: number) => {
      return Math.round(val / snapTo) * snapTo
    }

    draggableRef.current = Draggable.create(`.${styles.grid_item}`, {
      bounds: gridRef.current,
      throwProps: true,
      type: 'x,y',
      liveSnap: {
        x: (val: number) => snap(val, gridDetails.columnWidth),
        y: (val: number) => snap(val, gridDetails.rowHeight),
      },
      onDragEnd: handleDragEnd,
    })
  }

  const updateGridDetails = () => {
    if (!gridRef.current) return
    gridDetails.rowHeight = gridRef.current.offsetHeight / rows
    gridDetails.columnWidth = gridRef.current.offsetWidth / columns
  }

  const handleResize = () => {
    updateGridDetails()
  }

  useEventListener('resize', handleResize)

  useEffect(() => {
    updateGridDetails()
    createDraggable()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleItemChange = (patchEvent: PatchEvent, item: GridItem) => {
    const memberType = getMemberType(item, type)
    if (!memberType || memberType.readOnly) {
      return
    }
    const key = item._key || randomKey(12)
    onChange(
      patchEvent
        .prefixAll({_key: key})
        .prepend(item._key ? [] : [set(key, [value.indexOf(item), '_key'])])
    )
  }

  const removeItem = (item: GridItem) => {
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

  const handleRemoveItem = (item: GridItem) => {
    removeItem(item)
  }

  const handleAddItem = () => {
    const newValue = createProtoValue(type.of[0])
    onChange(PatchEvent.from([setIfMissing([]), insert([newValue], 'after', [-1])]))
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

    const gridStyles = {
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
    }

    return (
      <ul ref={gridRef} className={styles.grid_field} style={gridStyles}>
        {value.map((item, i) => {
          // Replacing startsWith with local pathStartsWith
          const isChildMarker = (marker: any) =>
            pathStartsWith(marker.path, [i]) ||
            pathStartsWith(marker.path, [{_key: item && item._key}])

          const childMarkers = markers.filter(isChildMarker)
          const {width, height, posX, posY} = item.settings || {}
          return (
            <li
              className={styles.grid_item}
              key={item._key || i}
              data-key={item._key || i}
              style={{
                gridColumnStart: posX || 'auto',
                gridColumnEnd: width ? `span ${width}` : 'auto',
                gridRowStart: posY || 'auto',
                gridRowEnd: height ? `span ${height}` : 'auto',
              }}
            >
              <RenderItemValue
                type={type}
                value={item}
                level={level}
                markers={childMarkers?.length === 0 ? NO_MARKERS : childMarkers}
                onRemove={handleRemoveItem}
                onChange={handleItemChange}
                focusPath={focusPath}
                filterField={filterField}
                onFocus={onFocus}
                onBlur={onBlur}
                readOnly={readOnly}
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
    <Card ref={ref} padding={3} style={{border: '1px solid #eee'}}>
      <Stack space={3}>
        {renderGrid()}
        {!readOnly && (
          <Button text="Add Grid Item" tone="primary" onClick={handleAddItem} />
        )}
      </Stack>
    </Card>
  )
})

SanityGrid.propTypes = {
  type: PropTypes.shape({
    of: PropTypes.array.isRequired,
    name: PropTypes.string,
    title: PropTypes.string,
    readOnly: PropTypes.bool,
  }).isRequired,
  level: PropTypes.number.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
}

export default SanityGrid