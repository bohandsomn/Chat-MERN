export const scrollToBottom = (element: HTMLElement | null): void => {
    element && (element.scrollTop = element.scrollHeight)
}