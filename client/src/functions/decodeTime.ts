export const decodeTime = (time: number): string => {
    const second: number = 1000
    const minute: number = second * 60
    const hour  : number = minute * 60
    const day   : number = hour   * 24
    const week  : number = day    * 7
    const year  : number = week   * 52 + 2

    const difference: number = Date.now() - time
    const date: Date = new Date(time)

    const minutes: number = date.getMinutes()

    if (difference === 0) {
        return ''
    }

    if (difference < minute) {
        return `${new Date(difference).getSeconds()} sec ago`
    } else if (difference < hour) {
        return `${new Date(difference).getMinutes()} min ago`
    } else if (difference < day) {
        return `${date.getHours()}:${minutes < 10 ? '0' + minutes : minutes}`
    } else if (difference < week) {
        return `${new Date(difference).getDate()} days ago`
    } else if (difference < year) {
        return `${Math.floor(new Date(difference).getDate() / 7)} weeks ago`
    } else {
        return `${date.getMonth()+1}:${date.getDate()}:${Math.floor(time / year)}`
    }

}