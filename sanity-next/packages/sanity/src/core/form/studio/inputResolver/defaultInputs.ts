import {type ComponentType} from 'react'
import React, {lazy} from 'react';
import {type FIXME} from '../../../FIXME'
import {UniversalArrayInput} from '../../inputs/arrays/UniversalArrayInput'
import {BooleanInput} from '../../inputs/BooleanInput'
import {DateInput, DateTimeInput} from '../../inputs/DateInputs'
import {EmailInput} from '../../inputs/EmailInput'
import {NumberInput} from '../../inputs/NumberInput'
// import {ObjectInput} from '../../inputs/ObjectInput'
import {SlugInput} from '../../inputs/Slug/SlugInput'
import {StringInput} from '../../inputs/StringInput'
import {TextInput} from '../../inputs/TextInput'
import {UrlInput} from '../../inputs/UrlInput'
import {StudioCrossDatasetReferenceInput} from '../inputs/crossDatasetReference/StudioCrossDatasetReferenceInput'
import {StudioFileInput} from '../inputs/StudioFileInput'
import {StudioImageInput} from '../inputs/StudioImageInput'

const LazyObjectInput = lazy(() => import('../../inputs/ObjectInput'));

export const defaultInputs: Record<string, ComponentType<FIXME>> = {
  document: LazyObjectInput,
  object: LazyObjectInput,
  array: UniversalArrayInput,
  boolean: BooleanInput,
  number: NumberInput,
  text: TextInput,
  email: EmailInput,
  datetime: DateTimeInput,
  date: DateInput,
  url: UrlInput,
  image: StudioImageInput,
  file: StudioFileInput,
  string: StringInput,
  slug: SlugInput,
  crossDatasetReference: StudioCrossDatasetReferenceInput,
}
