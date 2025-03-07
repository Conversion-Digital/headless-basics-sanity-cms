const toString = Object.prototype.toString

export function resolveJSType(val: any) {
  switch (toString.call(val)) {
    case '[object Function]':
      return 'function'
    case '[object Date]':
      return 'date'
    case '[object RegExp]':
      return 'regexp'
    case '[object Arguments]':
      return 'arguments'
    case '[object Array]':
      return 'array'
    case '[object String]':
      return 'string'
    default:
      // fall through
  }
  if (typeof val === 'object' && val && typeof val.length === 'number') {
    try {
      if (typeof (val as any).callee === 'function') {
        return 'arguments'
      }
    } catch (ex) {
      if (ex instanceof TypeError) {
        return 'arguments'
      }
    }
  }
  if (val === null) {
    return 'null'
  }
  if (val === undefined) {
    return 'undefined'
  }
  if (val && (val as any).nodeType === 1) {
    return 'element'
  }
  if (val === Object(val)) {
    return 'object'
  }
  return typeof val
}