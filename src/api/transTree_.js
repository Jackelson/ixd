// 将json串转换成树形结构
export function transTree(a, idStr, pidStr, chindrenStr) {
  // let r = null
  const r = []
  const hash = {}
  const id = idStr
  const pid = pidStr
  const children = chindrenStr
  const len = a.length
  for (let i = 0; i < len; i++) {
    hash[a[i][id]] = a[i]
  }
  for (let j = 0; j < len; j++) {
    const aVal = a[j]
    const hashVP = hash[aVal[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(aVal)
    } else {
      // r = aVal
      r.push(aVal)
    }
  }
  return r
}
