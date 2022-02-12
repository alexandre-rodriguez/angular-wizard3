export function merge(target: any, source: any) {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (let key of Object.keys(source)) {
      if (source[key] instanceof Object && key in target) {
          Object.assign(source[key], merge(target[key], source[key]));
      }
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source);

  return target;
}
