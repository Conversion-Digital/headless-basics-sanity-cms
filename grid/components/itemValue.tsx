import React, { useState } from 'react'
import { Preview, PatchEvent, ObjectInput, FormPatch, FieldProps, InputProps, ObjectItemProps, Path, RenderPreviewCallbackProps } from 'sanity'
import { Dialog, Card, Flex, Button, Stack } from '@sanity/ui'
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
  const handleFieldChange = (patch: PatchEvent | FormPatch | FormPatch[]) => {
    onChange(patch as PatchEvent, value)
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
              focusPath={focusPath || []}
              readOnly={readOnly || memberType?.readOnly} groups={[]} onFieldCollapse={function (fieldName: string): void {
                throw new Error('Function not implemented.')
              } } onFieldExpand={function (fieldName: string): void {
                throw new Error('Function not implemented.')
              } } onFieldSetCollapse={function (fieldSetName: string): void {
                throw new Error('Function not implemented.')
              } } onFieldSetExpand={function (fieldSetName: string): void {
                throw new Error('Function not implemented.')
              } } onFieldGroupSelect={function (groupName: string): void {
                throw new Error('Function not implemented.')
              } } onPathFocus={function (path: Path): void {
                throw new Error('Function not implemented.')
              } } onFieldOpen={function (fieldName: string): void {
                throw new Error('Function not implemented.')
              } } onFieldClose={function (fieldName: string): void {
                throw new Error('Function not implemented.')
              } } renderInput={function (inputProps: Omit<InputProps, 'renderDefault'>): React.ReactNode {
                throw new Error('Function not implemented.')
              } } renderField={function (fieldProps: Omit<FieldProps, 'renderDefault'>): React.ReactNode {
                throw new Error('Function not implemented.')
              } } renderItem={function (itemProps: Omit<ObjectItemProps, 'renderDefault'>): React.ReactNode {
                throw new Error('Function not implemented.')
              } } renderPreview={function (props: RenderPreviewCallbackProps): React.ReactNode {
                throw new Error('Function not implemented.')
              } } elementProps={{ id: '', onFocus: () => {}, onBlur: () => {}, ref: React.createRef(), 'aria-describedby': '' }} renderDefault={function (props: InputProps): React.JSX.Element {
                throw new Error('Function not implemented.')
              } } members={[]} id={''} level={0} presence={[]} validation={[]} changed={false}            />
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

  // If for some reason memberType is not found, skip rendering Preview to avoid crashes
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