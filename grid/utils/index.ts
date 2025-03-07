import randomKeyFn from './randomKey'
import {resolveJSType} from './resolveJSType'

export function createProtoValue(type: any) {
  if (type.jsonType !== 'object') {
    throw new Error(
      `Invalid item type: "${type.type}". Default array input can only contain objects (for now)`
    )
  }
  const key = randomKeyFn(12)
  return type.name === 'object'
    ? {_key: key}
    : {
        _type: type.name,
        _key: key,
      }
}

export function resolveTypeName(value: any) {
  const jsType = resolveJSType(value)
  return jsType === 'object' && '_type' in value && value._type ? value._type : jsType
}

export function getMemberType(value: any, parentType: any) {
  const itemTypeName = resolveTypeName(value)
  return parentType.of.find((memberType: any) => memberType.name === itemTypeName) || parentType.of[0]
}

export const randomKey = randomKeyFn