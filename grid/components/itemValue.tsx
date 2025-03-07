import React, { useState } from 'react'
import { Preview, PatchEvent, ObjectInput } from 'sanity'
import { Dialog, Card, Flex, Button, Stack } from '@sanity/ui'
import styles from './itemValue.css'
import { getMemberType } from '../utils'

interface ItemValueProps {
  value: any
  type: any
  markers?: any[]
  focusPath?: any[]
  onFocus?: (path: any[]) => void
  onBlur?: () => void
  readOnly?: boolean
  filterField?: (type: any, field: any) => boolean
  onChange: (patchEvent: PatchEvent, value: any) => void
  onRemove: (value: any) => void
  level?: number
}

const CLOSE_ACTION = {
  name: 'close',
  title: 'Close',
}
const CANCEL_ACTION = {
  name: 'cancel',
  title: 'Cancel',
}
const DELETE_ACTION = {
  name: 'delete',
  title: 'Delete',
  tone: 'critical' as const,
}

function isEmpty(itemVal: any): boolean {
  if (!itemVal) return true
  const IGNORE_KEYS = ['_key', '_type', '_weak']
  return Object.keys(itemVal).every((key) => IGNORE_KEYS.includes(key))
}

const RenderItemValue: React.FC<ItemValueProps> = (props) => {
  const {
    value,
    type,
    markers,
    focusPath,
    onFocus,
    onBlur,
    readOnly,
    filterField,
    onChange,
    onRemove,
  } = props

  const [isExpanded, setIsExpanded] = useState(false)
  const memberType = getMemberType(value, type)

  const handleEditStart = () => {
    setIsExpanded(true)
  }
  const handleEditStop = () => {
    setIsExpanded(false)
  }
  const handleRemove = () => {
    onRemove(value)
  }
  const handleDialogAction = (action: any) => {
    if (action.name === 'close' || action.name === 'cancel') {
      handleEditStop()
    }
    if (action.name === 'delete') {
      if (window.confirm('Do you really want to delete?')) {
        handleRemove()
      }
    }
  }

  const handleFieldChange = (patchEvent: PatchEvent) => {
    onChange(patchEvent, value)
  }

  const renderEditItemForm = (item: any) => {
    const childMarkers = markers?.filter((marker) => marker.path.length > 1)
    const itemIsEmpty = isEmpty(item)
    const actions = [
      itemIsEmpty ? CANCEL_ACTION : CLOSE_ACTION,
      !itemIsEmpty && !readOnly && DELETE_ACTION,
    ].filter(Boolean)

    return (
      <Dialog
        header={`Edit ${memberType?.title || memberType?.name || 'Item'}`}
        onClose={handleEditStop}
        id="grid-edit-dialog"
        width={1}
      >
        <Card padding={4}>
          <Stack space={4}>
            <ObjectInput
              value={itemIsEmpty ? undefined : item}
              schemaType={memberType}
              onChange={handleFieldChange}
              path={[{ _key: item._key }]}
              focusPath={focusPath}
              onFocus={onFocus}
              onBlur={onBlur}
              readOnly={readOnly || memberType?.readOnly}
              markers={childMarkers}
              filterField={filterField}
            />

            <Flex justify="flex-end" gap={2}>
              {actions.map((action: any) => (
                <Button
                  key={action.name}
                  tone={action.tone}
                  onClick={() => handleDialogAction(action)}
                  text={action.title}
                />
              ))}
            </Flex>
          </Stack>
        </Card>
      </Dialog>
    )
  }

  return (
    <>
      <div
        className={styles.value_container}
        tabIndex={0}
        onClick={value._key && handleEditStart}
      >
        <Preview layout="default" value={value} type={memberType} />
      </div>
      {isExpanded && renderEditItemForm(value)}
    </>
  )
}

export default RenderItemValue