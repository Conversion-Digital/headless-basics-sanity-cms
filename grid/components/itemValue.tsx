import React, { useCallback, useMemo, useState } from 'react'
import {
  Preview,
  PatchEvent,
  ObjectSchemaType,
  ObjectInput,
  set,
} from 'sanity'
import { Dialog, Card, Flex, Button, Stack, Select } from '@sanity/ui'
import styles from './itemValue.module.css'
import { getComponentMemberType } from '../utils'
import randomKey from '../utils/randomKey'
import { getMinimalSchemaFields } from '../getMinimalSchemaFields'
// import { createPrepareFormState } from 'sanity/core/form/store/formState'
import { createPrepareFormState } from '../../sanity-next/packages/sanity/src/core/form/store/formState'
// import { ObjectInput } from "../../sanity-next/packages/sanity/src/core/form/inputs/ObjectInput"
import { useFormBuilder } from 'sanity'


const prepareFormState = createPrepareFormState();

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
  // new prop for passing in the correct members
  members?: any[]
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
    focusPath,
    readOnly,
    onChange,
    onRemove,
    members = []
  } = props

  const [isExpanded, setIsExpanded] = useState(false)
  const [newComponentType, setNewComponentType] = useState<string>('')

  // Derive the relevant schema for the entire "griditem" object
  const memberType = getComponentMemberType(value, type) as ObjectSchemaType

  // Generate the form state
  const formState = useMemo(() => {
    if (!memberType) return null;

    return prepareFormState({
      schemaType: memberType,
      documentValue: value,
      comparisonValue: null,
      currentUser: null,
      hidden: false,
      readOnly: false,
      openPath: [],
      focusPath: [],
      presence: [],
      validation: [],
      fieldGroupState: undefined,
      collapsedPaths: undefined,
      collapsedFieldSets: undefined,
      changesOpen: false,
    });
  }, [memberType, value]);

  if (!formState) return null; // Handle errors

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

  const replaceItem = (updatedItem: any) => {
    if (!updatedItem) {
      console.error("replaceItem was called with a null or undefined value.")
      return
    }
    const itemKey = updatedItem._key || randomKey()
    updatedItem._key = itemKey
    onChange(
      PatchEvent.from(
        set(updatedItem, [{_key: itemKey}])
      ),
      updatedItem
    )
  }

  const handleFieldChange = useCallback(
    (patchEvent: PatchEvent) => {
      // Apply the incoming patch to the item’s current value
      let nextItem = patchEvent.apply(value) || {}

      // Ensure nextItem has placeholders for *all* declared fields on `memberType`
      const minimalFields = getMinimalSchemaFields(type, memberType?.name)
      nextItem = ensureAllSchemaFields(nextItem, minimalFields)

      // If no _key, generate one so it remains a stable array item
      if (!nextItem._key) {
        nextItem._key = randomKey()
      }

      // Finally, call onChange with the updated item
      onChange(PatchEvent.from(set(nextItem)), nextItem)
    },
    [onChange, type, value, memberType]
  )

  const handleAddComponent = () => {
    if (!newComponentType) return
    const updatedItem = { ...value }
    if (!updatedItem._key) {
      updatedItem._key = randomKey()
    }
    if (!updatedItem.component) {
      updatedItem.component = []
    }
    updatedItem.component = [
      {
        _type: newComponentType,
        _key: randomKey(),
      },
    ]
    updatedItem._componenttype = newComponentType
    replaceItem(updatedItem)
    handleDialogAction(CLOSE_ACTION)
  }

  const renderTypePicker = () => (
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

  const getRenderedUnknownFields = (item: any) => {
    if (!memberType?.fields) {
      return null;
    }
  
    const knownFieldNames = memberType.fields.map((field) => field.name);
    const unknownFields = Object.keys(item || {}).filter(
      (key) => !key.startsWith('_') && !knownFieldNames.includes(key)
    );
  
    if (unknownFields.length === 0) {
      return null;
    }
  
    return (
      <Stack as="ul" space={3}>
        {unknownFields.map((fieldName) => (
          <div key={fieldName}>{fieldName}</div>
        ))}
      </Stack>
    );
  };

  const renderEditItemForm = (item: any) => {
    const itemIsEmpty = isEmpty(item)
    const actions = [
      itemIsEmpty ? CANCEL_ACTION : CLOSE_ACTION,
      !itemIsEmpty && !readOnly && DELETE_ACTION,
    ].filter(Boolean)

    if (!item?._componenttype) {
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

    console.log(`[itemValue][191]][${memberType?.name}] RenderItemValue members: ${JSON.stringify(members)}`)

    console.log(`[itemValue][193] RenderItemValue item: ${JSON.stringify(item)}`)

    const fullyPopulatedMembers = formState.members || [];

    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key: any, value: WeakKey | null) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular]"; // Replace circular references with a placeholder
          }
          seen.add(value);
        }
        return value;
      };
    };

    console.log(`effectiveMembers: ${JSON.stringify(fullyPopulatedMembers, getCircularReplacer())}`, fullyPopulatedMembers);

    const formBuilder = useFormBuilder()
    return (
      <Dialog
        header={`Edit ${item?._componenttype}`}
        onClose={handleEditStop}
        id="grid-edit-dialog"
        width={1}
      >
        <Card padding={4}>
          <Stack space={4}>
            Uknown Fields {getRenderedUnknownFields({"_key" : item?._componentkey, "_type" : item?._componenttype})} :::
            <ObjectInput
              value={{"_key" : item?._componentkey, "_type" : item?._componenttype}}
              schemaType={memberType}
              onChange={handleFieldChange}
              path={[{ _key: item._componentkey }]}
              members={fullyPopulatedMembers}
              groups={[]}
              readOnly={readOnly || (typeof memberType?.readOnly === 'boolean' ? memberType.readOnly : undefined)}
              // We can rely on default form rendering
              // onFieldCollapse={function (): void {
              //   // no-op
              //   useFormBuilder
              // }}
              // onFieldExpand={function (): void {
              //   // no-op
              // }}
              // onFieldSetCollapse={function (): void {
              //   // no-op
              // }}
              // onFieldSetExpand={function (): void {
              //   // no-op
              // }}
              // onFieldGroupSelect={function (): void {
              //   // no-op
              // }}
              // onPathFocus={function (): void {
              //   // no-op
              // }}
              // onFieldOpen={function (): void {
              //   // no-op
              // }}
              // onFieldClose={function (): void {
              //   // no-op
              // }}
              renderInput={formBuilder.renderInput}
              renderField={formBuilder.renderField}
              renderItem={formBuilder.renderItem}
              renderPreview={formBuilder.renderPreview}
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
        style={{ color: 'red', fontSize: '0.9rem', padding: '0.5rem' }}
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
        {value?._componenttype}
        <Preview layout="default" value={value} schemaType={memberType} />
      </div>
      {isExpanded && renderEditItemForm(value)}
    </>
  )
}


function ensureAllSchemaFields(value: Record<string, unknown>, schemaFields: any[]) {
  // Ensure that every declared schema field is present as a key in `value`.
  // If missing, add as `undefined` or a minimal structure (e.g., {}).
  const nextValue = {...(value || {})}
  schemaFields.forEach((fieldDef) => {
    if (!(fieldDef.name in nextValue)) {
      nextValue[fieldDef.name] = undefined
    }
  })
  return nextValue
}

export default RenderItemValue