/**
 * Merge two lists of objects
 * @param a First list
 * @param b Second list
 * @returns The merged list
 */
export default function merge(a:any[], b:any[]) {
    if (a == null) a = [];
    if (b == null) b = [];
    return [...new Set([...a, ...b])];
}