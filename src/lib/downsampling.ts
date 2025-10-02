// LTTB mínimo para suavizar gráficos >5k puntos
export function lttb(data: { ts:number; value:number }[], threshold: number) {
  if (threshold >= data.length || threshold === 0) return data
  const sampled = []
  let bucketSize = (data.length - 2) / (threshold - 2)
  let a = 0
  sampled.push(data[a])
  for (let i = 0; i < threshold - 2; i++) {
    const start = Math.floor((i + 1) * bucketSize) + 1
    const end = Math.floor((i + 2) * bucketSize) + 1
    const avgRangeStart = start
    const avgRangeEnd = Math.min(end, data.length)
    let avgX = 0, avgY = 0, avgRangeLength = avgRangeEnd - avgRangeStart
    for (let j = avgRangeStart; j < avgRangeEnd; j++) {
      avgX += data[j].ts
      avgY += data[j].value
    }
    avgX /= avgRangeLength || 1
    avgY /= avgRangeLength || 1

    const rangeOffs = Math.floor(i * bucketSize) + 1
    const rangeTo = Math.floor((i + 1) * bucketSize) + 1
    let maxArea = -1, nextA = rangeOffs
    for (let j = rangeOffs; j < rangeTo; j++) {
      const area = Math.abs(
        (data[a].ts - avgX) * (data[j].value - data[a].value) -
        (data[a].ts - data[j].ts) * (avgY - data[a].value)
      )
      if (area > maxArea) { maxArea = area; nextA = j }
    }
    sampled.push(data[nextA])
    a = nextA
  }
  sampled.push(data[data.length - 1])
  return sampled
}
