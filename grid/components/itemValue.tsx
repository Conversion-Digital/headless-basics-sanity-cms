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
import randomKey from '../utils/randomKey'

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

  // Derive the relevant schema for the entire "griditem" object
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

  /**
   * Helper to dispatch a proper PatchEvent that replaces the entire "griditem"
   * at the array path matching its _key. If no _key is found, generate one.
   */
  const replaceItem = (updatedItem: any) => {

    if (!updatedItem) {
      console.error("replaceItem was called with a null or undefined value.");
      return;
    }

    const itemKey = updatedItem._key || randomKey()
    updatedItem._key = itemKey
    onChange(
      PatchEvent.from(
        // 'set' requires two args: (valueToSet, path)
        // Use a path object referencing the parent array item
        // whose _key matches updatedItem._key
        // For example: set({component: [...]}, [{_key: 'abc123'}])
        // This ensures we replace the item in the array by matching keys
        // (Note: If you prefixAll, you could also do it differently, but this is simpler)
        // 
        // If the user sets a new component type, we rebuild the updated item and pass it here.
        // This ensures the parent's handleItemChange won't break from missing or invalid _key references.
        // 
        // The path array can be: [ {_key: itemKey} ]
        // This means "Look in the array for the object that has _key = itemKey"
        // and set the entire new object into that array position.
        //
        // If you'd prefer prefixAll, that also works, but we keep it straightforward here.
        // 
        // Also note that if the item did not exist (like brand new), it was inserted in the parent 
        // with handleAddItem. The parent's code ensures the item has `_key`.
        // So all we do is ensure it here in case it was missing for some reason.
        //
        // We pass updatedItem directly, replacing old state with the new updated item.
        // 
        // 'PatchEvent.from(set(...))' creates a new PatchEvent with one set operation. 
        // We pass it to onChange to update the form state in Sanity.
        //
        // This approach ensures we won't get "Cannot read property '_key'" errors 
        // because we always guarantee updatedItem has a _key.
        // 
        // If you want to keep some old references, ensure that everything you need is in updatedItem.
        // But typically that's handled by the parent or by user input.
        //
        // The second argument is the "path" to where we set the new value.
        // It's referencing the array item with that `_key`.
        //
        set(updatedItem, [{_key: itemKey}])
      )
    )
  }

  const handleFieldChange = (patch: PatchEvent | FormPatch | FormPatch[]) => {
    // We are receiving partial changes from the ObjectInput
    // that modifies the entire item. We can apply them to 'value'
    // then set the new item in the array.
    // 
    // Combine the patches with the old item to produce a new item.
    // Then pass it to replaceItem() to push it back to Sanity's form state.
    const nextItem = patch instanceof PatchEvent
      ? patch.apply(value)
      : PatchEvent.from(patch).apply(value)

    replaceItem(nextItem)
  }

  const handleAddComponent = () => {
    if (!newComponentType) return
    const updatedItem = {...value}
    // If the item had no _key, let's ensure it does:
    if (!updatedItem._key) {
      updatedItem._key = randomKey()
    }
    if (!updatedItem.component) {
      updatedItem.component = []
    }
    // Place a new block into the "component" array
    updatedItem.component = [
      {
        _type: newComponentType,
        _key: randomKey(),
      },
    ]
    replaceItem(updatedItem)
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
              onFieldCollapse={() => {}}
              onFieldExpand={() => {}}
              onFieldSetCollapse={() => {}}
              onFieldSetExpand={() => {}}
              onFieldGroupSelect={() => {}}
              onPathFocus={() => {}}
              onFieldOpen={() => {}}
              onFieldClose={() => {}}
              renderInput={() => null}
              renderField={() => null}
              renderItem={() => null}
              renderPreview={() => null}
              elementProps={{
                id: '',
                onFocus: () => {},
                onBlur: () => {},
                ref: React.createRef(),
                'aria-describedby': '',
              }}
              renderDefault={(props: InputProps): React.JSX.Element => {
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

  // If for some reason memberType is not found, skip rendering the full UI
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