import React, { useState } from 'react'
import {
  Preview,
  PatchEvent,
  ObjectInput,
  FormPatch,
  FieldProps,
  InputProps,
  ObjectItemProps,
  Path,
  RenderPreviewCallbackProps,
} from 'sanity'
import { Dialog, Card, Flex, Button, Stack, Select } from '@sanity/ui'
import styles from './itemValue.module.css'
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

const AVAILABLE_COMPONENT_TYPES = [
  { label: 'Hero', value: 'hero' },
  { label: 'Motto', value: 'motto' },
  { label: 'Toggle', value: 'toggle' },
  { label: 'Text Block', value: 'textBlock' },
]

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
  const [newComponentType, setNewComponentType] = useState<string>('')

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

  const handleFieldChange = (patch: PatchEvent | FormPatch | FormPatch[]) => {
    onChange(patch as PatchEvent, value)
  }

  const handleAddComponent = () => {
    if (!newComponentType) return
    const itemClone = {...value}
    if (!itemClone.component) itemClone.component = []
    itemClone.component = [{_type: newComponentType}]
    onChange(PatchEvent.from([itemClone]))
  }

  const renderTypePicker = () => {
    return (
      <Card padding={4}>
        <Stack space={4}>
          <div>
            <Select
              onChange={(e) => setNewComponentType(e.currentTarget.value)}
              value={newComponentType}
            >
              <option value="">Select a component type</option>
              {AVAILABLE_COMPONENT_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
          <Flex justify="flex-end" gap={2}>
            <Button
              text="Cancel"
              tone="default"
              onClick={() => handleDialogAction(CANCEL_ACTION)}
            />
            <Button
              text="Add"
              tone="primary"
              disabled={!newComponentType}
              onClick={handleAddComponent}
            />
          </Flex>
        </Stack>
      </Card>
    )
  }

  const renderEditItemForm = (item: any) => {
    const itemIsEmpty = isEmpty(item)
    const actions = [
      itemIsEmpty ? CANCEL_ACTION : CLOSE_ACTION,
      !itemIsEmpty && !readOnly && DELETE_ACTION,
    ].filter(Boolean)

    if (!item.component || item.component.length === 0) {
      // No component selected yet. Show type picker
      return (
        <Dialog
          header="Select Component Type"
          onClose={handleEditStop}
          id="grid-edit-dialog"
          width={1}
        >
          {renderTypePicker()}
        </Dialog>
      )
    }

    // Already have a component, so show normal form
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
              focusPath={focusPath || []}
              readOnly={readOnly || memberType?.readOnly}
              groups={[]}
              onFieldCollapse={function (): void {
                // no-op
              }}
              onFieldExpand={function (): void {
                // no-op
              }}
              onFieldSetCollapse={function (): void {
                // no-op
              }}
              onFieldSetExpand={function (): void {
                // no-op
              }}
              onFieldGroupSelect={function (): void {
                // no-op
              }}
              onPathFocus={function (): void {
                // no-op
              }}
              onFieldOpen={function (): void {
                // no-op
              }}
              onFieldClose={function (): void {
                // no-op
              }}
              renderInput={function (): React.ReactNode {
                // no-op
                return null
              }}
              renderField={function (): React.ReactNode {
                // no-op
                return null
              }}
              renderItem={function (): React.ReactNode {
                // no-op
                return null
              }}
              renderPreview={function (): React.ReactNode {
                // no-op
                return null
              }}
              elementProps={{
                id: '',
                onFocus: () => {},
                onBlur: () => {},
                ref: React.createRef(),
                'aria-describedby': '',
              }}
              renderDefault={function (props: InputProps): React.JSX.Element {
                // We rely on the default object input
                return <ObjectInput {...props} />
              }}
              members={[]}
              id={''}
              level={0}
              presence={[]}
              validation={[]}
              changed={false}
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

  if (!memberType) {
    return (
      <div
        className={styles.value_container}
        style={{color: 'red', fontSize: '0.9rem', padding: '0.5rem'}}
      >
        <strong>Cannot render item preview: unknown member type.</strong>
      </div>
    )
  }

  return (
    <>
      <div
        className={styles.value_container}
        tabIndex={0}
        onClick={value._key && handleEditStart}
      >
        <Preview layout="default" value={value} schemaType={memberType} />
      </div>
      {isExpanded && renderEditItemForm(value)}
    </>
  )
}
export default RenderItemValue