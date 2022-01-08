export const getTime = (time: number): string => {
    const date: Date = new Date(time)
    const hours = date.getHours()
    const minutes = date.getMinutes()

    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`
}